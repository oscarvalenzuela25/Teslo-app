import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import CartList from '../../components/cart/CartList';
import OrderSummary from '../../components/cart/OrderSummary';
import ShopLayout from '../../components/layouts/ShopLayout';
import NextLink from 'next/link';
import { CartContext } from '../../context/cart/cartContext';
import countries from '../../utils/countries';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const SummaryPage = () => {
  const router = useRouter();
  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { shippingAddress, numberOfItems, createOrder } =
    useContext(CartContext);

  useEffect(() => {
    if (!Cookies.get('firstName')) {
      router.push('/checkout/adress');
    }
  }, [router]);

  const onCreateOrder = async () => {
    setIsPosting(true);
    const { hasError, message } = await createOrder();
    if (hasError) {
      setIsPosting(false);
      setErrorMessage(message);
      return;
    }
    router.replace(`/orders/${message}`);
  };

  if (!shippingAddress) return <></>;

  return (
    <ShopLayout title="Resumen de orden" pageDescription="Resumen de la orden">
      <Typography variant="h1" component="h1" sx={{ mb: 2 }}>
        Resumen de la orden
      </Typography>

      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2" sx={{ mb: 1 }}>
                Resumen ({numberOfItems}{' '}
                {numberOfItems === 1 ? 'producto' : 'productos'})
              </Typography>
              <Divider />

              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="subtitle1">
                  Direccion de entrega
                </Typography>
                <NextLink href="/checkout/address" passHref legacyBehavior>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <Typography>
                {shippingAddress?.firstName} {shippingAddress?.lastName}
              </Typography>
              <Typography>{shippingAddress?.address}</Typography>
              <Typography>
                {shippingAddress?.city}, {shippingAddress?.zip}
              </Typography>
              <Typography>
                {countries.find(({ code }) => code === shippingAddress?.country)
                  ?.name || ''}
              </Typography>
              <Typography>{shippingAddress?.phone}</Typography>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="end">
                <NextLink href="/cart" passHref legacyBehavior>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Button
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  onClick={onCreateOrder}
                  disabled={isPosting}
                >
                  Confirmar Orden
                </Button>
                <Chip
                  color="error"
                  label={errorMessage}
                  sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// Vamos a verificar si estamos logeados
// Esta es la forma en como podemos verificar si ya estamos logeados con SSR
// Ahora verificamos esto con un middleware
// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   // Autenticacion personalizada
//   // const { token = '' } = req.cookies;
//   // let tokenIsValid = false;

//   // try {
//   //   await isValidToken(token);
//   //   tokenIsValid = true;
//   // } catch (error) {
//   //   tokenIsValid = false;
//   // }

//   // if (!token || !tokenIsValid) {
//   //   return {
//   //     redirect: {
//   //       destination: '/authorization/login?p=/checkout/address',
//   //       permanent: false,
//   //     },
//   //   };
//   // }

//   const session = await getToken({
//     req,
//     secret: process.env.NEXTAUTH_SECRET || '',
//   });

//   if (!session) {
//     return {
//       redirect: {
//         destination: '/authorization/login?p=/checkout/summary',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// };

export default SummaryPage;
