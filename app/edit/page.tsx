'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';

export interface EditDonorRecord {
  id: string;
  nik: string;
  nama: string;
  tempat_lahir: string;
  tgl_lahir: string;
  jk: string;
  agama: string;
  pekerjaan: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  kodepos: string;
  nohp: string;
  email: string;
  wa: string;
  jenis_donor: string;
  status_donor: string;
  riwayat_donor: string;
  donor_pertama: string;
  terakhir_donor: string;
  jeda_donor: string;
  unit_donor: string;
  bb: string;
  tb: string;
  goldar: string;
  alergi: string;
  penyakit: string;
  operasi: string;
  catatan: string;
}

const mockDatabase: Record<string, EditDonorRecord> = {
  'PND-369': {
    id: 'PND-369',
    nik: '3515091203960002',
    nama: 'Primadona',
    tempat_lahir: 'Pasuruan',
    tgl_lahir: '15 April 1996',
    jk: 'Perempuan',
    agama: 'Islam',
    pekerjaan: 'Swasta',
    alamat: 'Jl. Alun-Alun No. 10',
    kelurahan: 'Kebonagung',
    kecamatan: 'Purworejo',
    kota: 'Kota Pasuruan',
    provinsi: 'Jawa Timur',
    kodepos: '67116',
    nohp: '0812-3456-7890',
    email: 'primadona@email.com',
    wa: '0812-3456-7890',
    jenis_donor: 'Sukarela (Rutin)',
    status_donor: 'Gagal (Medis)',
    riwayat_donor: '3 kali',
    donor_pertama: '10 Feb 2022',
    terakhir_donor: '16 Juni 2026',
    jeda_donor: '-',
    unit_donor: 'UTD PMI Kota Pasuruan',
    bb: '48 kg',
    tb: '155 cm',
    goldar: 'A',
    alergi: 'Tidak ada',
    penyakit: 'Tekanan Darah / Tensi Tinggi',
    operasi: 'Tidak ada',
    catatan: 'Tekanan Darah / Tensi Tinggi',
  },
  'PND-001': {
    id: 'PND-001',
    nik: '3515091205950001',
    nama: 'Budi Santoso',
    tempat_lahir: 'Pasuruan',
    tgl_lahir: '12 Mei 1995',
    jk: 'Laki-laki',
    agama: 'Islam',
    pekerjaan: 'Wiraswasta',
    alamat: 'Jl. Merdeka No. 45 RT 02 RW 05',
    kelurahan: 'Sebani',
    kecamatan: 'Gadingrejo',
    kota: 'Kab. Pasuruan',
    provinsi: 'Jawa Timur',
    kodepos: '67154',
    nohp: '0812-3456-7890',
    email: 'budi.santoso@email.com',
    wa: '0812-3456-7890',
    jenis_donor: 'Sukarela (Rutin)',
    status_donor: 'Aktif',
    riwayat_donor: '18 kali',
    donor_pertama: '20 Jan 2018',
    terakhir_donor: '12 Mei 2024',
    jeda_donor: '12 Juli 2024',
    unit_donor: 'Aftap Unit PMI Kab. Pasuruan',
    bb: '65 kg',
    tb: '170 cm',
    goldar: 'O+',
    alergi: 'Tidak ada',
    penyakit: 'Tidak ada',
    operasi: 'Tidak ada',
    catatan: '-',
  },
};

function EditDonorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id') || 'PND-369';
  const [donor, setDonor] = useState<EditDonorRecord>(mockDatabase['PND-369']);

  useEffect(() => {
    if (idParam && mockDatabase[idParam]) {
      setDonor(mockDatabase[idParam]);
    } else {
      const stored = localStorage.getItem('pmi_gagal_donor');
      if (stored) {
        try {
          const list = JSON.parse(stored);
          const found = list.find((item: any) => item.id === idParam);
          if (found) {
            setDonor({
              ...mockDatabase['PND-369'],
              id: found.id,
              nama: found.nama,
              goldar: found.golDarah,
              penyakit: found.penyebab,
              catatan: found.penyebab,
            });
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [idParam]);

  const handleSave = () => {
    alert(`Berhasil! Perubahan data rekam medis untuk "${donor.nama}" telah disimpan ke sistem.`);
    router.push('/dashboard');
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="main-header">
        <div>
          <div className="brand-title">SIM-GASUK</div>
          <h1 className="page-title">
            Edit Pendonor{' '}
            <span style={{ color: '#8A0329', display: 'block', fontSize: '24px', marginTop: '5px' }}>
              ({donor.nama})
            </span>
          </h1>
        </div>
        <div>
          <div className="sub-title">Unit Transfusi Darah PMI Kota Pasuruan</div>
          <Link href="/dashboard" className="btn-back">
            <i className="fas fa-arrow-left"></i> Kembali ke Dashboard
          </Link>
        </div>
      </header>

      {/* CARD DETAIL DATA REKAM MEDIS */}
      <div className="list-card">
        <div className="list-card-header">
          <h3 className="list-card-title">Rekam Medis &amp; Profile Pendonor</h3>
          <p className="list-subtitle">ID Rekam Medis: {donor.id}</p>
        </div>

        <div className="table-responsive">
          <table className="donor-table">
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Parameter</th>
                <th>Nilai Rekam Medis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={4} style={{ fontWeight: 700, backgroundColor: '#FDF1F2', color: '#8A0329' }}>
                  Identitas Diri
                </td>
                <td>NIK</td>
                <td>{donor.nik}</td>
              </tr>
              <tr>
                <td>Nama Lengkap</td>
                <td style={{ fontWeight: 700 }}>{donor.nama}</td>
              </tr>
              <tr>
                <td>Tempat, Tanggal Lahir</td>
                <td>
                  {donor.tempat_lahir}, {donor.tgl_lahir}
                </td>
              </tr>
              <tr>
                <td>Jenis Kelamin / Agama</td>
                <td>
                  {donor.jk} / {donor.agama}
                </td>
              </tr>

              <tr>
                <td rowSpan={3} style={{ fontWeight: 700, backgroundColor: '#FDF1F2', color: '#8A0329' }}>
                  Alamat &amp; Kontak
                </td>
                <td>Alamat Lengkap</td>
                <td>
                  {donor.alamat}, {donor.kelurahan}, {donor.kecamatan}, {donor.kota}
                </td>
              </tr>
              <tr>
                <td>No. HP / WA</td>
                <td>
                  {donor.nohp} / {donor.wa}
                </td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{donor.email}</td>
              </tr>

              <tr>
                <td rowSpan={4} style={{ fontWeight: 700, backgroundColor: '#FDF1F2', color: '#8A0329' }}>
                  Riwayat Kesehatan
                </td>
                <td>Golongan Darah</td>
                <td>
                  <span className="badge-goldar">{donor.goldar}</span>
                </td>
              </tr>
              <tr>
                <td>Berat / Tinggi Badan</td>
                <td>
                  {donor.bb} / {donor.tb}
                </td>
              </tr>
              <tr>
                <td>Penyakit / Riwayat Medis</td>
                <td style={{ color: '#DC2626', fontWeight: 600 }}>{donor.penyakit}</td>
              </tr>
              <tr>
                <td>Catatan Kesehatan</td>
                <td>{donor.catatan}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={handleSave} className="btn-action-edit">
            <i className="fas fa-save"></i> Simpan Perubahan
          </button>
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

export default function EditDonorPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading Edit Page...</div>}>
      <EditDonorContent />
    </Suspense>
  );
}
