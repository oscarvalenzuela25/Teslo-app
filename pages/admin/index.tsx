import React, { useEffect, useState } from 'react';
import {
  AccessTimeOutlined,
  AttachMoneyOutlined,
  CancelPresentationOutlined,
  CategoryOutlined,
  CreditCardOffOutlined,
  DashboardOutlined,
  GroupOutlined,
  ProductionQuantityLimitsOutlined,
} from '@mui/icons-material';
import { NextPage } from 'next';
import AdminLayout from '../../components/layouts/AdminLayout';
import { Grid } from '@mui/material';
import SummaryTile from '../../components/admin/SummaryTile';
import useSWR from 'swr';
import { DashboardSummaryResponse } from '../../interfaces/dashboard';

const DashboardPage: NextPage = () => {
  const [refreshIn, setRefreshIn] = useState(30);
  const { data, error } = useSWR<DashboardSummaryResponse>(
    '/api/admin/dashboard',
    {
      refreshInterval: 30 * 1000,
    }
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn(refreshIn => (refreshIn > 0 ? refreshIn - 1 : 30));
    }, 1000);

    // Esta funcion limpia el intervalo
    return () => clearInterval(interval);
  }, []);

  if (!error && !data) {
    return <></>;
  }

  return (
    <AdminLayout
      title="Dashboard"
      subTitle="Estadisticas generales"
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTile
          title={data?.numberOfOrders || 0}
          subTitle={'Ordenes totales'}
          icon={
            <CreditCardOffOutlined color="secondary" sx={{ fontSize: 40 }} />
          }
        />

        <SummaryTile
          title={data?.paidOrders || 0}
          subTitle={'Ordenes pagadas'}
          icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={data?.notPaidOrders || 0}
          subTitle={'Ordenes pendientes'}
          icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={data?.numberOfClients || 0}
          subTitle={'Clientes'}
          icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={data?.numberOfProducts || 0}
          subTitle={'Productos'}
          icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={data?.productsWithNotInventory || 0}
          subTitle={'Sin existencias'}
          icon={
            <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />
          }
        />

        <SummaryTile
          title={data?.lowInventory || 0}
          subTitle={'Bajo inventario'}
          icon={
            <ProductionQuantityLimitsOutlined
              color="warning"
              sx={{ fontSize: 40 }}
            />
          }
        />

        <SummaryTile
          title={refreshIn}
          subTitle={'Actualización en:'}
          icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
