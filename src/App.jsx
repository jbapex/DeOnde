import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import MainLayoutCliente from '@/components/layout/MainLayoutCliente';
import ClientLogin from '@/components/auth/ClientLogin';
import ClientCRM from '@/components/pages/ClientCRM';
import LeadDetailPage from '@/components/pages/LeadDetailPage';
import CrmLayout from '@/components/pages/CrmLayout';

function ProtectedClientRoute({ children }) {
  const { session, profile, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }
  if (!session || !profile) return <Navigate to="/login-cliente" replace />;
  const isClient = profile.role === 'cliente' && profile.cliente_id;
  const isAdmin = profile.role && ['superadmin', 'admin', 'colaborador'].includes(profile.role);
  if (!isClient && !isAdmin) return <Navigate to="/login-cliente" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login-cliente" element={<ClientLogin />} />
      <Route path="/" element={<ProtectedClientRoute><MainLayoutCliente /></ProtectedClientRoute>}>
        <Route index element={<Navigate to="/crm" replace />} />
        <Route path="crm" element={<CrmLayout />}>
          <Route index element={<Navigate to="leads" replace />} />
          <Route path="leads/:leadId" element={<LeadDetailPage />} />
          <Route path=":tab" element={<ClientCRM />} />
        </Route>
        <Route path="*" element={<Navigate to="/crm" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
