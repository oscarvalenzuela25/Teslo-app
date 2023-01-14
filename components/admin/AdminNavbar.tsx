import NextLink from 'next/link';
import { AppBar, Toolbar, Link, Typography, Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UiContext } from '../../context/ui/UiContext';

const AdminNavbar = () => {
  const { toggleSideMenu } = useContext(UiContext);

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref legacyBehavior>
          <Link display="flex" alignItems="center" underline="none">
            <Typography variant="h6">Teslo |</Typography>
            <Typography
              sx={{
                ml: 0.5,
              }}
            >
              Shop
            </Typography>
          </Link>
        </NextLink>

        <Box flex={1} />

        <Button onClick={toggleSideMenu}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
