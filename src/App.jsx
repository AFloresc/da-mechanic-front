import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewInvoicePage from './pages/NewInvoicePage';
import InvoiceList from './pages/InvoiceList';
import CustomersPage from './pages/CustomersPage'; // <--- Importado desde pages

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="invoices/new" element={<NewInvoicePage />} />
          <Route path="invoices" element={<InvoiceList />} />
          <Route path="customers" element={<CustomersPage />} /> {/* <--- Ruta configurada */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}