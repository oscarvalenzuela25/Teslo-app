import type { NextApiRequest, NextApiResponse } from 'next';
import { connect, disconnect } from '../../../database/db';
import User from '../../../models/User';
import { isValidEmail } from '../../../utils/validations';
import bcrypt from 'bcryptjs';
import { IUser } from '../../../interfaces/user';

type Data =
  | {
      message: string;
    }
  | IUser;

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === 'POST') {
    const {
      secret = '',
      name = '',
      email = '',
      password = '',
      role = 'client',
    } = req.body;
    if (!secret) {
      return res
        .status(500)
        .json({ message: 'La palabra secreta es requerida' });
    }

    const secretJwtSeed = process.env.JWT_SECRET_SEED || '';

    if (!secretJwtSeed !== secret) {
      return res
        .status(400)
        .json({ message: 'La palabra secreta ingresada es incorrecta' });
    }

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

    connect();
    const user = await User.findOne({ email });

    if (user)
      return res
        .status(400)
        .json({ message: 'Ya existe un usuario registrado con ese email' });

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: bcrypt.hashSync(password),
      role,
    });

    try {
      await newUser.save({ validateBeforeSave: true });
    } catch (error) {
      return res.status(500).json({
        message: 'Error al crear el nuevo usuario',
      });
    }
    disconnect();

    return res.status(201).json(newUser);
  }

  return res.status(500).json({ message: 'Bad request' });
};

export default handler;
