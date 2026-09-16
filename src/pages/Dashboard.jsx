import React from 'react';
import { Box, Card, CardContent, Grid, Typography, Button } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
          Panel de Control
        </Typography>
        <Button variant="contained" onClick={() => navigate('/invoices/new')} sx={{ bgcolor: '#0f172a' }}>
          + Emitir Nueva Factura
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ boxShadow: 2, borderLeft: '5px solid #3b82f6' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ color: '#3b82f6', mr: 1 }} />
                <Typography color="text.secondary" variant="subtitle2">Facturación del Mes</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>12.450,80 €</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ boxShadow: 2, borderLeft: '5px solid #10b981' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ReceiptIcon sx={{ color: '#10b981', mr: 1 }} />
                <Typography color="text.secondary" variant="subtitle2">Facturas Emitidas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>48</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ boxShadow: 2, borderLeft: '5px solid #8b5cf6' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleIcon sx={{ color: '#8b5cf6', mr: 1 }} />
                <Typography color="text.secondary" variant="subtitle2">Estado VeriFactu</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#10b981', mt: 1 }}>
                Sincronizado AEAT ✓
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}