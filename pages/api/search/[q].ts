import type { NextApiRequest, NextApiResponse } from 'next';
import { connect, disconnect } from '../../../database/db';
import { IProduct } from '../../../interfaces/products';
import Product from '../../../models/Product';

type Data =
  | {
      message: string;
    }
  | {
      products: IProduct[];
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return searchProducts(req, res);
    default:
      return res.status(400).json({ message: 'Bad Request' });
  }
}

const searchProducts = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  let { q } = req.query;
  if (q?.length === 0) {
    return res
      .status(400)
      .json({ message: 'Debe de especificar la query de busqueda' });
  }

  q = q?.toString().toLocaleLowerCase();

  await connect();
  // @ts-ignore
  const products = await Product.find({ $text: { $search: q } })
    .select('title images price inStock slug -_id')
    .lean();

  await disconnect();
  return res.status(200).json({ products });
};
