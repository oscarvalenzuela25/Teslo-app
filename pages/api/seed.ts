import type { NextApiRequest, NextApiResponse } from 'next';
import { connect, disconnect } from '../../database/db';
import { initialData } from '../../database/seed-data';
import Product from '../../models/Product';
import User from '../../models/User';

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(401).json({ message: 'No tiene acceso a este API' });
  }

  await connect();
  await Product.deleteMany();
  await User.deleteMany();
  await User.insertMany(initialData.users);
  await Product.insertMany(initialData.products);
  await disconnect();

  res.status(200).json({ message: 'Información cargada correctamente' });
}
