'use client';
import {
  Content,
  FilterContainer,
  ProductContent,
  ProductListContainer,
  CategoryContainer,
} from '@/styles/pages/product/ProductListPage.styles';
import {
  Bold,
  Imagecontainer,
  Price,
  ProductCard,
  Smallfont,
} from '@/styles/pages/product/ProductCard.styles';
import { CategoryType, ProductType } from '@/types/Product';
import { Body, Container } from '@/styles/Global.styles';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CustomButton from '@/components/atoms/button/CustomButton';
import Navbar from '@/components/organisms/navbar/Navbar';
import CategoryComponent from '@/components/molecules/category/Category';
import { Inter } from 'next/font/google';
import FilterComponent from '@/components/atoms/filter/DropdownFIlter';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const ProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: response } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/products?`,
          {
            params: {
              limit: 12,
              page,
              category: categoryId,
              sort_by: sortBy,
              classification: classification,
              order: orderBy,
            },
          },
        );

        setProducts([...response.data]);
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [page, categoryId, sortBy, classification, orderBy]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
        const { data: response } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/categories`,
        );
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const handleProductClicked = (slug: string) => {
    router.push(`products/${slug}`);
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <Container className={inter.className}>
      <Navbar />

      <Body>
        <Content>
          <CategoryContainer>
            <CategoryComponent
              categories={categories}
              setCategoryId={setCategoryId}
            />
          </CategoryContainer>
          <ProductContent>
            <FilterContainer>
              <h2>Products: </h2>
              <FilterComponent
                setSortBy={setSortBy}
                setClassification={setClassification}
                setOrderBy={setOrderBy}
              />
            </FilterContainer>
            <ProductListContainer>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  onClick={() => handleProductClicked(product.product_slug)}
                >
                  <Imagecontainer src={product.image_url} alt='banner' />
                  <Bold>{product.name}</Bold>
                  <Smallfont>{product.selling_unit}</Smallfont>
                  <Price>
                    Rp{product?.min_price.toLocaleString()} - Rp
                    {product?.max_price.toLocaleString()}
                  </Price>
                  <CustomButton
                    $width='90px'
                    $height='32px'
                    content='Add to Cart'
                    $fontSize='12px'
                  />
                </ProductCard>
              ))}
            </ProductListContainer>
            <CustomButton
              onClick={handleLoadMore}
              disabled={loading}
              content='load more'
              $width='150px'
              $fontSize='18px'
            />
          </ProductContent>
        </Content>
      </Body>
    </Container>
  );
};

export default ProductsPage;
