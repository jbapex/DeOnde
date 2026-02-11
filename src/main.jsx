import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { ModuleSettingsProvider } from '@/contexts/ModuleSettingsContext';
import '@/lib/customSupabaseClient';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ErrorBoundary';

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <ErrorBoundary>
      <HashRouter>
        <AuthProvider>
          <ModuleSettingsProvider>
            <App />
            <Toaster />
          </ModuleSettingsProvider>
        </AuthProvider>
      </HashRouter>
    </ErrorBoundary>
  );
}
