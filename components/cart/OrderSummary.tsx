import { Grid, Typography } from '@mui/material';
import React, { FC, useContext } from 'react';
import { format } from '../../utils/currency';
import { CartContext } from '../../context/cart/cartContext';

interface Props {
  summaryData?: {
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
  };
}

const OrderSummary: FC<Props> = ({ summaryData }) => {
  const { numberOfItems, subTotal, tax, total } = useContext(CartContext);

  const orderSummary = summaryData || {
    numberOfItems,
    subTotal,
    tax,
    total,
  };

  return (
    <Grid container mt={1}>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>
          {orderSummary.numberOfItems}{' '}
          {orderSummary.numberOfItems > 1 ? 'productos' : 'producto'}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>SubTotal</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{format(orderSummary.subTotal)}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>
          Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)
        </Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{format(orderSummary.tax)}</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Total:</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end" sx={{ mt: 2 }}>
        <Typography variant="subtitle1">
          {format(orderSummary.total)}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default OrderSummary;
