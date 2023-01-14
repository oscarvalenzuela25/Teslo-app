import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import { Link, Typography, Box } from '@mui/material';
import React from 'react';
import ShopLayout from '../../components/layouts/ShopLayout';
import NextLink from 'next/link';

const EmptyPage = () => {
  return (
    <ShopLayout
      title="Carrito vació"
      pageDescription="No hay articulos en el carrito de compras"
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 200px)"
        flexDirection={{ xs: 'column', sm: 'row' }}
      >
        <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography>Su carrito esta vació</Typography>
          <NextLink href="/" passHref legacyBehavior>
            <Link typography="h4" color="secondary">
              Regresar
            </Link>
          </NextLink>
        </Box>
      </Box>
    </ShopLayout>
  );
};

export default EmptyPage;
