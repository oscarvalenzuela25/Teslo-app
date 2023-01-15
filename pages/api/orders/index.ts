import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { connect, disconnect } from '../../../database/db';
import { IOrder } from '../../../interfaces/order';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import { authOptions } from '../../../api/auth/[...nextauth]';

type Data =
  | {
      message: string;
    }
  | IOrder;

const handler = (req: NextApiRequest, res: NextApiResponse<Data>) => {
  switch (req.method) {
    case 'POST':
      return createOrder(req, res);
    default:
      return res.status(400).json({ message: 'Bad Request' });
  }
};

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, total } = req.body as IOrder;

  // Verificar que tengamos un usuario
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return res
      .status(401)
      .json({ message: 'Debe de estar autenticado para hacer esto' });
  }

  const productsIds = orderItems.map(({ _id }) => _id);
  connect();
  const dbProducts = await Product.find({ _id: { $in: productsIds } });
  try {
    const subTotal = orderItems.reduce((prev, current) => {
      // Estamos verificando que el precio del back sea igual al que mandan
      const currentPrice =
        dbProducts.find(prod => prod.id === current._id)?.price || 0;
      if (!currentPrice) {
        throw new Error('Verifique el carrito de nuevo, producto no existe');
      }
      return current.quantity * currentPrice + prev;
    }, 0);

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const backendTotal = subTotal * (taxRate + 1);

    if (total !== backendTotal) {
      throw new Error('El total no cuadra con el monto');
    }

    const userId = session.user._id;
    const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
    newOrder.total = Math.round(newOrder.total * 100) / 100;
    await newOrder.save();

    disconnect();
    return res.status(201).json(newOrder);
  } catch (error: any) {
    disconnect();
    return res.status(400).json({
      message: error.message || 'Revise logs del servidor',
    });
  }
};

export default handler;
