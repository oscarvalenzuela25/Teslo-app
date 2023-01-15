import React, { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import CartList from '../../components/cart/CartList';
import OrderSummary from '../../components/cart/OrderSummary';
import ShopLayout from '../../components/layouts/ShopLayout';
import NextLink from 'next/link';
import { CreditCardOff, CreditScoreOutlined } from '@mui/icons-material';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { getOrderById } from '../../database/dbOrders';
import { IOrder } from '../../interfaces/order';
import countries from '../../utils/countries';
import { PayPalButtons } from '@paypal/react-paypal-js';
import tesloApi from '../../api/tesloApi';
import { useRouter } from 'next/router';

export type OrderResponseBody = {
  id: string;
  status:
    | 'COMPLETED'
    | 'SAVED'
    | 'APPROVED'
    | 'VOIDED'
    | 'PAYER_ACTION_REQUIRED';
};

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const [isPaying, setIsPaying] = useState(false);
  const router = useRouter();
  const { shippingAddress, numberOfItems, subTotal, tax, total } = order;

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== 'COMPLETED') {
      return alert('No hay pago en Paypal');
    }
    setIsPaying(true);
    try {
      await tesloApi.post(`/orders/pay`, {
        transactionId: details.id,
        orderId: order._id,
      });
      router.reload();
    } catch (error) {
      setIsPaying(false);
      alert('Error');
    }
  };

  return (
    <ShopLayout
      title={`Resumen de la orden ${order._id}`}
      pageDescription="Resumen de la orden"
    >
      <Typography variant="h1" component="h1">
        Orden {order._id}
      </Typography>

      {order.isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label="Orden pagada"
          variant="outlined"
          color="success"
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label="Pendiende de pago"
          variant="outlined"
          color="error"
          icon={<CreditCardOff />}
        />
      )}

      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList products={order.orderItems} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Resumen ({order.numberOfItems}{' '}
                {order.numberOfItems > 1 ? 'productos' : 'producto'})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="subtitle1">
                  Direccion de entrega
                </Typography>
                <NextLink href="/checkout/address" passHref legacyBehavior>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <Typography>{`${shippingAddress.firstName} ${shippingAddress.lastName}`}</Typography>
              <Typography>{shippingAddress.address}</Typography>
              {shippingAddress.address2 && (
                <Typography>{shippingAddress.address2}</Typography>
              )}
              <Typography>
                {shippingAddress.city} {shippingAddress.zip}
              </Typography>
              <Typography>
                {
                  countries.find(({ code }) => code === shippingAddress.country)
                    ?.name
                }
              </Typography>
              <Typography>{shippingAddress.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <OrderSummary
                summaryData={{
                  numberOfItems,
                  subTotal,
                  tax,
                  total,
                }}
              />

              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Box
                  display="flex"
                  justifyContent="center"
                  className="fadeIn"
                  sx={{ display: isPaying ? 'flex' : 'none' }}
                >
                  <CircularProgress />
                </Box>

                <Box
                  flexDirection="column"
                  sx={{
                    display: isPaying ? 'none' : 'flex',
                    flex: 1,
                  }}
                >
                  {order.isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      label="Orden pagada"
                      variant="outlined"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: order.total.toString(),
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then(details => {
                          onOrderCompleted(details);
                        });
                      }}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const { id = '' } = query;
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p='orders/${id}`,
        permanent: false,
      },
    };
  }

  const order = await getOrderById(id.toString());

  // test
  // if (!order || order.user !== session.user._id) {
  //   return {
  //     redirect: {
  //       destination: `/orders/history`,
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
