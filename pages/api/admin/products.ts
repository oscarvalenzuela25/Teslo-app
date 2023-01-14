import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { connect, disconnect } from '../../../database/db';
import { IProduct } from '../../../interfaces/products';
import Product from '../../../models/Product';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data =
  | {
      message: string;
    }
  | IProduct[]
  | IProduct;

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const session: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || '',
  });

  if (!session || session.user.role !== 'admin') {
    return res.status(503).json({ message: 'No autorizado' });
  }
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);
    case 'POST':
      return createProduct(req, res);
    case 'PUT':
      return updateProduct(req, res);
    default:
      return res.status(500).json({ message: 'Bad request' });
  }
};

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  connect();
  const products = await Product.find().sort({ title: 'asc' }).lean();
  const updatedProducts = products.map(product => {
    product.images = product.images.map(image => {
      return image.includes('http')
        ? image
        : `${process.env.HOST_NAME || ''}/products/${image}`;
    });
    return product;
  });
  disconnect();
  return res.status(200).json(updatedProducts);
};

const updateProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { _id = '', images = [] } = req.body as IProduct;
  if (!isValidObjectId(_id)) {
    return res.status(404).json({ message: 'ID de producto invalido' });
  }

  if (images.length < 2) {
    return res
      .status(400)
      .json({ message: 'Al menos son necesarias 2 imagenes' });
  }
  try {
    connect();
    const product = await Product.findById(_id);
    if (!product) {
      return res.status(404).json({ message: 'No existe producto con ese ID' });
    }

    product.images.forEach(async image => {
      if (!images.includes(image)) {
        const [fileId] = image.substring(image.lastIndexOf('/') + 1).split('.');
        await cloudinary.uploader.destroy(fileId);
      }
    });

    await product.update(req.body);
    const newProduct = await Product.findById(_id);
    disconnect();
    return res.status(200).json(newProduct!);
  } catch (error) {
    disconnect();
    return res.status(400).json({ message: 'Revisar la consola del servidor' });
  }
};

const createProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { images = [] } = req.body as IProduct;

  if (images.length < 2) {
    return res
      .status(400)
      .json({ message: 'Al menos son necesarias 2 imagenes' });
  }
  try {
    connect();
    const productInDB = await Product.findOne({ slug: req.body.slug });
    if (productInDB) {
      return res
        .status(400)
        .json({ message: 'Ya existe un producto con ese slug' });
    }
    const product = new Product(req.body);
    await product.save();
    disconnect();
    return res.status(200).json(product);
  } catch (error) {
    disconnect();
    return res.status(400).json({ message: 'Revisar la consola del servidor' });
  }
};

export default handler;
