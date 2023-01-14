import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { CreditCardOff, CreditScoreOutlined } from '@mui/icons-material';
import CartList from '../../../components/cart/CartList';
import OrderSummary from '../../../components/cart/OrderSummary';
import ShopLayout from '../../../components/layouts/ShopLayout';
import { getOrderById } from '../../../database/dbOrders';
import { IOrder } from '../../../interfaces/order';
import countries from '../../../utils/countries';

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
  const { shippingAddress, numberOfItems, subTotal, tax, total } = order;

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
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id = '' } = query;
  const order = await getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/admin/orders`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
