import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { connect, disconnect } from '../../../database/db';
import { IOrder } from '../../../interfaces/order';
import Order from '../../../models/Order';

type Data =
  | {
      message: string;
    }
  | IOrder[];

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

  switch (req.method) {
    case 'GET':
      return getOrders(req, res);
    default:
      return res.status(500).json({ message: 'Bad request' });
  }
}
const getOrders = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  connect();
  const orders = await Order.find()
    .sort({ createdAt: 'desc' })
    .populate('user', 'name email')
    .lean();
  disconnect();
  return res.status(200).json(orders);
};
