'use client';
import {
  CategoryContainer,
  Content,
  FilterContainer,
  ProductContent,
  ProductListContainer,
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
import { useFullscreen } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CustomButton from '@/components/atoms/button/CustomButton';
import Navbar from '@/components/organisms/navbar/Navbar';

const ProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<ProductType[]>([]);
  const { ref, toggle } = useFullscreen();
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
        const { data: response } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/products`,
        );
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

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

  return (
    <Container>
      <Navbar />

      <Body>
        <Content>
          <CategoryContainer>
            {categories.map((category) => {
              return (
                <ul key={category.id}>
                  <li value={category.category_level}>
                    <a href={category.category_slug}>{category.name}</a>
                    {/* <ul>{category.children}</ul> */}
                  </li>
                </ul>
              );
            })}
          </CategoryContainer>
          <ProductContent>
            <FilterContainer>
              <select>
                <option value='#'>Nama</option>
                <option value='#'>Harga</option>
              </select>
              <select>
                <option value='#'>Obat Keras</option>
                <option value='#'>Obat Bebas</option>
                <option value='#'>Obat Bebas Terbatas</option>
                <option value='#'>Non Obat</option>
              </select>
              <select>
                <option value='#'>Rendah ke Tinggi</option>
                <option value='#'>Tinggi ke Rendah</option>
              </select>
            </FilterContainer>
            <ProductListContainer>
              {products.map((product) => {
                return (
                  <ProductCard
                    key={product.id}
                    onClick={() => handleProductClicked(product.product_slug)}
                  >
                    <Imagecontainer
                      ref={ref}
                      src={product.image_url}
                      alt='banner'
                      onClick={toggle}
                    />
                    <Bold>{product.name}</Bold>
                    <Smallfont>{product.selling_unit}</Smallfont>
                    <Price>
                      Rp{product.min_price} - Rp{product.max_price}
                    </Price>
                    <CustomButton
                      $width='90px'
                      $height='32px'
                      content='Add to Cart'
                      $fontSize='12px'
                    />
                  </ProductCard>
                );
              })}
            </ProductListContainer>
          </ProductContent>
        </Content>
      </Body>
    </Container>
  );
};

export default ProductsPage;
