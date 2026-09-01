'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function SigninPage() {
  const router = useRouter();
  const [nama, setNama] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Konfirmasi password tidak cocok dengan password!');
      return;
    }
    alert('Registrasi akun berhasil! Silakan Log In untuk melanjutkan.');
    router.push('/login');
  };

  return (
    <div className="auth-page">
      <header className="auth-header">
        <div className="nav-left">SIM-GASUK</div>
        <div className="nav-right">Unit Transfusi Darah PMI Kota Pasuruan</div>
      </header>

      <main className="auth-main">
        <div className="logo-wrapper">
          <div className="logo-container">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://upload.wikimedia.org/wikipedia/id/6/65/Pmi.png"
              alt="Logo PMI"
              className="logo-img"
              style={{ width: '60px', height: '60px' }}
            />
          </div>
        </div>

        <h1>Sign In</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Nama"
              className="form-control"
              value={nama}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="action-row">
            <Link href="/login" className="already-link">
              Already Registered?
            </Link>
            <button type="submit" className="btn-signin">
              Sign In
            </button>
          </div>
        </form>
      </main>

      <div style={{ height: '30px' }}></div>
    </div>
  );
}
