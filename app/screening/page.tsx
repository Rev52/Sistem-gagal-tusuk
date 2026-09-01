'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export interface DonorScreeningInfo {
  nik?: string;
  nama?: string;
  alamat?: string;
  tempat_lahir?: string;
  tempatLahir?: string;
  tgl_lahir?: string;
  tanggalLahir?: string;
  goldar?: string;
  golDarah?: string;
  nohp?: string;
  noHp?: string;
}

export interface VitalSigns {
  bb: string;
  tb: string;
  tensi: string;
  suhu: string;
  nadi: string;
  hb: string;
  petugas: string;
}

export interface FailedScreeningSection {
  penyebab: string;
  tgl_kembali: string;
  petugas: string;
}

export default function ScreeningPage() {
  const router = useRouter();
  const [donor, setDonor] = useState<DonorScreeningInfo>({
    nik: '-',
    nama: '-',
    alamat: '-',
    tempat_lahir: '-',
    tgl_lahir: '-',
    goldar: '-',
    nohp: '-',
  });

  const [vitals, setVitals] = useState<VitalSigns>({
    bb: '',
    tb: '',
    tensi: '',
    suhu: '',
    nadi: '',
    hb: '',
    petugas: '',
  });

  const [failedSection, setFailedSection] = useState<FailedScreeningSection>({
    penyebab: '',
    tgl_kembali: '',
    petugas: '',
  });

  useEffect(() => {
    const stored = sessionStorage.getItem('currentDonor');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setDonor(parsed);
      } catch (e) {
        console.error(e);
      }
    }

    router.prefetch('/aftap');
    router.prefetch('/dashboard');
    router.prefetch('/db');
    router.prefetch('/login');
  }, [router]);

  const handleDemoFill = () => {
    setDonor({
      nik: '3515091205950001',
      nama: 'Budi Santoso',
      alamat: 'Jl. Merdeka No. 45 RT 02 RW 05',
      tempat_lahir: 'Pasuruan',
      tgl_lahir: '12 Mei 1995',
      goldar: 'O+',
      nohp: '0812-3456-7890',
    });

    setVitals({
      bb: '65 kg',
      tb: '170 cm',
      tensi: '120/80 mmHg',
      suhu: '36.5 °C',
      nadi: '80 x/menit',
      hb: '14.2 g/dL',
      petugas: 'Dr. Ahmad Fauzi',
    });
  };

  const handleSimpanGagal = () => {
    const { penyebab, tgl_kembali, petugas } = failedSection;
    const petugasFix = petugas.trim() || vitals.petugas.trim();

    if (!penyebab) {
      alert('⚠️ Mohon pilih Penyebab Kegagalan screening terlebih dahulu!');
      return;
    }
    if (!tgl_kembali) {
      alert('⚠️ Mohon tentukan Tanggal Kembali pendonor!');
      return;
    }
    if (!petugasFix) {
      alert('⚠️ Mohon isi nama Petugas Screening!');
      return;
    }

    const databaseDashboard = JSON.parse(localStorage.getItem('pmi_gagal_donor') || '[]');
    const insidenScreeningGagal = {
      id: 'PND-' + Math.floor(100 + Math.random() * 900),
      nama: donor.nama !== '-' ? donor.nama : 'Budi Santoso',
      golDarah: donor.goldar !== '-' ? donor.goldar : 'O+',
      jenis: 'Medis',
      penyebab: penyebab,
      catatan: `Hb/Tensi tidak memenuhi syarat. Kembali tanggal: ${tgl_kembali} (Petugas: ${petugasFix})`,
      tanggal: new Date().toISOString().split('T')[0],
    };

    databaseDashboard.unshift(insidenScreeningGagal);
    localStorage.setItem('pmi_gagal_donor', JSON.stringify(databaseDashboard));

    alert(`🎉 Data kegagalan berhasil disimpan ke Dashboard!\nPenyebab: ${penyebab}\nKembali pada: ${tgl_kembali}`);
    sessionStorage.removeItem('currentDonor');
    router.push('/dashboard');
  };

  const handleLanjutAftap = () => {
    const { bb, tensi, hb, petugas } = vitals;
    if (!bb.trim() || !tensi.trim() || !hb.trim() || !petugas.trim()) {
      alert('⚠️ Mohon lengkapi data Vital Sign (BB, Tensi, HB) dan Nama Petugas terlebih dahulu sebelum lanjut ke proses Aftap!');
      return;
    }

    const updatedDonor = {
      ...donor,
      ...vitals,
      petugas_screening: petugas.trim(),
    };

    sessionStorage.setItem('currentDonor', JSON.stringify(updatedDonor));
    alert('Hasil screening tersimpan dengan status: LOLOS.\nMenuju ke halaman Aftap (Pengambilan Darah).');
    router.push('/aftap');
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="main-header">
        <div>
          <div className="brand-title">SIM-GASUK</div>
          <h1 className="page-title">Screening Pendonor</h1>
        </div>
        <div>
          <div className="sub-title">Unit Transfusi Darah PMI Kota Pasuruan</div>
          <button onClick={() => router.push('/login')} className="btn-logout">
            Logout <i className="fas fa-sign-out-alt"></i>
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
          <Link href="/dashboard" prefetch={true} className="nav-item">
            Dashboard
          </Link>
          <Link href="/db" prefetch={true} className="nav-item">
            Data Pendonor
          </Link>
          <Link href="/screening" prefetch={true} className="nav-item active">
            Screening
          </Link>
        </div>
      </nav>

      {/* UTILITY BAR */}
      <div className="utility-actions">
        <button type="button" onClick={handleDemoFill} className="btn-demo">
          ⚡ Isian Otomatis (Demo)
        </button>
      </div>

      {/* GRID LAYOUT */}
      <div className="screening-grid-layout">
        {/* KOLOM KIRI */}
        <div className="grid-column-stack">
          {/* CARD INFORMASI PENDONOR */}
          <div className="form-card card-pendonor-info">
            <h3 className="form-card-title">Informasi Pendonor</h3>
            <div className="info-list-container">
              <div className="info-row">
                <span>NIK</span>
                <strong>{donor.nik || '-'}</strong>
              </div>
              <div className="info-row">
                <span>Nama Lengkap</span>
                <strong>{donor.nama || '-'}</strong>
              </div>
              <div className="info-row">
                <span>Alamat</span>
                <strong>{donor.alamat || '-'}</strong>
              </div>
              <div className="info-row">
                <span>Tempat, Tanggal Lahir</span>
                <strong>
                  {donor.tempat_lahir || donor.tempatLahir || '-'}, {donor.tgl_lahir || donor.tanggalLahir || '-'}
                </strong>
              </div>
              <div className="info-row">
                <span>Golongan Darah</span>
                <strong className="badge-goldar-text">{donor.goldar || donor.golDarah || '-'}</strong>
              </div>
              <div className="info-row">
                <span>No. HP</span>
                <strong>{donor.nohp || donor.noHp || '-'}</strong>
              </div>
            </div>
          </div>

          {/* CARD HASIL SCREENING GAGAL */}
          <div className="form-card">
            <h3 className="form-card-title-failed">Hasil Screening: Gagal</h3>
            <div className="failed-box-stack">
              <div className="input-field-block">
                <label>Penyebab Kegagalan</label>
                <select
                  className="form-input select-cursor"
                  value={failedSection.penyebab}
                  onChange={(e) =>
                    setFailedSection((prev) => ({ ...prev, penyebab: e.target.value }))
                  }
                >
                  <option value="">-- Pilih Penyebab Kegagalan --</option>
                  <option value="Tekanan Darah Tinggi">Tekanan Darah Tinggi (Hipertensi)</option>
                  <option value="Tekanan Darah Rendah">Tekanan Darah Rendah (Hipotensi)</option>
                  <option value="Hemoglobin (Hb) Rendah">Hemoglobin (Hb) Rendah</option>
                  <option value="Hemoglobin (Hb) Terlalu Tinggi">Hemoglobin (Hb) Terlalu Tinggi</option>
                  <option value="Berat Badan Kurang">Berat Badan Kurang (&lt; 45 kg)</option>
                  <option value="Riwayat Minum Obat / Medis">Riwayat Minum Obat / Medis</option>
                </select>
              </div>

              <div className="input-field-block">
                <label>Tanggal Kembali</label>
                <input
                  type="date"
                  className="form-input"
                  value={failedSection.tgl_kembali}
                  onChange={(e) =>
                    setFailedSection((prev) => ({ ...prev, tgl_kembali: e.target.value }))
                  }
                />
              </div>

              <div className="input-field-block">
                <label>Petugas Screening</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nama Petugas Medis"
                  value={failedSection.petugas}
                  onChange={(e) =>
                    setFailedSection((prev) => ({ ...prev, petugas: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN */}
        <div className="grid-column-stack">
          <div className="vital-inputs-wrapper">
            <div className="form-card-mini">
              <label>Berat Badan</label>
              <input
                type="text"
                placeholder="misal: 65 kg"
                value={vitals.bb}
                onChange={(e) => setVitals((prev) => ({ ...prev, bb: e.target.value }))}
              />
            </div>
            <div className="form-card-mini">
              <label>Tinggi Badan</label>
              <input
                type="text"
                placeholder="misal: 170 cm"
                value={vitals.tb}
                onChange={(e) => setVitals((prev) => ({ ...prev, tb: e.target.value }))}
              />
            </div>
            <div className="form-card-mini">
              <label>Tekanan Darah</label>
              <input
                type="text"
                placeholder="misal: 120/80 mmHg"
                value={vitals.tensi}
                onChange={(e) => setVitals((prev) => ({ ...prev, tensi: e.target.value }))}
              />
            </div>
            <div className="form-card-mini">
              <label>Suhu Tubuh</label>
              <input
                type="text"
                placeholder="misal: 36.5 °C"
                value={vitals.suhu}
                onChange={(e) => setVitals((prev) => ({ ...prev, suhu: e.target.value }))}
              />
            </div>
            <div className="form-card-mini">
              <label>Denyut Nadi</label>
              <input
                type="text"
                placeholder="misal: 80 x/menit"
                value={vitals.nadi}
                onChange={(e) => setVitals((prev) => ({ ...prev, nadi: e.target.value }))}
              />
            </div>
            <div className="form-card-mini">
              <label>Kadar Hemoglobin (Hb)</label>
              <input
                type="text"
                placeholder="misal: 14.2 g/dL"
                value={vitals.hb}
                onChange={(e) => setVitals((prev) => ({ ...prev, hb: e.target.value }))}
              />
            </div>

            <div className="form-card-mini border-space-top">
              <label>Petugas Screening</label>
              <input
                type="text"
                placeholder="Nama Petugas"
                value={vitals.petugas}
                onChange={(e) => setVitals((prev) => ({ ...prev, petugas: e.target.value }))}
              />
            </div>
          </div>

          <div className="action-buttons-container">
            <button onClick={handleSimpanGagal} className="btn-action-gagal">
              Gagal
            </button>
            <button onClick={handleLanjutAftap} className="btn-action-aftap">
              Lanjut Aftap
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="main-footer">
        <span>Unit Transfusi Darah PMI Kota Pasuruan</span>
        <div className="logo-pmi-mini scale-down">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://upload.wikimedia.org/wikipedia/id/6/65/Pmi.png"
            alt="Mini Logo PMI"
            className="logo-img"
          />
        </div>
      </footer>
    </div>
  );
}
