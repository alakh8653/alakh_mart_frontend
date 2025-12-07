export type Price = {
  amount: number;
  currency: string;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  price: Price;
  images: string[];
  rating: number;
  reviews: number;
  categories: string[];
  stock: number;
  featured?: boolean;
};

export type CartItem = {
  productId: string;
  quantity: number;
  userId?: string | null
};

export type User = {
  id: string;
  email: string;
  name?: string;
};

export type Order = {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  shipping: {
    name: string
    address: string
    city?: string
    state?: string
    zip?: string
    country?: string
  }
  paymentIntentId?: string
  paidAt?: string | null
  userId?: string | null
}
