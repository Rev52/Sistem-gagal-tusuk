'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export interface AftapDonorInfo {
  nik?: string;
  nama?: string;
  nama_pendonor?: string;
  alamat?: string;
  tempatLahir?: string;
  tempat_lahir?: string;
  tanggalLahir?: string;
  tgl_lahir?: string;
  golDarah?: string;
  goldar?: string;
  noHp?: string;
  nohp?: string;
  bb?: string;
  tb?: string;
  tensi?: string;
  suhu?: string;
  nadi?: string;
}

const mockDataPendonor: AftapDonorInfo = {
  nik: '3515091205950001',
  nama: 'Budi Santoso',
  alamat: 'Jl. Merdeka No. 45 RT 02 RW 05',
  tempatLahir: 'Pasuruan',
  tanggalLahir: '12 Mei 1995',
  golDarah: 'O+',
  noHp: '0812-3456-7890',
  bb: '65 kg',
  tb: '170 cm',
  tensi: '120/80',
  suhu: '36.5 °C',
  nadi: '80 x/menit',
};

export default function AftapPage() {
  const router = useRouter();
  const [donor, setDonor] = useState<AftapDonorInfo>(mockDataPendonor);
  const [petugas, setPetugas] = useState<string>('');
  const [volumeDarah, setVolumeDarah] = useState<string>('');
  const [penyebabGagal, setPenyebabGagal] = useState<string>('');
  const [tglKembali, setTglKembali] = useState<string>('');
  const [catatan, setCatatan] = useState<string>('');

  useEffect(() => {
    const stored = sessionStorage.getItem('currentDonor');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setDonor({ ...mockDataPendonor, ...parsed });
      } catch (e) {
        console.error(e);
      }
    }

    router.prefetch('/dashboard');
    router.prefetch('/db');
    router.prefetch('/screening');
    router.prefetch('/login');
  }, [router]);

  const handleSaveAftap = () => {
    if (!petugas.trim()) {
      alert('⚠️ Gagal menyimpan! Nama Petugas Aftap wajib diisi.');
      return;
    }

    if (!volumeDarah) {
      alert('⚠️ Gagal menyimpan! Silakan pilih Estimasi Volume Darah Tercapai.');
      return;
    }

    if (penyebabGagal !== '' && !tglKembali) {
      alert('⚠️ Karena proses Aftap gagal, Anda wajib mengisi Tanggal Kembali untuk pendonor!');
      return;
    }

    let masterData = JSON.parse(localStorage.getItem('pmi_gagal_donor') || '[]');
    const newId = 'PND-' + (650 + masterData.length + 1);
    const tanggalHariIni = new Date().toISOString().split('T')[0];

    const namaFix = donor.nama || donor.nama_pendonor || 'Pendonor Gagal';
    const golDarahFix = donor.goldar || donor.golDarah || '-';

    const dataBaruAftap = {
      id: newId,
      nama: namaFix,
      golDarah: golDarahFix,
      jenis: 'Aftap (Kegagalan)',
      penyebab:
        penyebabGagal === ''
          ? `Gagal Aftap (Volume: ${volumeDarah})`
          : `${penyebabGagal} - Vol: ${volumeDarah} (${catatan || '-'})`,
      tanggal: tanggalHariIni,
    };

    masterData.push(dataBaruAftap);
    localStorage.setItem('pmi_gagal_donor', JSON.stringify(masterData));
    sessionStorage.removeItem('currentDonor');

    alert(`🎉 Data Gagal Aftap atas nama ${dataBaruAftap.nama} berhasil disimpan!\nKantong darah otomatis tercatat dimusnahkan.`);
    router.push('/dashboard');
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="main-header">
        <div>
          <div className="brand-title">SIM-GASUK</div>
          <h1 className="page-title">Tindakan Aftap</h1>
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
            style={{ width: '24px', height: '24px', objectFit: 'contain' }}
          />
        </div>
        <div className="nav-links">
          <Link href="/dashboard" prefetch={true} className="nav-item">
            Dashboard
          </Link>
          <Link href="/db" prefetch={true} className="nav-item">
            Data Pendonor
          </Link>
          <Link href="/aftap" prefetch={true} className="nav-item active">
            Aftap
          </Link>
        </div>
      </nav>

      {/* GRID LAYOUT */}
      <div className="aftap-grid-layout">
        {/* KOLOM KIRI */}
        <div className="grid-column-stack">
          <div className="form-card">
            <h3 className="form-card-title">Informasi Pendonor &amp; Hasil Screening</h3>
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
                <span>Tempat, Tgl Lahir</span>
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
              <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '8px 0' }} />
              <div className="info-row">
                <span>Berat / Tinggi</span>
                <strong>
                  {donor.bb || '-'} / {donor.tb || '-'}
                </strong>
              </div>
              <div className="info-row">
                <span>Tekanan Darah</span>
                <strong>{donor.tensi || '-'}</strong>
              </div>
              <div className="info-row">
                <span>Suhu / Nadi</span>
                <strong>
                  {donor.suhu || '-'} / {donor.nadi || '-'}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN */}
        <div className="grid-column-stack">
          <div className="form-card">
            <h3 className="form-card-title">Pencatatan Insiden Aftap</h3>
            <div className="failed-box-stack">
              <div className="input-field-block">
                <label>Nama Petugas Aftap</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Masukkan nama petugas Aftap"
                  value={petugas}
                  onChange={(e) => setPetugas(e.target.value)}
                />
              </div>

              <div className="input-field-block">
                <label>Estimasi Volume Darah Tercapai</label>
                <div className="volume-radio-group">
                  {['< 200 ml', '200 - 300 ml', '> 300 ml'].map((opt) => (
                    <label
                      key={opt}
                      className={`radio-card-option ${volumeDarah === opt ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="volume_darah"
                        value={opt}
                        checked={volumeDarah === opt}
                        onChange={(e) => setVolumeDarah(e.target.value)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="input-field-block">
                <label>Penyebab Kegagalan Aftap / Insiden</label>
                <select
                  className="form-input select-cursor"
                  value={penyebabGagal}
                  onChange={(e) => setPenyebabGagal(e.target.value)}
                  style={{
                    borderColor: penyebabGagal !== '' ? '#EF4444' : '#E5E7EB',
                  }}
                >
                  <option value="">-- Pilih Penyebab (Jika Gagal Aftap) --</option>
                  <option value="Pembuluh Darah Pecah / Vena Sulit">Pembuluh Darah Pecah / Vena Sulit</option>
                  <option value="Darah Berhenti Mengalir (Macet)">Darah Berhenti Mengalir (Macet)</option>
                  <option value="Donor Pingsan / Reaksi Transfusi">Donor Pingsan / Reaksi Transfusi</option>
                  <option value="Kantong Darah Bocor / Rusak">Kantong Darah Bocor / Rusak</option>
                  <option value="Hematoma / Pembengkakan">Hematoma / Pembengkakan</option>
                </select>
              </div>

              <div className="input-field-block">
                <label>Tanggal Kembali Pendonor</label>
                <input
                  type="date"
                  className="form-input"
                  value={tglKembali}
                  onChange={(e) => setTglKembali(e.target.value)}
                  style={{
                    borderColor: penyebabGagal !== '' && !tglKembali ? '#EF4444' : '#E5E7EB',
                  }}
                />
              </div>

              <div className="input-field-block">
                <label>Catatan Tambahan / Evaluasi</label>
                <textarea
                  className="form-input"
                  placeholder="Tuliskan catatan kejadian penusukan / kondisi pendonor..."
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="action-buttons-container">
            <button onClick={() => router.push('/screening')} className="btn-action-back">
              <i className="fas fa-arrow-left"></i> Kembali
            </button>
            <button onClick={handleSaveAftap} className="btn-action-save">
              <i className="fas fa-check-circle"></i> Simpan &amp; Selesai
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
