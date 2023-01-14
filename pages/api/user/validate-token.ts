import type { NextApiRequest, NextApiResponse } from 'next';
import { connect, disconnect } from '../../../database/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { Role } from '../../../interfaces/user';
import { isValidToken, signToken } from '../../../utils/jwt';

type Data =
  | {
      message: string;
    }
  | {
      token: string;
      user: {
        email: string;
        role: Role;
        name: string;
      };
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return checkJWT(req, res);
    default:
      return res.status(400).json({
        message: 'Bad request',
      });
  }
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { token = '' } = req.cookies;
  let userId = '';

  try {
    userId = await isValidToken(token);
  } catch (error) {
    return res.status(401).json({ message: 'Token invalido' });
  }

  await connect();
  const user = await User.findById(userId).lean();
  await disconnect();

  if (!user) {
    return res.status(404).json({ message: 'No existe usuario con ese id' });
  }

  const { _id, email, role, name } = user;

  return res.status(200).json({
    token: signToken(_id, email),
    user: {
      email,
      role,
      name,
    },
  });
};
