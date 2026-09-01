'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export interface NotificationOptions {
  title?: string;
  message: string;
  type?: NotificationType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface NotificationContextType {
  showNotification: (options: NotificationOptions) => Promise<boolean>;
  showAlert: (message: string, title?: string, type?: NotificationType) => Promise<boolean>;
  showConfirm: (message: string, title?: string) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: NotificationType;
    confirmText: string;
    cancelText: string;
    resolve?: (value: boolean) => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'OK',
    cancelText: 'Batal',
  });

  const showNotification = (options: NotificationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      let defaultTitle = 'Pemberitahuan';
      if (options.type === 'success') defaultTitle = 'Berhasil';
      if (options.type === 'error') defaultTitle = 'Perhatian';
      if (options.type === 'warning') defaultTitle = 'Peringatan';
      if (options.type === 'confirm') defaultTitle = 'Konfirmasi';

      setModalState({
        isOpen: true,
        title: options.title || defaultTitle,
        message: options.message,
        type: options.type || 'info',
        confirmText: options.confirmText || (options.type === 'confirm' ? 'Ya, Lanjutkan' : 'OK'),
        cancelText: options.cancelText || 'Batal',
        resolve,
      });
    });
  };

  const showAlert = (message: string, title?: string, type: NotificationType = 'info'): Promise<boolean> => {
    return showNotification({ message, title, type });
  };

  const showConfirm = (message: string, title?: string): Promise<boolean> => {
    return showNotification({ message, title: title || 'Konfirmasi Tindakan', type: 'confirm' });
  };

  const handleConfirm = () => {
    if (modalState.resolve) modalState.resolve(true);
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCancel = () => {
    if (modalState.resolve) modalState.resolve(false);
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Override browser native alert and confirm so any native call gets the PMI Maroon theme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const originalAlert = window.alert;
      const originalConfirm = window.confirm;

      // Custom window.alert override
      window.alert = (msg?: any) => {
        const text = String(msg ?? '');
        let type: NotificationType = 'info';
        if (text.toLowerCase().includes('berhasil') || text.includes('🎉') || text.includes('selamat')) {
          type = 'success';
        } else if (text.toLowerCase().includes('gagal') || text.toLowerCase().includes('salah') || text.includes('⚠️')) {
          type = 'error';
        }
        showAlert(text, undefined, type);
      };

      // Custom window.confirm override handler
      window.confirm = (msg?: any) => {
        // Fallback for synchronous confirm if triggered by legacy sync callers
        const choice = originalConfirm(msg);
        return choice;
      };

      return () => {
        window.alert = originalAlert;
        window.confirm = originalConfirm;
      };
    }
  }, []);

  const getIcon = () => {
    switch (modalState.type) {
      case 'success':
        return <i className="fas fa-check-circle" style={{ color: '#8A0329' }}></i>;
      case 'error':
        return <i className="fas fa-exclamation-triangle" style={{ color: '#8A0329' }}></i>;
      case 'warning':
        return <i className="fas fa-exclamation-circle" style={{ color: '#8A0329' }}></i>;
      case 'confirm':
        return <i className="fas fa-question-circle" style={{ color: '#8A0329' }}></i>;
      default:
        return <i className="fas fa-info-circle" style={{ color: '#8A0329' }}></i>;
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification, showAlert, showConfirm }}>
      {children}

      {/* Maroon Themed Modal Dialog */}
      {modalState.isOpen && (
        <div className="pmi-modal-backdrop" onClick={modalState.type !== 'confirm' ? handleConfirm : undefined}>
          <div className="pmi-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="pmi-modal-header">
              <div className="pmi-modal-icon-badge">
                {getIcon()}
              </div>
              <div className="pmi-modal-title-group">
                <span className="pmi-modal-brand">SIM-GASUK PMI</span>
                <h3 className="pmi-modal-title">{modalState.title}</h3>
              </div>
            </div>

            <div className="pmi-modal-body">
              <p className="pmi-modal-message">{modalState.message}</p>
            </div>

            <div className="pmi-modal-footer">
              {modalState.type === 'confirm' && (
                <button type="button" onClick={handleCancel} className="pmi-modal-btn pmi-modal-btn-cancel">
                  {modalState.cancelText}
                </button>
              )}
              <button
                type="button"
                onClick={handleConfirm}
                className="pmi-modal-btn pmi-modal-btn-confirm"
                autoFocus
              >
                {modalState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
