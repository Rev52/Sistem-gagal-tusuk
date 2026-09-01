import React from 'react';
import './globals.css';
import { NotificationProvider } from '../components/NotificationProvider';

export const metadata = {
  title: 'SIM-GASUK | UTD PMI Kota Pasuruan',
  description: 'Sistem Informasi Manajemen Monitoring Gagal Tusuk / Gagal Donor UTD PMI Kota Pasuruan',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
          precedence="default"
        />
      </head>
      <body>
        <NotificationProvider>{children}</NotificationProvider>
      </body>
    </html>
  );
}
