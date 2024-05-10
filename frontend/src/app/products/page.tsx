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
import {
  CartItem,
  addItemToCart,
  clearCart,
  removeItemFromCart,
} from '@/redux/reducers/cartSlice';
import { CategoryType, ProductType } from '@/types/Product';
import { Body, Container } from '@/styles/Global.styles';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import { ButtonAdd } from '@/styles/pages/product/ProductDetail.styles';
import { useObatinDispatch, useObatinSelector } from '@/redux/store/store';
import axios from 'axios';
import CustomButton from '@/components/atoms/button/CustomButton';
import Navbar from '@/components/organisms/navbar/Navbar';
import CategoryComponent from '@/components/molecules/category/Category';
import FilterComponent from '@/components/atoms/filter/DropdownFIlter';
import Image from 'next/image';
import Footer from '@/components/organisms/footer/Footer';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useToast } from '@/hooks/useToast';
import { NavigateToChat } from '../actions';
import Pagination from '@/components/molecules/admin/Pagination';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export interface IResponseProductPagination {
  page: number;
  page_count: number;
  total_records: number;
  limit: number;
}

export interface IResponseProduct {
  message: string;
  pagination: IResponseProductPagination;
  data: ProductType[];
}

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useObatinDispatch();
  const items = useObatinSelector((state) => state?.cart?.items);
  const { isDesktopDisplay } = useClientDisplayResolution();
  const { setToast } = useToast();

  const [products, setProducts] = useState<IResponseProduct>();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [isPrescriptionRequied] = useState<boolean>();
  const search = searchParams.get('search');

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
              isPrescriptionRequied: isPrescriptionRequied,
              search,
            },
          },
        );
        setProducts(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    page,
    categoryId,
    sortBy,
    classification,
    orderBy,
    isPrescriptionRequied,
    search,
  ]);

  useEffect(() => {
    setPage(1);
  }, [sortBy, orderBy, classification]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
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

  const handleClickPage = async (page: number) => {
    setPage(page);
    setLoading(false);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>();
  const handleAddToCart = (product: ProductType) => {
    if (product.is_prescription_required) {
      setToast({
        showToast: true,
        toastMessage: 'product ini membutuhkan prescription',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      dispatch(clearCart);
      NavigateToChat();
    } else {
      const existingItem = items.find((item) => {
        item.product_id === product.id;
      });
      if (existingItem) {
        dispatch(
          addItemToCart({
            ...existingItem,
            quantity: +1,
          }),
        );
        setSelectedProduct(product);
        return;
      }
      dispatch(
        addItemToCart({
          product_id: product.id,
          prescription_id: null,
          pharmacy_id: null,
          quantity: 1,
        }),
      );
      setSelectedProduct(product);
    }
  };

  const handleSubtract = (productId: Partial<CartItem>) => {
    const existingItem = items.find((item) => item.product_id === productId);
    if (existingItem && existingItem.quantity > 1) {
      dispatch(
        removeItemFromCart({
          ...existingItem,
          quantity: -1,
        }),
      );
    } else {
      dispatch(
        removeItemFromCart({
          product_id,
        }),
      );
      setSelectedProduct(null);
    }
  };

  const handleProductClicked = (slug: string) => {
    router.push(`products/${slug}`);
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
              setParentPage={() => setPage(1)}
            />
          </CategoryContainer>
          <ProductContent>
            <FilterContainer>
              <FilterComponent
                setSortBy={setSortBy}
                setClassification={setClassification}
                setOrderBy={setOrderBy}
                onClickClear={() => setCategoryId(null)}
                sortValue={sortBy}
                orderValue={orderBy}
                classificationValue={classification}
              />
            </FilterContainer>
            <ProductListContainer>
              {products?.data?.map((product) => (
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
                        {
                          items.find((item) => item.product_id === product.id)
                            ?.quantity
                        }
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

            {!loading && products && products.pagination && (
              <div style={{ padding: '30px 0' }}>
                <Pagination
                  currentPage={products.pagination.page}
                  totalPages={products.pagination.page_count}
                  onPageChange={(page) => handleClickPage(page)}
                />
              </div>
            )}
          </ProductContent>
        </Content>
        <Footer />
      </Body>
    </Container>
  );
};

export default ProductsPage;
