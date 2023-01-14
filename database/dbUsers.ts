import User from '../models/User';
import { connect, disconnect } from './db';
import bcrypt from 'bcryptjs';

export const checkUserEmailPassword = async (
  email: string,
  password: string
) => {
  connect();
  const user = await User.findOne({ email });
  disconnect();
  if (!user) return null;

  if (!bcrypt.compareSync(password, user.password!)) return null;

  const { role, name, _id } = user;

  return {
    _id,
    email: email.toLocaleLowerCase(),
    role,
    name,
  };
};

// Esta funcion crea o verifica el usuario de OAuth
export const oAuthToDbUser = async (oAuthEmail: string, oAuthName: string) => {
  connect();
  const user = await User.findOne({ email: oAuthEmail });
  if (user) {
    disconnect();
    const { _id, name, email, role } = user;
    return { _id, name, email, role };
  }

  const newUser = new User({
    email: oAuthEmail,
    name: oAuthName,
    password: '@',
    role: 'client',
  });
  await newUser.save();
  disconnect();
  const { _id, name, email, role } = newUser;
  return { _id, name, email, role };
};
