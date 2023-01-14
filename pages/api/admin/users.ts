import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { connect, disconnect } from '../../../database/db';
import { IUser } from '../../../interfaces/user';
import User from '../../../models/User';

type Data =
  | {
      message: string;
    }
  | IUser[]
  | IUser;

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
      return getUsers(req, res);
    case 'PUT':
      return updateUser(req, res);
    default:
      return res.status(500).json({ message: 'Bad request' });
  }
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  connect();
  const users = await User.find().select('-password').lean();
  disconnect();

  return res.status(200).json(users);
};

const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { userId = '', role = '' } = req.body;
  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: 'No existe usuario por ese id' });
  }
  const validRoles = ['admin', 'client'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Rol invalido' });
  }

  connect();
  const user = await User.findById(userId);
  if (!user)
    return res.status(404).json({ message: 'No se encontro el usuario' });

  user.role = role;
  await user.save();
  disconnect();

  return res.status(200).json(user);
};
