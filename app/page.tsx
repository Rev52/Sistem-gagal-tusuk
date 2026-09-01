'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface BannerItem {
  src: string;
  alt: string;
  fallback: string;
}

export default function LandingPage() {
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  const handleImageError = (index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  useEffect(() => {
    // 1. Scroll Progress & Back to Top Toggle
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;
      setScrollProgress(scrollPercent);
      setShowBackToTop(totalScroll > 250);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 2. Intersection Observer for Scroll-Reveal Animation (Up & Down)
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    });

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const bannerData: BannerItem[] = [
    {
      src: 'https://i.pinimg.com/736x/69/e4/10/69e4108c93faf43faa209340d3903730.jpg',
      alt: 'Dokumentasi 1',
      fallback: '[ Foto 1 ]',
    },
    {
      src: 'https://i.pinimg.com/736x/32/39/bc/3239bcbc602c33e09c683daded41264d.jpg',
      alt: 'Dokumentasi 2',
      fallback: '[ Foto 2 ]',
    },
    {
      src: 'https://i.pinimg.com/1200x/08/44/91/0844918b91620c7d33f449202a8dd0c4.jpg',
      alt: 'Dokumentasi 3',
      fallback: '[ Foto 3 ]',
    },
    {
      src: 'https://i.pinimg.com/736x/f3/d7/77/f3d777773e971868747becc7b97e59c1.jpg',
      alt: 'Dokumentasi 4',
      fallback: '[ Foto 4 ]',
    },
  ];

  return (
    <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', position: 'relative' }}>
      {/* Scroll Progress Bar at the top */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Floating Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`btn-scroll-top ${showBackToTop ? 'visible' : ''}`}
        aria-label="Kembali ke atas"
        title="Kembali ke atas"
      >
        ▲
      </button>

      {/* 1. HERO SECTION & HEADER */}
      <header className="hero-header">
        <div className="hero-nav-top">
          <div>SIM-GASUK</div>
          <div>Unit Transfusi Darah PMI Kota Pasuruan</div>
        </div>

        <div className="logo-wrapper">
          <div className="logo-container">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://upload.wikimedia.org/wikipedia/id/6/65/Pmi.png"
              alt="Logo PMI"
              className="hero-logo-img"
            />
          </div>
        </div>

        <h1>Monitoring Gagal Tusuk</h1>
        <p>
          Sistem informasi manajemen yang dirancang untuk memantau, mencatat, dan
          mengevaluasi setiap insiden kegagalan penusukan jarum atau kanulasi pada tindakan medis.
        </p>

        <div className="btn-container">
          <Link href="/login" className="btn-hero">
            Log In
          </Link>
          <Link href="/signin" className="btn-hero">
            Sign In
          </Link>
        </div>
      </header>

      {/* 2. BANNER DOKUMENTASI */}
      <div className="banner-container scroll-reveal">
        {bannerData.map((item, idx) => (
          <div key={idx} className="banner-box">
            {!failedImages[idx] ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={item.src}
                alt={item.alt}
                className="banner-img"
                onError={() => handleImageError(idx)}
              />
            ) : (
              <div className="banner-fallback">{item.fallback}</div>
            )}
          </div>
        ))}
      </div>

      {/* 3. LAYANAN MONITORING */}
      <section className="section-layanan scroll-reveal">
        <h2 className="section-title">Layanan Monitoring Gagal Tusuk</h2>
        <p className="section-subtitle">Layanan yang dapat diakses dalam SIM-GASUK</p>

        <div className="grid-container">
          <div className="card-box scroll-reveal delay-1">
            <div className="card-visual">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"
                alt="Grafik Dashboard"
                className="card-img"
              />
            </div>
            <div>
              <h3>Dashboard</h3>
              <p>Menampilkan data visual SIM-GASUK</p>
            </div>
          </div>

          <div className="card-box scroll-reveal delay-2">
            <div className="card-visual">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400"
                alt="Input Data"
                className="card-img"
              />
            </div>
            <div>
              <h3>Input Data Pendonor</h3>
              <p>Staff dapat memasukkan data pendonor yang mengalami Gagal Tusuk</p>
            </div>
          </div>

          <div className="card-box scroll-reveal delay-3">
            <div className="card-visual">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400"
                alt="Laporan Dokumen"
                className="card-img"
              />
            </div>
            <div>
              <h3>Data Laporan</h3>
              <p>Staff dapat melihat data laporan Gagal Tusuk dan dapat dicetak</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VISI DAN MISI */}
      <section className="section-visimisi scroll-reveal">
        <h2 className="section-title text-center">Visi dan Misi UTD PMI Kota Pasuruan</h2>

        <div className="grid-visimisi">
          <div className="vm-box scroll-reveal delay-1">
            <h3>Visi</h3>
            <p>Terwujudnya pelayanan darah yang aman, berkesinambungan, terjangkau dan merata</p>
          </div>
          <div className="vm-box scroll-reveal delay-2">
            <h3>Misi</h3>
            <p>
              Menjadikan &quot;KESEHATAN SEBAGAI HAK ASASI&quot; sebagai komitmen di dalam memberikan
              pelayanan darah yang aman baik dari segi kuantitas maupun kualitas
            </p>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="hero-footer scroll-reveal">
        <div className="footer-container">
          <div className="footer-info scroll-reveal delay-1">
            <h4>SIM-GASUK</h4>
            <p>Unit Transfusi Darah PMI Kota Pasuruan</p>
            <div className="alamat">
              <p>Jl. Untung Suropati No. 23 Kota Pasuruan 67117 Jawa Timur</p>
              <p>0343-416615 / 082244824037</p>
            </div>
          </div>

          <div className="footer-map scroll-reveal delay-2">
            <iframe
              title="Peta Lokasi UTD PMI Kota Pasuruan"
              src="https://maps.google.com/maps?q=UTD%20PMI%20Kota%20Pasuruan&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </footer>
    </div>
  );
}
