import React, { useState } from 'react';
import { 
  AppBar, Box, CssBaseline, Drawer, IconButton, List, 
  ListItem, ListItemIcon, ListItemText, Toolbar, Typography, useMediaQuery, useTheme 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BuildIcon from '@mui/icons-material/Build';

const drawerWidth = 240;

export default function Layout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <div>
      <Toolbar>
        <BuildIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          Da Mechanic
        </Typography>
      </Toolbar>
      <List>
        <ListItem button component="a" href="/">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Panel General" />
        </ListItem>
        <ListItem button component="a" href="/invoices/new">
          <ListItemIcon><ReceiptLongIcon /></ListItemIcon>
          <ListItemText primary="Nueva Factura" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Barra superior para móviles y tablets */}
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, bgcolor: '#1e293b' }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Da Mechanic — Sistema SIF VeriFactu
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Menú lateral (Drawer) responsive */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>

      {/* Contenido Principal de la App */}
      <Box component="main" sx={{ flexGrow: req => req, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}