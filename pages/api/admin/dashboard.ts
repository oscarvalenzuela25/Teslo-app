import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { connect, disconnect } from '../../../database/db';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import User from '../../../models/User';

type Data =
  | {
      numberOfOrders: number;
      paidOrders: number;
      notPaidOrders: number;
      numberOfClients: number;
      numberOfProducts: number;
      productsWithNotInventory: number;
      lowInventory: number;
    }
  | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || '',
  });

  if (!session || session.user.role !== 'admin') {
    return res.status(503).json({ message: 'No autorizado' });
  }
  connect();

  const [
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNotInventory,
    lowInventory,
  ] = await Promise.all([
    Order.count(),
    Order.find({ paid: true }).count(),
    Order.find({ paid: false }).count(),
    User.find({ role: 'client' }).count(),
    Product.count(),
    Product.find({ inStock: 0 }).count(),
    Product.find({ inStock: { $lte: 10 } }).count(),
  ]);

  disconnect();
  return res.status(200).json({
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNotInventory,
    lowInventory,
  });
}
