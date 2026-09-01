'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [remember, setRemember] = useState<boolean>(false);

  useEffect(() => {
    router.prefetch('/dashboard');
    router.prefetch('/signin');
    router.prefetch('/');
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailValue = email.trim().toLowerCase();
    const passwordValue = password.trim();

    if (!emailValue || !passwordValue) {
      alert('Mohon maaf, email dan password wajib diisi!');
      return;
    }

    // Ambil data user tersimpan dari localStorage
    const storedUsers = localStorage.getItem('sim_gasuk_users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    // Cari akun yang cocok
    const userFound = users.find(
      (u: { email: string; pass: string }) => u.email === emailValue && u.pass === passwordValue
    );

    // Akun bawaan (Admin Default)
    const isDefaultAdmin = emailValue === 'admin@pmi.org' && passwordValue === 'admin123';

    if (userFound || isDefaultAdmin) {
      if (remember) {
        localStorage.setItem('sim_gasuk_saved_email', emailValue);
      }
      alert('Login Berhasil! Selamat datang di SIM-GASUK.');
      router.push('/dashboard');
    } else {
      alert('Email atau Password salah! Jika belum punya akun, silakan Sign In.');
    }
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

        <h1>Log In</h1>

        <form onSubmit={handleSubmit}>
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

          <div className="remember-container">
            <input
              type="checkbox"
              id="remember"
              className="checkbox-box"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label htmlFor="remember" className="remember-label">
              Remember me
            </label>
          </div>

          <div className="action-row">
            <Link href="/signin" className="forgot-link">
              Belum punya akun? Sign In
            </Link>
            <button type="submit" className="btn-login">
              Log In
            </button>
          </div>
        </form>
      </main>

      <div style={{ height: '30px' }}></div>
    </div>
  );
}