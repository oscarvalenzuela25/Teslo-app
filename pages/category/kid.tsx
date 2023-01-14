import React from 'react';
import { Typography } from '@mui/material';
import ShopLayout from '../../components/layouts/ShopLayout';
import useProducts from '../../hooks/useProducts';
import FullScreenLoading from '../../components/ui/FullScreenLoading';
import ProductList from '../../components/products/ProductList';

const KidPage = () => {
  const { products, isLoading } = useProducts('/products?gender=kid');
  return (
    <ShopLayout
      title="Teslo-Shop - Niños"
      pageDescription="Encuentra los mejores productos para niños!"
    >
      <Typography variant="h1" component="h1" color="textPrimary">
        Tienda
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Productos de Niños
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default KidPage;
