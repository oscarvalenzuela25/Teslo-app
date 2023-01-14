import type { NextApiRequest, NextApiResponse } from 'next';
import { connect, disconnect } from '../../../database/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { Role } from '../../../interfaces/user';
import { signToken } from '../../../utils/jwt';
import { isValidEmail } from '../../../utils/validations';

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
      return registerUser(req, res);
    default:
      return res.status(400).json({
        message: 'Bad request',
      });
  }
}

const registerUser = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { name = '', email = '', password = '' } = req.body;

  if (password.legth < 6)
    return res
      .status(400)
      .json({ message: 'La password debe de tener al menos 6 caracteres' });
  if (name.legth < 3)
    return res.status(400).json({
      message: 'El nombre debe de tener al menos 3 caracteres',
    });
  if (!isValidEmail(email))
    return res.status(400).json({
      message: 'Ingrese un email valido',
    });

  await connect();
  const user = await User.findOne({ email });

  if (user)
    return res
      .status(400)
      .json({ message: 'Ya existe un usuario registrado con ese email' });

  const newUser = new User({
    name,
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password),
    role: 'client',
  });

  try {
    await newUser.save({ validateBeforeSave: true });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear el nuevo usuario',
    });
  }
  const { _id, role } = newUser;
  const token = signToken(_id, email);
  await disconnect();

  return res.status(200).json({
    token,
    user: {
      email,
      role: role,
      name,
    },
  });
};
