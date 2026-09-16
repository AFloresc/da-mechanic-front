import React, { useState, useEffect } from 'react';
import { 
  Box, Button, Card, Grid, TextField, 
  Typography, IconButton, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper,
  FormControl, InputLabel, Select, MenuItem, FormHelperText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

export default function InvoiceForm() {
  const [formData, setFormData] = useState({
    tenant_id: 'taller-demo-01',
    series_number: 'FAC-2026-001',
    issuer_nif: 'B12345678',
    customer_name: '',
    customer_nif: '',
    customer_address: '',
  });

  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  const [items, setItems] = useState([
    { description: 'Cambio de aceite y filtros', quantity: 1, unit_price: 65.00, discount_percentage: 0, tax_rate: 21 }
  ]);

  // Cargar clientes al montar el componente para el desplegable rápido
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/customers?tenant_id=${formData.tenant_id}`);
        setCustomers(response.data || []);
      } catch (error) {
        console.error("Error al cargar la lista de clientes:", error);
      }
    };
    fetchCustomers();
  }, [formData.tenant_id]);

  // Autocompletar datos cuando el usuario selecciona un cliente del desplegable
  const handleCustomerSelect = (e) => {
    const customerId = e.target.value;
    setSelectedCustomerId(customerId);

    if (!customerId) {
      setFormData(prev => ({ ...prev, customer_name: '', customer_nif: '', customer_address: '' }));
      return;
    }

    // Aseguramos la comparación estricta convirtiendo ambos a string
    const found = customers.find(c => String(c.id) === String(customerId));
    
    if (found) {
      console.log("Cliente seleccionado encontrado:", found);

      setFormData(prev => ({
        ...prev,
        customer_name: found.name || '',
        customer_nif: found.nif || '',
        customer_address: found.address || ''
      }));
    } else {
      console.warn("No se encontró ningún cliente con ID:", customerId);
    }
  };

  const handleHeaderChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItemRow = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 0, discount_percentage: 0, tax_rate: 21 }]);
  };

  const removeItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalTax = 0;

    (items || []).forEach(item => {
      const lineSubtotal = (Number(item.quantity) || 0) * (Number(item.unit_price) || 0);
      const discountAmount = lineSubtotal * ((Number(item.discount_percentage) || 0) / 100);
      const netLine = lineSubtotal - discountAmount;
      const taxLine = netLine * ((Number(item.tax_rate) || 0) / 100);

      subtotal += netLine;
      totalTax += taxLine;
    });

    return {
      subtotal: subtotal.toFixed(2),
      tax: totalTax.toFixed(2),
      total: (subtotal + totalTax).toFixed(2)
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        items: (items || []).map(item => ({
          ...item,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
          discount_percentage: Number(item.discount_percentage),
          tax_rate: Number(item.tax_rate)
        }))
      };

      const response = await axios.post('http://localhost:8080/api/v1/invoices', payload);
      alert(`¡Factura creada y encadenada con éxito!\nHash: ${response.data.current_hash.substring(0, 16)}...\nQR VeriFactu Generado.`);
    } catch (error) {
      console.error(error);
      alert('Error al emitir la factura con VeriFactu.');
    }
  };

  const totals = calculateTotals();

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{ maxWidth: '900px', mx: 'auto', mt: 1, px: 2 }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1e293b', textAlign: 'center' }}>
        Emisión de Factura Rápida (VeriFactu)
      </Typography>

      {/* Cabecera de Datos Fiscales, Taller y Cliente */}
      <Card sx={{ mb: 3, p: 2, boxShadow: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>Datos del Taller, Serie y Cliente</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="ID Taller (Tenant ID)" name="tenant_id" value={formData.tenant_id} onChange={handleHeaderChange} required size="small" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="NIF del Taller (Emisor)" name="issuer_nif" value={formData.issuer_nif} onChange={handleHeaderChange} required size="small" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Serie / Número de Factura" name="series_number" value={formData.series_number} onChange={handleHeaderChange} required size="small" />
          </Grid>

          {/* Selector rápido de cliente registrado */}
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel id="select-customer-label">Seleccionar Cliente Registrado (Opcional)</InputLabel>
              <Select
                labelId="select-customer-label"
                value={selectedCustomerId}
                label="Seleccionar Cliente Registrado (Opcional)"
                onChange={handleCustomerSelect}
              >
                <MenuItem value="">
                  <em>-- Introducir manualmente o crear nuevo --</em>
                </MenuItem>
                {(customers || []).map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name} ({c.nif})
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Seleccionar un cliente rellenará automáticamente sus datos fiscales.</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Nombre del Cliente" name="customer_name" value={formData.customer_name} onChange={handleHeaderChange} required size="small" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="NIF del Cliente" name="customer_nif" value={formData.customer_nif} onChange={handleHeaderChange} required size="small" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Dirección del Cliente" name="customer_address" value={formData.customer_address} onChange={handleHeaderChange} placeholder="Calle, Ciudad, CP" size="small" />
          </Grid>
        </Grid>
      </Card>

      {/* Líneas de Artículos / Piezas / Mano de Obra */}
      <Card sx={{ mb: 3, p: 2, boxShadow: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>Conceptos, Recambios y Descuentos</Typography>
        
        <TableContainer component={Paper} sx={{ mb: 2, boxShadow: 'none' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell><b>Descripción</b></TableCell>
                <TableCell align="right" width="90px"><b>Cantidad</b></TableCell>
                <TableCell align="right" width="110px"><b>Precio (€)</b></TableCell>
                <TableCell align="right" width="100px"><b>Desc. (%)</b></TableCell>
                <TableCell align="right" width="90px"><b>IVA (%)</b></TableCell>
                <TableCell align="center" width="60px"><b>Acción</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(items || []).map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField fullWidth size="small" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} placeholder="Ej. Pastillas de freno" required />
                  </TableCell>
                  <TableCell align="right">
                    <TextField 
                      type="number" 
                      size="small" 
                      value={item.quantity} 
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} 
                      inputProps={{ min: 1, step: 'any' }} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField 
                      type="number" 
                      size="small" 
                      value={item.unit_price} 
                      onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)} 
                      inputProps={{ min: 0, step: '0.01' }} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField 
                      type="number" 
                      size="small" 
                      value={item.discount_percentage} 
                      onChange={(e) => handleItemChange(index, 'discount_percentage', e.target.value)} 
                      inputProps={{ min: 0, max: 100, step: '1' }} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField type="number" size="small" value={item.tax_rate} onChange={(e) => handleItemChange(index, 'tax_rate', e.target.value)} />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="error" onClick={() => removeItemRow(index)} disabled={items.length === 1}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Button startIcon={<AddCircleIcon />} variant="outlined" onClick={addItemRow} sx={{ mt: 1 }}>
          Añadir Línea
        </Button>
      </Card>

      {/* Totales y Botón de Envío */}
      <Card sx={{ p: 3, boxShadow: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8fafc' }}>
        <Box sx={{ mb: { xs: 2, sm: 0 }, textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography variant="body2" color="text.secondary">Subtotal Neto: <b>{totals.subtotal} €</b></Typography>
          <Typography variant="body2" color="text.secondary">Total Impuestos (IVA): <b>{totals.tax} €</b></Typography>
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold', mt: 0.5 }}>
            Total a Pagar: {totals.total} €
          </Typography>
        </Box>
        <Button type="submit" variant="contained" size="large" startIcon={<SaveIcon />} sx={{ bgcolor: '#0f172a', '&:hover': { bgcolor: '#334155' }, px: 4, py: 1.5 }}>
          Generar y Enviar VeriFactu
        </Button>
      </Card>
    </Box>
  );
}