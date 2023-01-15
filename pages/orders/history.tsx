import React from 'react';
import ShopLayout from '../../components/layouts/ShopLayout';
import { Typography, Grid, Chip, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { getOrdersByUser } from '../../database/dbOrders';
import { IOrder } from '../../interfaces/order';

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 100,
  },
  {
    field: 'fullname',
    headerName: 'Nombre Completo',
    width: 300,
  },
  {
    field: 'paid',
    headerName: 'Pagada',
    description: 'Muestra informacion si esta pagada la orden o no',
    width: 200,
    // @ts-ignore
    renderCell: (params: GridValueGetterParams) => {
      return (
        <>
          {params.row.paid ? (
            <Chip color="success" label="Pagada" variant="outlined" />
          ) : (
            <Chip color="error" label="No Pagada" variant="outlined" />
          )}
        </>
      );
    },
  },
  {
    field: 'orderId',
    headerName: 'Ver orden',
    width: 200,
    sortable: false,
    // @ts-ignore
    renderCell: (params: GridValueGetterParams) => {
      return (
        <NextLink
          href={`/orders/${params.row.orderId}`}
          passHref
          legacyBehavior
        >
          <Link underline="always">Ver Orden</Link>
        </NextLink>
      );
    },
  },
];

interface Props {
  orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
  const orderData = orders.map(({ _id, isPaid, shippingAddress }, index) => ({
    id: index + 1,
    paid: isPaid,
    fullname: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
    orderId: _id,
  }));

  return (
    <ShopLayout title="Historial" pageDescription="Historial de ordenes">
      <Typography variant="h1" component="h1">
        Historial de ordenes
      </Typography>

      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={orderData}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login?p=/orders/history',
        permanent: false,
      },
    };
  }

 const orders = await getOrdersByUser(session?.user?._id!);

  return {
    props: { orders },
  };
};

export default HistoryPage;
