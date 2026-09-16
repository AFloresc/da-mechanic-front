import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';

export default function InvoiceList() { // <-- Asegúrate de que tenga 'export default'
  // Datos de ejemplo simulados
  const invoices = [
    { id: '1', series: 'FAC-2026-001', date: '2026-09-16', client: 'Juan Pérez', total: '185.50', status: 'Enviada' },
    { id: '2', series: 'FAC-2026-002', date: '2026-09-15', client: 'Transportes Norte S.L.', total: '620.00', status: 'Enviada' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 3 }}>
        Historial de Facturas
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table>
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
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell>{inv.series}</TableCell>
                <TableCell>{inv.date}</TableCell>
                <TableCell>{inv.client}</TableCell>
                <TableCell align="right">{inv.total} €</TableCell>
                <TableCell align="center">
                  <Chip label={inv.status} color="success" size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}