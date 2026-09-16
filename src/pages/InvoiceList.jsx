import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Dialog, DialogContent } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

export default function InvoiceList() {
  const tenantId = 'taller-demo-01';
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null); // Estado para el modal

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/invoices?tenant_id=${tenantId}`);
      
      const data = res.data;
      if (Array.isArray(data)) {
        setInvoices(data);
      } else if (data && Array.isArray(data.invoices)) {
        setInvoices(data.invoices);
      } else if (data && Array.isArray(data.data)) {
        setInvoices(data.data);
      } else {
        setInvoices([]);
      }
    } catch (err) {
      console.error("Error al cargar las facturas", err);
      setInvoices([]);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [tenantId]);

  return (
    <Box sx={{ maxWidth: '1000px', mx: 'auto', mt: 1, px: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 3 }}>
        Historial de Facturas
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: '#f1f5f9' }}>
            <TableRow>
              <TableCell><b>Serie / Número</b></TableCell>
              <TableCell><b>Fecha</b></TableCell>
              <TableCell><b>Concepto / Cliente</b></TableCell>
              <TableCell align="right"><b>Total (€)</b></TableCell>
              <TableCell align="center"><b>Estado VeriFactu</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(invoices) && invoices.map((inv) => (
              <TableRow 
                key={inv.id || inv.series_number}
                hover
                onClick={() => setSelectedInvoice(inv)} // Al hacer clic cargamos la factura en el modal
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{inv.series_number || inv.series}</TableCell>
                <TableCell>{inv.issue_date ? new Date(inv.issue_date).toLocaleDateString() : inv.date}</TableCell>
                <TableCell>{inv.customer_name || inv.client_name || inv.client || 'Cliente General'}</TableCell>
                <TableCell align="right">{Number(inv.total_amount || inv.total || inv.amount || 0).toFixed(2)} €</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={inv.status || 'Enviada'} 
                    color={inv.status === 'Error' ? 'error' : 'success'} 
                    size="small" 
                  />
                </TableCell>
              </TableRow>
            ))}
            {(!Array.isArray(invoices) || invoices.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} align="center">No hay facturas registradas todavía.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Ventana Modal de Detalle, Líneas y Código QR de VeriFactu */}
      <Dialog open={Boolean(selectedInvoice)} onClose={() => setSelectedInvoice(null)} maxWidth="md" fullWidth>
        {selectedInvoice && (
          <DialogContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              Factura: {selectedInvoice.series_number || selectedInvoice.series}
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Fecha de Emisión:</strong> {selectedInvoice.issue_date ? new Date(selectedInvoice.issue_date).toLocaleDateString() : 'N/A'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Cliente:</strong> {selectedInvoice.customer_name || 'N/A'} ({selectedInvoice.customer_nif || 'N/A'})
            </Typography>
            {selectedInvoice.customer_address && (
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Dirección:</strong> {selectedInvoice.customer_address}
              </Typography>
            )}

            {/* TABLA DE LÍNEAS / CONCEPTOS DE LA FACTURA */}
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>
              Conceptos de la Factura
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell><b>Descripción</b></TableCell>
                    <TableCell align="right"><b>Cant.</b></TableCell>
                    <TableCell align="right"><b>Precio (€)</b></TableCell>
                    <TableCell align="right"><b>Desc. (%)</b></TableCell>
                    <TableCell align="right"><b>IVA (%)</b></TableCell>
                    <TableCell align="right"><b>Total (€)</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(selectedInvoice.items || []).map((item, idx) => {
                    const lineBase = (Number(item.quantity) || 0) * (Number(item.unit_price) || 0);
                    const disc = lineBase * ((Number(item.discount_percentage) || 0) / 100);
                    const lineTotal = lineBase - disc;
                    return (
                      <TableRow key={idx}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{Number(item.unit_price).toFixed(2)}</TableCell>
                        <TableCell align="right">{item.discount_percentage || 0}%</TableCell>
                        <TableCell align="right">{item.tax_rate || 21}%</TableCell>
                        <TableCell align="right"><b>{lineTotal.toFixed(2)} €</b></TableCell>
                      </TableRow>
                    );
                  })}
                  {(!selectedInvoice.items || selectedInvoice.items.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">No hay líneas registradas para esta factura.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Resumen de Totales */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2">Subtotal Neto: <b>{Number(selectedInvoice.subtotal || 0).toFixed(2)} €</b></Typography>
                <Typography variant="body2">IVA: <b>{Number(selectedInvoice.tax_amount || 0).toFixed(2)} €</b></Typography>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                  Total a Pagar: {Number(selectedInvoice.total_amount || selectedInvoice.total || 0).toFixed(2)} €
                </Typography>
              </Box>
            </Box>

            {/* Contenedor del Código QR de VeriFactu */}
            {selectedInvoice.qr_data ? (
              <Box sx={{ mt: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#475569' }}>
                  Código QR Oficial VeriFactu
                </Typography>
                <Paper elevation={1} sx={{ p: 2, display: 'inline-block', bgcolor: '#fff' }}>
                  <QRCodeSVG value={selectedInvoice.qr_data} size={160} />
                </Paper>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', fontStyle: 'italic', textAlign: 'center' }}>
                QR no disponible para esta factura.
              </Typography>
            )}
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
}