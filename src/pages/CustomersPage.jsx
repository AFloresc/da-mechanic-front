import React, { useState, useEffect } from 'react';
import {
  Box, Button, Card, Grid, TextField, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import axios from 'axios';

export default function CustomersPage() {
  const tenantId = 'taller-demo-01'; // O recupéralo de tu contexto/estado
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({ id: '', name: '', nif: '', address: '', email: '', phone: '' });
  const [isEditing, setIsEditing] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/customers?tenant_id=${tenantId}`);
      
      // Validamos y extraemos el array de clientes de forma segura
      const data = res.data;
      if (Array.isArray(data)) {
        setCustomers(data);
      } else if (data && Array.isArray(data.customers)) {
        setCustomers(data.customers);
      } else if (data && Array.isArray(data.data)) {
        setCustomers(data.data);
      } else {
        setCustomers([]);
      }
    } catch (err) {
      console.error("Error al cargar clientes", err);
      setCustomers([]);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [tenantId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/api/v1/customers/${formData.id}`, formData);
      } else {
        await axios.post(`http://localhost:8080/api/v1/customers`, { ...formData, tenant_id: tenantId });
      }
      setFormData({ id: '', name: '', nif: '', address: '', email: '', phone: '' });
      setIsEditing(false);
      fetchCustomers();
    } catch (err) {
      console.error("Error al guardar cliente", err);
    }
  };

  const handleEdit = (cust) => {
    setFormData(cust);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este cliente?")) {
      try {
        await axios.delete(`http://localhost:8080/api/v1/customers/${id}`);
        fetchCustomers();
      } catch (err) {
        console.error("Error al eliminar", err);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: '900px', mx: 'auto', mt: 1, px: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1e293b' }}>
        Gestión de Clientes del Taller
      </Typography>

      {/* Formulario de Alta / Edición */}
      <Card component="form" onSubmit={handleSubmit} sx={{ p: 3, mb: 4, boxShadow: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
          {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Nombre / Razón Social" name="name" value={formData.name} onChange={handleChange} required size="small" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="NIF / CIF" name="nif" value={formData.nif} onChange={handleChange} required size="small" />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField fullWidth label="Dirección Completa" name="address" value={formData.address} onChange={handleChange} size="small" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Correo Electrónico" name="email" type="email" value={formData.email} onChange={handleChange} size="small" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} size="small" />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" startIcon={<PersonAddIcon />} sx={{ bgcolor: '#0f172a' }}>
            {isEditing ? 'Actualizar Cliente' : 'Guardar Cliente'}
          </Button>
          {isEditing && (
            <Button variant="outlined" onClick={() => { setIsEditing(false); setFormData({ id: '', name: '', nif: '', address: '', email: '', phone: '' }); }}>
              Cancelar
            </Button>
          )}
        </Box>
      </Card>

      {/* Listado de Clientes */}
      <Card sx={{ p: 2, boxShadow: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>Listado de Clientes Registrados</Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell><b>Nombre</b></TableCell>
                <TableCell><b>NIF</b></TableCell>
                <TableCell><b>Teléfono</b></TableCell>
                <TableCell align="center"><b>Acciones</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(customers) && customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.nif}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" size="small" onClick={() => handleEdit(c)}><EditIcon /></IconButton>
                    <IconButton color="error" size="small" onClick={() => handleDelete(c.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {(!Array.isArray(customers) || customers.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} align="center">No hay clientes registrados.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}