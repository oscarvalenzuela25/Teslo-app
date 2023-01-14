import { GetServerSideProps, NextPage } from 'next';
import { Box, Typography } from '@mui/material';
import ShopLayout from '../../components/layouts/ShopLayout';
import { IProduct } from '../../interfaces/products';
import { getAllProducts, getProductByTerm } from '../../database/dbProduct';
import ProductList from '../../components/products/ProductList';

interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  return (
    <ShopLayout
      title="Teslo-shop - Home"
      pageDescription="Encuentra los mejores productos!"
    >
      <Typography variant="h1" component="h1" color="textPrimary">
        Buscar productos
      </Typography>
      {foundProducts ? (
        <Typography variant="h2" sx={{ mb: 1 }} textTransform="capitalize">
          Termino: {query}
        </Typography>
      ) : (
        <Box display="flex">
          <Typography variant="h2" sx={{ mb: 1 }}>
            No encontramos nungún producto
          </Typography>
          <Typography
            variant="h2"
            sx={{ mb: 1, ml: 1 }}
            color="secondary"
            textTransform="capitalize"
          >
            {query}
          </Typography>
        </Box>
      )}

      <ProductList products={products} />
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query } = params as { query: string };

  if (query.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  let products = await getProductByTerm(query);
  const foundProducts = !!products.length;

  if (!foundProducts) {
    products = await getAllProducts();
  }
  return {
    props: {
      products,
      foundProducts,
      query,
    },
  };
};

export default SearchPage;
