'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export interface DonorFormData {
  nik: string;
  nama: string;
  tempat_lahir: string;
  tgl_lahir: string;
  jk: string;
  pekerjaan: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  nohp: string;
  bb: string;
  tb: string;
  goldar: string;
  penyakit: string;
  operasi: string;
  catatan: string;
  alamat: string;
}

export default function InputDataPendonorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<DonorFormData>({
    nik: '',
    nama: '',
    tempat_lahir: '',
    tgl_lahir: '',
    jk: '',
    pekerjaan: '',
    kelurahan: '',
    kecamatan: '',
    kota: '',
    nohp: '',
    bb: '',
    tb: '',
    goldar: '',
    penyakit: '',
    operasi: '',
    catatan: '',
    alamat: '',
  });

  useEffect(() => {
    router.prefetch('/screening');
    router.prefetch('/dashboard');
    router.prefetch('/aftap');
    router.prefetch('/login');
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFillDemo = () => {
    setFormData({
      nik: '3515091205950001',
      nama: 'Budi Santoso',
      tempat_lahir: 'Pasuruan',
      tgl_lahir: '12 Mei 1995',
      jk: 'Laki-laki',
      pekerjaan: 'Wiraswasta',
      kelurahan: 'Sebani',
      kecamatan: 'Gadingrejo',
      kota: 'Kab. Pasuruan',
      nohp: '0812-3456-7890',
      bb: '65 kg',
      tb: '170 cm',
      goldar: 'O+',
      penyakit: 'Tidak ada',
      operasi: 'Tidak ada',
      catatan: '-',
      alamat: 'Jl. Merdeka No. 45 RT 02 RW 05',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const donorData = {
      nik: formData.nik || '-',
      nama: formData.nama || '-',
      tempat_lahir: formData.tempat_lahir || '',
      tgl_lahir: formData.tgl_lahir || '-',
      jk: formData.jk || '-',
      pekerjaan: formData.pekerjaan || '-',
      alamat: formData.alamat || `${formData.kelurahan}, ${formData.kecamatan}`,
      kelurahan: formData.kelurahan || '-',
      kecamatan: formData.kecamatan || '-',
      kota: formData.kota || '-',
      nohp: formData.nohp || '-',
      bb: formData.bb || '-',
      tb: formData.tb || '-',
      goldar: formData.goldar || '-',
      penyakit: formData.penyakit || '-',
      operasi: formData.operasi || '-',
      catatan: formData.catatan || '-',
    };

    sessionStorage.setItem('currentDonor', JSON.stringify(donorData));
    router.push('/screening');
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="main-header">
        <div>
          <div className="brand-title">SIM-GASUK</div>
          <h1 className="page-title">Data Pendonor</h1>
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
          <Link href="/db" prefetch={true} className="nav-item active">
            Data Pendonor
          </Link>
          <Link href="/screening" prefetch={true} className="nav-item">
            Laporan Insiden 
          </Link>
        </div>
      </nav>

      {/* UTILITY ACTIONS */}
      <div className="utility-actions">
        <button type="button" onClick={handleFillDemo} className="btn-demo">
          ⚡ Isian Otomatis (Demo)
        </button>
        <div className="spacer"></div>
        <button onClick={() => window.print()} className="btn-print">
          <i className="fas fa-print"></i> Cetak Data Pendonor
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <div className="form-grid-layout">
          {/* CARD 1: IDENTITAS DIRI */}
          <div className="form-card card-span-2">
            <h3 className="form-card-title">Identitas Diri</h3>
            <div className="form-columns">
              <div className="form-column-inner">
                <div className="form-group-db">
                  <span>NIK</span>
                  <input
                    type="text"
                    id="nik"
                    className="db-input"
                    placeholder="Masukkan NIK"
                    value={formData.nik}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group-db">
                  <span>Nama Lengkap</span>
                  <input
                    type="text"
                    id="nama"
                    className="db-input"
                    placeholder="Masukkan Nama Lengkap"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group-db">
                  <span>Tempat, Tanggal Lahir</span>
                  <div className="inline-flex-inputs">
                    <input
                      type="text"
                      id="tempat_lahir"
                      placeholder="Tempat"
                      className="db-input w-city"
                      value={formData.tempat_lahir}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      id="tgl_lahir"
                      placeholder="Tanggal Lahir"
                      className="db-input w-date"
                      value={formData.tgl_lahir}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group-db">
                  <span>Jenis Kelamin</span>
                  <input
                    type="text"
                    id="jk"
                    className="db-input"
                    placeholder="-"
                    value={formData.jk}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group-db">
                  <span>Pekerjaan</span>
                  <input
                    type="text"
                    id="pekerjaan"
                    className="db-input"
                    placeholder="-"
                    value={formData.pekerjaan}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-column-inner">
                <div className="form-group-db">
                  <span>Kelurahan / Desa</span>
                  <input
                    type="text"
                    id="kelurahan"
                    className="db-input"
                    placeholder="-"
                    value={formData.kelurahan}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group-db">
                  <span>Kecamatan</span>
                  <input
                    type="text"
                    id="kecamatan"
                    className="db-input"
                    placeholder="-"
                    value={formData.kecamatan}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group-db">
                  <span>Kota / Kabupaten</span>
                  <input
                    type="text"
                    id="kota"
                    className="db-input"
                    placeholder="-"
                    value={formData.kota}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: KONTAK */}
          <div className="form-card">
            <h3 className="form-card-title">Kontak</h3>
            <div className="contact-box-stack">
              <div className="contact-field">
                <label>
                  <i className="far fa-square"></i> No. HP
                </label>
                <input
                  type="text"
                  id="nohp"
                  className="input-left"
                  placeholder="-"
                  value={formData.nohp}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* CARD 3: RIWAYAT KESEHATAN */}
          <div className="form-card card-span-2">
            <h3 className="form-card-title">Riwayat Kesehatan</h3>
            <div className="form-columns">
              <div className="form-column-inner">
                <div className="form-group-db">
                  <span>Berat Badan</span>
                  <input
                    type="text"
                    id="bb"
                    className="db-input"
                    placeholder="-"
                    value={formData.bb}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group-db">
                  <span>Tinggi Badan</span>
                  <input
                    type="text"
                    id="tb"
                    className="db-input"
                    placeholder="-"
                    value={formData.tb}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group-db">
                  <span>Golongan Darah</span>
                  <input
                    type="text"
                    id="goldar"
                    className="db-input badge-goldar-text"
                    placeholder="-"
                    value={formData.goldar}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-column-inner">
                <div className="form-group-db">
                  <span>Penyakit yang Pernah Diderita</span>
                  <input
                    type="text"
                    id="penyakit"
                    className="db-input"
                    placeholder="-"
                    value={formData.penyakit}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group-db">
                  <span>Riwayat Operasi</span>
                  <input
                    type="text"
                    id="operasi"
                    className="db-input"
                    placeholder="-"
                    value={formData.operasi}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group-db">
                  <span>Catatan Kesehatan</span>
                  <input
                    type="text"
                    id="catatan"
                    className="db-input"
                    placeholder="-"
                    value={formData.catatan}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER ACTION */}
        <div className="form-footer-action-container">
          <button type="submit" className="btn-submit-tindak">
            Tindak Lanjut
          </button>
          <div className="flow-badge-box">
            <div className="badge-active-step">Screening</div>
            <div className="badge-sub-step">Aftap</div>
          </div>
        </div>
      </form>

      {/* MAIN FOOTER */}
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
