import { Product } from '@/types';
import { getProductsDB, getProductByIdDB } from './products-db'
import { seedProducts } from './seed-large-data';

// Sample product set - add more to make it large
export const sampleProducts: Product[] = [
  {
    id: 'p1',
    title: 'Wireless Noise Cancelling Headphones',
    description: 'High-fidelity audio, long battery life, noise cancelling headphones with customizable EQ.',
    price: { amount: 199.99, currency: 'USD' },
    images: ['/images/headphones-1.jpg'],
    rating: 4.6,
    reviews: 1283,
    categories: ['Electronics', 'Audio'],
    stock: 120,
    featured: true,
  },
  {
    id: 'p2',
    title: 'Ergonomic Mesh Office Chair',
    description: 'Premium office chair with lumbar support, breathable mesh, and adjustable armrests.',
    price: { amount: 289.0, currency: 'USD' },
    images: ['/images/chair-1.jpg'],
    rating: 4.4,
    reviews: 249,
    categories: ['Furniture', 'Office'],
    stock: 30,
  },
  {
    id: 'p3',
    title: 'Smartphone 128GB (Refined) - Midnight Black',
    description: 'Latest generation smartphone with advanced cameras and long-lasting battery, refined edition.',
    price: { amount: 799.0, currency: 'USD' },
    images: ['/images/phone-1.jpg'],
    rating: 4.7,
    reviews: 5421,
    categories: ['Electronics', 'Mobile'],
    stock: 220,
    featured: true,
  },
  {
    id: 'p4',
    title: 'Stainless Steel Chef Knife - 8"',
    description: 'Durable 8-inch chef knife with premium blade and non-slip handle. Perfect for home cooks and professionals.',
    price: { amount: 59.99, currency: 'USD' },
    images: ['/images/knife-1.jpg'],
    rating: 4.5,
    reviews: 721,
    categories: ['Home', 'Kitchen'],
    stock: 400,
  }
];

// Merge with generated products to simulate a large catalog
export const largeProducts = [...sampleProducts, ...seedProducts(500)];

export const getProducts = async (query?: { q?: string; category?: string; page?: number; limit?: number }) => {
  // Prefer DB products if available
  try {
    const r = await getProductsDB(query)
    return r
  } catch (e) {
    // fallback to in-memory
  }
  // Simulate search and pagination (fallback)
  await new Promise((r) => setTimeout(r, 200));
  let results = largeProducts;
  if (query?.q) {
    const q = query.q.toLowerCase();
    results = results.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (query?.category) {
    results = results.filter((p) => p.categories.includes(query.category as string));
  }
  const page = query?.page ?? 1;
  const limit = query?.limit ?? 12;
  const start = (page - 1) * limit;
  return {
    items: results.slice(start, start + limit),
    total: results.length,
    page,
  };
};

export const getProductById = async (id: string) => {
  try {
    const p = await getProductByIdDB(id)
    if (p) return p
  } catch (e) {
    // fallback
  }
  await new Promise((r) => setTimeout(r, 150));
  return sampleProducts.find((p) => p.id === id) ?? null;
};
