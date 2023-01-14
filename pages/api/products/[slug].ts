import type { NextApiRequest, NextApiResponse } from 'next';
import { connect, disconnect } from '../../../database/db';
import { IProduct } from '../../../interfaces/products';
import Product from '../../../models/Product';

type Data =
  | {
      message: string;
    }
  | {
      product: IProduct | null;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return getProductBySlug(req, res);
    default:
      return res.status(400).json({ message: 'Bad Request' });
  }
}

const getProductBySlug = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { slug } = req.query;
  await connect();
  let product = await Product.findOne({ slug }).lean();
  await disconnect();
  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  product.images = product.images.map(image => {
    return image.includes('http')
      ? image
      : `${process.env.HOST_NAME || ''}/products/${image}`;
  });
  return res.status(200).json({ product });
};
