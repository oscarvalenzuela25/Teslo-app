import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Grid,
  Typography,
  Link,
  Chip,
} from '@mui/material';
import React, { FC, useMemo, useState } from 'react';
import { IProduct } from '../../interfaces/products';
import NextLink from 'next/link';

interface Props {
  product: IProduct;
}

const ProductCard: FC<Props> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoader] = useState(false);

  const productImage = useMemo(() => {
    return isHovered ? product.images[1] : product.images[0];
  }, [isHovered, product.images]);

  // Aqui tenemos 2 acciones nuevas, onMouseEnter y onMouseLeave
  return (
    <Grid
      item
      xs={6}
      sm={4}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card>
        <NextLink
          href={`/product/${product.slug}`}
          passHref
          legacyBehavior
          prefetch={false}
        >
          <Link>
            <CardActionArea>
              {product.inStock === 0 && (
                <Chip
                  color="primary"
                  label="No hay disponibles"
                  sx={{ position: 'absolute', zIndex: 99, top: 10, left: 10 }}
                />
              )}
              <CardMedia
                component="img"
                image={productImage}
                alt={product.title}
                className="fadeIn"
                onLoad={() => setIsImageLoader(true)}
              />
            </CardActionArea>
          </Link>
        </NextLink>
      </Card>

      <Box
        sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }}
        className="fadeIn"
      >
        <Typography fontWeight={700}>{product.title}</Typography>
        <Typography fontWeight={500}>${product.price}</Typography>
      </Box>
    </Grid>
  );
};

export default ProductCard;
