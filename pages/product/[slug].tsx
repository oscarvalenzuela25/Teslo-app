import { Grid, Box, Typography, Button, Chip } from '@mui/material';
import React, { useContext, useState } from 'react';
import ShopLayout from '../../components/layouts/ShopLayout';
import ProductSlideshow from '../../components/products/ProductSlideshow';
import SizeSelector from '../../components/products/SizeSelector';
import ItemCounter from '../../components/ui/ItemCounter';
import {
  // GetServerSideProps,
  GetStaticPaths,
  NextPage,
  GetStaticProps,
} from 'next';
import { IProduct, ISize } from '../../interfaces/products';
import {
  getAllProductsSlugs,
  getProductBySlug,
} from '../../database/dbProduct';
import { ICartProduct } from '../../interfaces/cart';
import { useRouter } from 'next/router';
import { CartContext } from '../../context/cart/cartContext';

interface Props {
  product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
  const router = useRouter();
  const { addProductToCart } = useContext(CartContext);
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });

  const handleSelectSize = (size: ISize) => {
    setTempCartProduct({
      ...tempCartProduct,
      size,
    });
  };

  const handleChangeQuantity = (quantity: number) => {
    setTempCartProduct({
      ...tempCartProduct,
      quantity,
    });
  };

  const onAddProduct = () => {
    if (!tempCartProduct.size) return;
    addProductToCart(tempCartProduct);
    router.push('/cart');
  };

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        {/* IMG */}
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={product.images} />
        </Grid>

        {/* Product Information */}
        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>
            <Typography variant="subtitle1" component="h2">
              ${product.price}
            </Typography>

            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2">Cantidad</Typography>
              <ItemCounter
                currentValue={tempCartProduct.quantity}
                maxValue={product.inStock}
                handleChangeQuantity={handleChangeQuantity}
              />
              <SizeSelector
                selectedSize={tempCartProduct.size}
                sizes={product.sizes}
                handleSelectSize={handleSelectSize}
              />
            </Box>

            {product.inStock > 0 ? (
              <Button
                color="secondary"
                className="circular-btn"
                onClick={onAddProduct}
              >
                {tempCartProduct.size
                  ? 'Agregar al carrito'
                  : 'Seleccione una talla'}
              </Button>
            ) : (
              <Chip
                label="No hay disponibles"
                color="error"
                variant="outlined"
              />
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Descripción</Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async ctx => {
  const slugs = await getAllProductsSlugs();
  const paths = slugs.map(({ slug }) => ({ params: { slug } }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
    revalidate: 10,
  };
};

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const { slug = '' } = params as { slug: string };
//   const product = await getProductBySlug(slug);

//   if (!product) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       product,
//     },
//   };
// };

export default ProductPage;
