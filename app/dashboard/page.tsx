'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { useNotification } from '../../components/NotificationProvider';

export interface DonorItem {
  id: string;
  nama: string;
  golDarah: string;
  jenis: string;
  penyebab: string;
  tanggal?: string;
  catatan?: string;
}

const defaultData: DonorItem[] = [
  { id: "PND-355", nama: "tini", golDarah: "AB", jenis: "Medis", penyebab: "Tekanan Darah / Tensi Tinggi", tanggal: "2026-08-26" },
  { id: "PND-379", nama: "Susi Susanti", golDarah: "O", jenis: "Medis", penyebab: "Tekanan Darah / Tensi Tinggi", tanggal: "2026-08-26" },
  { id: "PND-653", nama: "luluk", golDarah: "A", jenis: "Aftap (Kegagalan)", penyebab: "Aliran Darah Berhenti / Macet (-)", tanggal: "2026-08-26" }
];

export default function DashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [masterData, setMasterData] = useState<DonorItem[]>(defaultData);
  const [searchVal, setSearchVal] = useState<string>('');
  const [golVal, setGolVal] = useState<string>('');
  const [gagalVal, setGagalVal] = useState<string>('');

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('pmi_gagal_donor');
        if (stored) {
          setMasterData(JSON.parse(stored));
        } else {
          localStorage.setItem('pmi_gagal_donor', JSON.stringify(defaultData));
        }
      }
    } catch (e) {
      console.error("Storage error:", e);
    }

    // Prefetch connected routes for instant transitions
    router.prefetch('/db');
    router.prefetch('/screening');
    router.prefetch('/aftap');
    router.prefetch('/edit');
    router.prefetch('/login');
  }, [router]);

  const saveMasterData = (newData: DonorItem[]) => {
    setMasterData(newData);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('pmi_gagal_donor', JSON.stringify(newData));
      }
    } catch (e) {
      console.error("Storage error:", e);
    }
  };

  const hariIni = new Date().toISOString().split('T')[0];
  const bulanIni = hariIni.substring(0, 7);

  let totalGagalBulanan = 0;
  let totalGagalHariIni = 0;
  let totalKantongDimusnahkan = 0;

  masterData.forEach((item) => {
    const tgl = item.tanggal || hariIni;
    if (tgl.substring(0, 7) === bulanIni) totalGagalBulanan++;
    if (tgl === hariIni) totalGagalHariIni++;
    if (item.jenis && item.jenis.toLowerCase().includes('aftap')) totalKantongDimusnahkan++;
  });

  const filteredData = masterData.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchVal.toLowerCase()) ||
      item.id.toLowerCase().includes(searchVal.toLowerCase());
    const matchGol = golVal === '' || item.golDarah === golVal;
    const katJenis = item.jenis || 'Medis';
    const matchGagal =
      gagalVal === '' ||
      katJenis.toLowerCase().includes(gagalVal.toLowerCase()) ||
      (item.penyebab && item.penyebab.toLowerCase().includes(gagalVal.toLowerCase()));

    return matchSearch && matchGol && matchGagal;
  });

  const { showConfirm, showAlert } = useNotification();

  const handleDeleteItem = async (id: string) => {
    const isConfirmed = await showConfirm(
      'Apakah Anda yakin ingin menghapus data pendonor gagal ini dari sistem?',
      'Hapus Data Pendonor'
    );
    if (isConfirmed) {
      const updated = masterData.filter((item) => item.id !== id);
      saveMasterData(updated);
      showAlert('Data pendonor berhasil dihapus.', 'Berhasil', 'success');
    }
  };

  const handleResetData = async () => {
    const isConfirmed = await showConfirm(
      'Apakah Anda yakin ingin mereset seluruh data kembali ke contoh awal?',
      'Reset Data'
    );
    if (isConfirmed) {
      saveMasterData(defaultData);
      showAlert('Data berhasil di-reset ke data default.', 'Berhasil', 'success');
    }
  };

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      showAlert('Tidak ada data untuk diekspor!', 'Data Kosong', 'warning');
      return;
    }
    const dataExcel = filteredData.map((item, index) => ({
      No: index + 1,
      'ID Pendonor': item.id,
      'Nama Lengkap': item.nama,
      'Golongan Darah': item.golDarah || '-',
      'Jenis Kegagalan': item.jenis || 'Medis',
      'Penyebab / Catatan': item.penyebab,
      Tanggal: item.tanggal || hariIni,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Pendonor Gagal');
    XLSX.writeFile(workbook, 'Daftar_Pendonor_Gagal_PMI.xlsx');
  };

  const handleExportPDF = async () => {
    if (filteredData.length === 0) {
      alert('Tidak ada data untuk diekspor!');
      return;
    }
    try {
      const html2pdfModule = (await import('html2pdf.js')).default;
      const element = document.getElementById('printableTable');
      if (!element) return;

      const clone = element.cloneNode(true) as HTMLElement;
      const headers = clone.querySelectorAll('th');
      if (headers.length > 0) headers[headers.length - 1].remove();
      const rows = clone.querySelectorAll('tr');
      rows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) cells[cells.length - 1].remove();
      });

      const opt = {
        margin: 10,
        filename: 'Daftar_Pendonor_Gagal_PMI.pdf',
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'landscape' as const },
      };

      html2pdfModule().set(opt).from(clone).save();
    } catch (e) {
      console.error(e);
      window.print();
    }
  };

  return (
    <div className="app-container">
      {/* HEADER UTAMA */}
      <header className="main-header">
        <div>
          <h1 className="brand-title">SIM-GASUK</h1>
          <h2 className="page-title">Dashboard</h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p className="sub-title">Unit Transfusi Darah PMI Kota Pasuruan</p>
          <button onClick={() => router.push('/login')} className="btn-logout">
            Logout <span>↪</span>
          </button>
        </div>
      </header>

      {/* NAVIGATION BAR */}
      <nav className="nav-bar">
        <div className="logo-pmi-mini">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://upload.wikimedia.org/wikipedia/id/6/65/Pmi.png"
            alt="Logo PMI"
            className="logo-img"
          />
        </div>
        <div className="nav-links">
          <Link href="/dashboard" prefetch={true} className="nav-item active">
            Dashboard
          </Link>
          <Link href="/db" prefetch={true} className="nav-item">
            Data Pendonor
          </Link>
          <Link href="/screening" prefetch={true} className="nav-item">
            Laporan Insiden
          </Link>
        </div>
      </nav>

      {/* FILTER BAR */}
      <div className="filter-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Cari nama / ID Pendonor"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>🔍</span>
        </div>
        <div className="filter-box">
          <label>Gol.Darah</label>
          <select value={golVal} onChange={(e) => setGolVal(e.target.value)}>
            <option value="">Semua</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="AB">AB</option>
            <option value="O">O</option>
          </select>
        </div>
        <div className="filter-box">
          <label>Jenis Kegagalan</label>
          <select value={gagalVal} onChange={(e) => setGagalVal(e.target.value)}>
            <option value="">Semua</option>
            <option value="Tekanan Darah">Tekanan Darah</option>
            <option value="Hemoglobin">Hemoglobin (Hb)</option>
            <option value="Medis">Sebab Medis</option>
            <option value="Aftap">Aftap (Kegagalan)</option>
          </select>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="cards-grid">
        <div className="stat-card">
          <h3>Total Gagal Donor</h3>
          <p className="card-desc">Total Data Perbulan</p>
          <p className="card-number">{totalGagalBulanan}</p>
        </div>
        <div className="stat-card">
          <h3>Total Pendonor</h3>
          <p className="card-desc">Total Pendonor yang Gagal Hari Ini</p>
          <p className="card-number">{totalGagalHariIni}</p>
        </div>
        <div className="stat-card">
          <h3>Total Kantong</h3>
          <p className="card-desc">Total Kantong yang Dimusnahkan</p>
          <p className="card-number">{totalKantongDimusnahkan}</p>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="table-container">
        <div className="table-header">
          <h3>Daftar Pendonor Gagal</h3>
          <div className="table-actions">
            <button onClick={handleResetData} className="btn-text">
              ↻ Reset Data Contoh
            </button>
            <button onClick={handleExportExcel} className="btn-outline btn-green">
              📄 Export Excel
            </button>
            <button onClick={handleExportPDF} className="btn-outline btn-red">
              📄 Export PDF
            </button>
          </div>
        </div>

        <div className="responsive-table">
          <table id="printableTable">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>No</th>
                <th>ID Pendonor</th>
                <th>Nama</th>
                <th>Gol.Darah</th>
                <th>Jenis Kegagalan</th>
                <th>Penyebab / Catatan</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: '#9CA3AF' }}>
                    Data tidak ditemukan
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.id + index}>
                    <td>{index + 1}</td>
                    <td style={{ fontWeight: 600 }}>{item.id}</td>
                    <td>{item.nama}</td>
                    <td>
                      <span className="badge-goldar">{item.golDarah || '-'}</span>
                    </td>
                    <td>{item.jenis || 'Medis'}</td>
                    <td style={{ color: '#6B7280' }}>{item.penyebab}</td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => handleDeleteItem(item.id)} className="btn-icon btn-del" title="Hapus">
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <Link href="/db" className="btn-add">
            Donor Baru
          </Link>
          <div className="pagination">
            <button className="page-nav" disabled>&lt;</button>
            <button className="page-num active">1</button>
            <button className="page-num">2</button>
            <button className="page-nav">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}