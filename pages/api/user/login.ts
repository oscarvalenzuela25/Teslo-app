import type { NextApiRequest, NextApiResponse } from 'next';
import { connect, disconnect } from '../../../database/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { Role } from '../../../interfaces/user';
import { signToken } from '../../../utils/jwt';

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
    case 'POST':
      return loginUser(req, res);
    default:
      return res.status(400).json({
        message: 'Bad request',
      });
  }
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email = '', password = '' } = req.body;
  await connect();
  const user = await User.findOne({ email });
  await disconnect();

  if (!user) {
    return res.status(404).json({ message: 'Correo o password no validos' });
  }

  if (!bcrypt.compareSync(password, user.password!)) {
    return res.status(404).json({ message: 'Correo o password no validos' });
  }

  const { role, name, _id } = user;

  const token = signToken(_id, email);

  return res.status(200).json({
    token,
    user: {
      email,
      role,
      name,
    },
  });
};
