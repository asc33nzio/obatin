import Homepage from '@/components/pages/homepage/Homepage';
import axios from 'axios';

const fetchCategories = async () => {
  try {
    const { data: res } = await axios.get(
      `${process.env.API_BASE_URL}/shop/categories`,
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

const fetchProducts = async () => {
  try {
    const { data: res } = await axios.get(
      `${process.env.API_BASE_URL}/shop/products?limit=5&sort_by=sales`,
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

const HomePage = async () => {
  const categories = await fetchCategories();
  const products = await fetchProducts();
  return <Homepage categories={categories} products={products} />;
};

export default HomePage;
