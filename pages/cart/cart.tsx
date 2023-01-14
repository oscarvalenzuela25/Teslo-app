import React, { useContext, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import CartList from '../../components/cart/CartList';
import OrderSummary from '../../components/cart/OrderSummary';
import ShopLayout from '../../components/layouts/ShopLayout';
import { CartContext } from '../../context/cart/cartContext';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

const CartPage = () => {
  const { isLoaded, cart } = useContext(CartContext);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && cart.length === 0) {
      router.replace('/cart/empty');
    }
  }, [isLoaded, cart, router]);

  if (!isLoaded || cart.length === 0) return <></>;

  return (
    <ShopLayout
      title="Carrito - 3"
      pageDescription="Carrito de compras de la tienda"
    >
      <Typography variant="h1" component="h1">
        Carrito
      </Typography>

      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList editable />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">Orden</Typography>
              <Divider />

              <OrderSummary />

              <Box sx={{ mt: 3 }}>
                <NextLink href={'/checkout/address'} passHref>
                  <Button color="secondary" className="circular-btn" fullWidth>
                    Checkout
                  </Button>
                </NextLink>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default CartPage;
