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
import Image from 'next/image';
import Footer from '@/components/organisms/footer/Footer';
import { ButtonAdd } from '@/styles/pages/product/ProductDetail.styles';
import { useObatinDispatch, useObatinSelector } from '@/redux/store/store';
import { addItemToCart, removeItemFromCart } from '@/redux/reducers/cartSlice';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const ProductsPage = () => {
  const router = useRouter();
  const dispatch = useObatinDispatch();
  const items = useObatinSelector((state) => state.cart.items);

  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<string | null>(null);

  // const accessToken = getCookie('access_token');
  // const userSessionCredentials = decodeJWTSync(accessToken?.toString());
  // const userRole = userSessionCredentials?.payload?.Payload?.role;
  // const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>();
  const handleAddToCart = (product: ProductType) => {
    const existingItem = items.find((item) => item.id === product.id);
    if (existingItem) {
      dispatch(
        addItemToCart({
          ...existingItem,
          quantity: +1,
        }),
      );
    } else {
      dispatch(
        addItemToCart({
          id: product.id,
          name: product.name,
          quantity: 1,
          price: product.min_price,
          image_url: product.image_url,
        }),
      );
    }
    setSelectedProduct(product);
  };

  const handleSubtract = (productId: number) => {
    const existingItem = items.find((item) => item.id === productId);
    if (existingItem && existingItem.quantity > 1) {
      dispatch(
        addItemToCart({
          ...existingItem,
          quantity: -1,
        }),
      );
    } else {
      dispatch(removeItemFromCart(productId));
      setSelectedProduct(null);
    }
  };

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
              <FilterComponent
                setSortBy={setSortBy}
                setClassification={setClassification}
                setOrderBy={setOrderBy}
              />
            </FilterContainer>
            <ProductListContainer>
              {products.map((product) => (
                <ProductCard key={product.id}>
                  <div
                    onClick={() => handleProductClicked(product.product_slug)}
                  >
                    <Imagecontainer>
                      <Image
                        height={150}
                        width={150}
                        src={product.image_url}
                        alt='banner'
                      />
                    </Imagecontainer>{' '}
                    <Bold>{product.name}</Bold>
                    <Smallfont>{product.selling_unit}</Smallfont>
                    <Price>
                      Rp{product?.min_price.toLocaleString()} - Rp
                      {product?.max_price.toLocaleString()}
                    </Price>
                  </div>

                  {selectedProduct?.id === product.id ? (
                    <ButtonAdd>
                      <CustomButton
                        content='-'
                        onClick={() => handleSubtract(product.id)}
                        $width='80px'
                        $height='30px'
                        $fontSize='18px'
                        $color='#00B5C0'
                        $bgColor='white'
                        $border='#00B5C0'
                      />
                      <p>
                        {items.find((item) => item.id === product.id)?.quantity}
                      </p>
                      <CustomButton
                        content='+'
                        onClick={() => handleAddToCart(product)}
                        $width='80px'
                        $height='30px'
                        $fontSize='18px'
                        $color='#00B5C0'
                        $bgColor='white'
                        $border='#00B5C0'
                      />
                    </ButtonAdd>
                  ) : (
                    <CustomButton
                      content='Add to Cart'
                      onClick={() => handleAddToCart(product)}
                      $width='150px'
                      $height='50px'
                      $fontSize='16px'
                    />
                  )}
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
        <Footer />
      </Body>
    </Container>
  );
};

export default ProductsPage;
