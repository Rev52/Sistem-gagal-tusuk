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


  const bannerData: BannerItem[] = [
    {
      src: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1000&q=80',
      alt: 'Pelayanan Donor Darah UTD PMI',
      fallback: '[ Dokumentasi 1: Pelayanan Donor ]',
    },
    {
      src: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1000&q=80',
      alt: 'Pemeriksaan Kesehatan & Screening Medis',
      fallback: '[ Dokumentasi 2: Screening Medis ]',
    },
    {
      src: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
      alt: 'Tindakan Aftap & Laboratorium Darah',
      fallback: '[ Dokumentasi 3: Tindakan Aftap ]',
    },
    {
      src: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1000&q=80',
      alt: 'Edukasi dan Evaluasi Keselamatan Donor',
      fallback: '[ Dokumentasi 4: Evaluasi Keselamatan ]',
    },
  ];

  const [activeSlide, setActiveSlide] = useState<number>(0);

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

    // 2. Intersection Observer for Scroll-Reveal Animation
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

    // 3. Preload all banner images immediately into browser cache
    bannerData.forEach((item) => {
      const img = new window.Image();
      img.src = item.src;
    });

    // 4. Auto-advance slide smoothly every 4 seconds
    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % bannerData.length);
    }, 4000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      clearInterval(slideTimer);
    };
  }, [bannerData]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % bannerData.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + bannerData.length) % bannerData.length);
  };

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
              loading="eager"
            />
          </div>
        </div>

        <h1>Monitoring Gagal Tusuk</h1>
        <p>
          Sistem informasi manajemen yang dirancang untuk memantau, mencatat, dan
          mengevaluasi setiap insiden kegagalan penusukan jarum atau kanulasi pada tindakan medis.
        </p>

        <div className="btn-container">
          <Link href="/login" prefetch={true} className="btn-hero">
            Log In
          </Link>
          <Link href="/signin" prefetch={true} className="btn-hero">
            Sign In
          </Link>
        </div>
      </header>

      {/* 2. BANNER DOKUMENTASI DENGAN SLIDER INSTAN & RESPONSIVE */}
      <div className="banner-slider-wrapper scroll-reveal">
        <div className="banner-slider-container">
          <div
            className="banner-track"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {bannerData.map((item, idx) => (
              <div key={idx} className="banner-slide">
                {!failedImages[idx] ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="banner-img"
                    loading="eager"
                    onError={() => handleImageError(idx)}
                  />
                ) : (
                  <div className="banner-fallback">{item.fallback}</div>
                )}
                <div className="banner-caption">
                  <span>{item.alt}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Slider Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="slider-arrow slider-arrow-left"
            aria-label="Slide sebelumnya"
            type="button"
          >
            ❮
          </button>
          <button
            onClick={nextSlide}
            className="slider-arrow slider-arrow-right"
            aria-label="Slide berikutnya"
            type="button"
          >
            ❯
          </button>

          {/* Slider Indicator Dots */}
          <div className="slider-dots">
            {bannerData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`slider-dot ${activeSlide === idx ? 'active' : ''}`}
                aria-label={`Pindah ke slide ${idx + 1}`}
                type="button"
              />
            ))}
          </div>
        </div>
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
