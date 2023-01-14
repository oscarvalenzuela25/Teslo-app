import {
  Box,
  Button,
  CardActionArea,
  CardMedia,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import React, { FC, useContext } from 'react';
import NextLink from 'next/link';
import ItemCounter from '../ui/ItemCounter';
import { CartContext } from '../../context/cart/cartContext';
import { ICartProduct } from '../../interfaces/cart';
import { IOrderItems } from '../../interfaces/order';

interface Props {
  editable?: boolean;
  products?: IOrderItems[];
}

const CartList: FC<Props> = ({ editable = false, products }) => {
  const { cart, updateCartQuantity, removeCartProduct } =
    useContext(CartContext);

  const productToShow = products || cart;

  const onNewCartQuantityValue = (
    product: ICartProduct,
    newQuantityValue: number
  ) => {
    product.quantity = newQuantityValue;
    updateCartQuantity(product);
  };

  return (
    <>
      {productToShow.map(product => (
        <Grid
          container
          spacing={2}
          key={product.slug + product.size}
          sx={{ mb: 1 }}
        >
          <Grid item xs={3}>
            <NextLink href={`/product/${product.slug}`} passHref legacyBehavior>
              <Link>
                <CardActionArea>
                  <CardMedia
                    image={product.image}
                    component="img"
                    sx={{ boderRadius: 5 }}
                  />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>

          <Grid item xs={7}>
            <Box display="flex" flexDirection="column">
              <Typography variant="body1">{product.title}</Typography>
              <Typography variant="body1">
                Talla: <strong>{product.size}</strong>
              </Typography>
              {editable ? (
                <ItemCounter
                  currentValue={product.quantity}
                  maxValue={100}
                  handleChangeQuantity={newValue =>
                    onNewCartQuantityValue(product, newValue)
                  }
                />
              ) : (
                <Typography variant="h6">
                  {product.quantity > 1
                    ? `${product.quantity} Productos`
                    : '1 Producto'}
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid
            item
            xs={2}
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <Typography variant="subtitle1">${product.price}</Typography>
            {editable && (
              <Button
                variant="text"
                color="secondary"
                onClick={() => removeCartProduct(product)}
              >
                Remover
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};

export default CartList;
