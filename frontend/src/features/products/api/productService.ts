import { products } from '../../../_mocks/products';
// Mock, sau khi có API của BE sẽ gọi tới axios instance
// Simulate API call
const getProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products);
    }, 500); // Simulate network delay
  });
};

export const productService = {
  getProducts,
};
