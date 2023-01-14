import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { connect, disconnect } from '../../../database/db';
import { PaypalOrderStatusResponse } from '../../../interfaces/paypal';
import Order from '../../../models/Order';

type Data =
  | {
      message: string;
    }
  | { token: string };

const handler = (req: NextApiRequest, res: NextApiResponse<Data>) => {
  switch (req.method) {
    case 'POST':
      return payOrder(req, res);
    default:
      return res.status(400).json({ message: 'Bad Request' });
  }
};

const getPaypalBearerToken = async (): Promise<string | null> => {
  const paypalClient = process.env.NEXT_PUBLIC_PAYPAL_CLIENT;
  const paypalSecret = process.env.PAYPAL_SECRET;
  const paypalOAuthRoute = process.env.PAYPAL_OAUTH_URL || '';
  try {
    const body = new URLSearchParams('grant_type=client_credentials');
    const base64Token = Buffer.from(
      `${paypalClient}:${paypalSecret}`,
      'utf-8'
    ).toString('base64');

    const { data } = await axios.post(paypalOAuthRoute, body, {
      headers: {
        Authorization: `Basic ${base64Token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return data.access_token;
  } catch (error) {
    return null;
  }
};

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { transactionId = '', orderId = '' } = req.body;
  const paypalBearerToken = await getPaypalBearerToken();
  if (!paypalBearerToken) {
    return res
      .status(400)
      .json({ message: 'No se pudo confirmar el token de paypal' });
  }
  const paypalOrdersRoute = process.env.PAYPAL_ORDERS_URL || '';
  const { data } = await axios.get<PaypalOrderStatusResponse>(
    `${paypalOrdersRoute}/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${paypalBearerToken}`,
      },
    }
  );

  if (data.status !== 'COMPLETED') {
    return res.status(401).json({ message: 'Orden no reconocida' });
  }

  connect();
  const dbOrder = await Order.findById(orderId);
  if (!dbOrder) {
    disconnect();
    return res
      .status(404)
      .json({ message: 'Orden no existe en nuestra base de datos' });
  }
  if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
    disconnect();
    return res
      .status(404)
      .json({ message: 'Los montos de paypal y nuestra orden no son iguales' });
  }
  dbOrder.transactionId = transactionId;
  dbOrder.isPaid = true;
  await dbOrder.save();
  disconnect();
  return res.status(200).json({ message: 'Orden pagada' });
};

export default handler;
