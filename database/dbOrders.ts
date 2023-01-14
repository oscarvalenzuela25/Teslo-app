import { isValidObjectId } from 'mongoose';
import { IOrder } from '../interfaces/order';
import Order from '../models/Order';
import { connect, disconnect } from './db';

export const getOrderById = async (id: string): Promise<IOrder | null> => {
  if (!isValidObjectId(id)) return null;

  await connect();
  const order = await Order.findById({ _id: id }).lean();
  await disconnect();

  if (!order) {
    return null;
  }

  return JSON.parse(JSON.stringify(order));
};

export const getOrdersByUser = async (userId: string): Promise<IOrder[]> => {
  if (!isValidObjectId(userId)) return [];
  await connect();
  const orders = await Order.find({ user: userId }).lean();
  await disconnect();
  return JSON.parse(JSON.stringify(orders));
};
