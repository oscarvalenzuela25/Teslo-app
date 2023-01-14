import { IProduct } from '../interfaces/products';
import Product from '../models/Product';
import { connect, disconnect } from './db';

export const getProductBySlug = async (
  slug: string
): Promise<IProduct | null> => {
  await connect();
  const product = await Product.findOne({ slug }).lean();
  await disconnect();
  if (!product) return null;

  product.images = product.images.map(image => {
    return image.includes('http')
      ? image
      : `${process.env.HOST_NAME || ''}/products/${image}`;
  });

  return JSON.parse(JSON.stringify(product));
};

interface ProductSlug {
  slug: string;
}

export const getAllProductsSlugs = async (): Promise<ProductSlug[]> => {
  await connect();
  const slugs = await Product.find().select('slug -_id');
  await disconnect();

  return slugs;
};

export const getProductByTerm = async (term: string): Promise<IProduct[]> => {
  term = term?.toString().toLocaleLowerCase();

  await connect();
  let products = await Product.find({ $text: { $search: term } })
    .select('title images price inStock slug -_id')
    .lean();

  const updatedProducts = products.map(product => {
    product.images = product.images.map(image => {
      return image.includes('http')
        ? image
        : `${process.env.HOST_NAME || ''}/products/${image}`;
    });
    return product;
  });

  await disconnect();

  return updatedProducts;
};

export const getAllProducts = async (): Promise<IProduct[]> => {
  await connect();
  const products = await Product.find().select('-_id');
  await disconnect();

  const updatedProducts = products.map(product => {
    product.images = product.images.map(image => {
      return image.includes('http')
        ? image
        : `${process.env.HOST_NAME || ''}/products/${image}`;
    });
    return product;
  });

  return JSON.parse(JSON.stringify(updatedProducts));
};
