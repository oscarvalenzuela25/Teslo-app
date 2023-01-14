import { createContext } from 'react';
import { ICartProduct } from '../../interfaces/cart';
import { ShippingAddress } from '../../interfaces/order';

interface ContextProps {
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  isLoaded: boolean;
  shippingAddress?: ShippingAddress;

  // Methods
  addProductToCart: (productCart: ICartProduct) => void;
  updateCartQuantity: (productCart: ICartProduct) => void;
  removeCartProduct: (productCart: ICartProduct) => void;
  updateAddress: (address: ShippingAddress) => void;

  // Orders
  createOrder: () => Promise<{
    hasError: boolean;
    message: string;
  }>;
}

export const CartContext = createContext({} as ContextProps);
