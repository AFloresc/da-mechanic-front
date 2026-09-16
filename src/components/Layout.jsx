import React, { useState } from 'react';
import { 
  AppBar, Box, CssBaseline, Divider, Drawer, IconButton, 
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Toolbar, Typography 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PeopleIcon from '@mui/icons-material/People'; // <--- 1. Importar el icono de clientes
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 260;

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Panel de Control', icon: <DashboardIcon />, path: '/' },
    { text: 'Nueva Factura (VeriFactu)', icon: <AddCircleIcon />, path: '/invoices/new' },
    { text: 'Historial de Facturas', icon: <ReceiptLongIcon />, path: '/invoices' },
    { text: 'Gestión de Clientes', icon: <PeopleIcon />, path: '/customers' }, // <--- 2. Añadido al menú
  ];

  const drawer = (
    <div>
      <Toolbar sx={{ bgcolor: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', px: 2 }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          TallerApp 🚗
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => {
          const selected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                selected={selected}
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                sx={{
                  '&.Mui-selected': { bgcolor: '#e2e8f0', '&:hover': { bgcolor: '#cbd5e1' } }
                }}
              >
                <ListItemIcon sx={{ color: selected ? '#0f172a' : 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ '& .MuiListItemText-primary': { fontWeight: selected ? 'bold' : 'normal' } }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', width: '100vw', minHeight: '100vh', bgcolor: '#f8fafc', overflowX: 'hidden' }}>
      <CssBaseline />
      
      {/* Barra superior */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          color: '#0f172a',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
            Sistema de Gestión y Facturación VeriFactu
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* Menú lateral (Drawer) */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #e2e8f0' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Contenido Principal con Flexbox nativo puro */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          mt: 8,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItem: 'center'
        }}
      >
        <Toolbar />
        <Box sx={{ width: '100%', maxWidth: '900px' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}