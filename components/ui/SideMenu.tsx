import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import {
  AccountCircleOutlined,
  AdminPanelSettings,
  CategoryOutlined,
  ConfirmationNumberOutlined,
  DashboardOutlined,
  EscalatorWarningOutlined,
  FemaleOutlined,
  LoginOutlined,
  MaleOutlined,
  SearchOutlined,
  VpnKeyOutlined,
} from '@mui/icons-material';
import { ChangeEvent, useContext, useState } from 'react';
import { UiContext } from '../../context/ui/UiContext';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context/auth/AuthContext';

const SideMenu = () => {
  const router = useRouter();
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const { isMenuOpen, toggleSideMenu } = useContext(UiContext);
  const [searchTerm, setSearchTerm] = useState('');

  const handleRedirect = (url: string) => {
    router.push(url);
    toggleSideMenu();
  };

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    handleRedirect(`/search/${searchTerm}`);
  };

  const onLogout = () => {
    logout();
  };

  return (
    <Drawer
      open={isMenuOpen}
      anchor="right"
      sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
      onClose={toggleSideMenu}
    >
      <Box sx={{ width: 250, paddingTop: 5 }}>
        <List>
          <ListItem>
            <Input
              autoFocus
              type="text"
              onKeyPress={e => (e.key === 'Enter' ? onSearchTerm() : null)}
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              placeholder="Buscar..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onSearchTerm}
                  >
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          </ListItem>

          {isLoggedIn && (
            <>
              <ListItem button>
                <ListItemIcon>
                  <AccountCircleOutlined />
                </ListItemIcon>
                <ListItemText primary={'Perfil'} />
              </ListItem>

              <ListItem
                button
                onClick={() => handleRedirect('/orders/history')}
              >
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={'Mis Ordenes'} />
              </ListItem>
            </>
          )}

          <ListItem
            button
            onClick={() => handleRedirect('/category/men')}
            sx={{ display: { sm: 'none' } }}
          >
            <ListItemIcon>
              <MaleOutlined />
            </ListItemIcon>
            <ListItemText primary={'Hombres'} />
          </ListItem>

          <ListItem
            button
            onClick={() => handleRedirect('/category/woman')}
            sx={{ display: { sm: 'none' } }}
          >
            <ListItemIcon>
              <FemaleOutlined />
            </ListItemIcon>
            <ListItemText primary={'Mujeres'} />
          </ListItem>

          <ListItem
            button
            onClick={() => handleRedirect('/category/kid')}
            sx={{ display: { sm: 'none' } }}
          >
            <ListItemIcon>
              <EscalatorWarningOutlined />
            </ListItemIcon>
            <ListItemText primary={'Niños'} />
          </ListItem>

          {isLoggedIn ? (
            <ListItem button onClick={onLogout}>
              <ListItemIcon>
                <LoginOutlined />
              </ListItemIcon>
              <ListItemText primary={'Salir'} />
            </ListItem>
          ) : (
            <ListItem
              button
              onClick={() => handleRedirect(`/auth/login?p=${router.asPath}`)}
            >
              <ListItemIcon>
                <VpnKeyOutlined />
              </ListItemIcon>
              <ListItemText primary={'Ingresar'} />
            </ListItem>
          )}

          {user?.role === 'admin' && (
            <>
              {/* Admin */}
              <Divider />
              <ListSubheader>Admin Panel</ListSubheader>

              <ListItem button onClick={() => handleRedirect('/admin')}>
                <ListItemIcon>
                  <DashboardOutlined />
                </ListItemIcon>
                <ListItemText primary={'Dashboard'} />
              </ListItem>

              <ListItem
                button
                onClick={() => handleRedirect('/admin/products')}
              >
                <ListItemIcon>
                  <CategoryOutlined />
                </ListItemIcon>
                <ListItemText primary={'Productos'} />
              </ListItem>

              <ListItem button onClick={() => handleRedirect('/admin/orders')}>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={'Ordenes'} />
              </ListItem>

              <ListItem button onClick={() => handleRedirect('/admin/users')}>
                <ListItemIcon>
                  <AdminPanelSettings />
                </ListItemIcon>
                <ListItemText primary={'Usuarios'} />
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default SideMenu;
