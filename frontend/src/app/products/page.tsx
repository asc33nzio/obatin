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
  PrescriptionBadge,
  Price,
  ProductCard,
  Smallfont,
} from '@/styles/pages/product/ProductCard.styles';
import {
  increaseOneToCart,
  deduceOneFromCart,
} from '@/redux/reducers/cartSlice';
import { CategoryType, ProductType } from '@/types/Product';
import { Body, Container } from '@/styles/Global.styles';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ButtonAdd } from '@/styles/pages/product/ProductDetail.styles';
import { useObatinDispatch, useObatinSelector } from '@/redux/store/store';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useToast } from '@/hooks/useToast';
import { navigateToChat } from '../actions';
import { PaginationDiv } from '@/styles/pages/dashboard/transactions/Transactions.styles';
import Axios from 'axios';
import CustomButton from '@/components/atoms/button/CustomButton';
import Navbar from '@/components/organisms/navbar/Navbar';
import CategoryComponent from '@/components/molecules/category/Category';
import FilterComponent from '@/components/atoms/filter/DropdownFIlter';
import Image from 'next/image';
import Footer from '@/components/organisms/footer/Footer';
import PaginationComponent from '@/components/organisms/pagination/PaginationComponent';

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
  // eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [isPrescriptionRequied] = useState<boolean>();
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>();
  const search = searchParams.get('search');

  const handlePageJump = (i: number) => {
    setPage(i);
  };

  const handlePrevPage = () => {
    if (page === 1) return;
    setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page === products?.pagination.page_count) return;
    setPage(page + 1);
  };

  const handleAddToCart = (product: ProductType) => {
    if (product.is_prescription_required) {
      setToast({
        showToast: true,
        toastMessage:
          'Produk ini membutuhkan resep, silahkan melakukan konsultasi',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      navigateToChat();
      return;
    }

    dispatch(increaseOneToCart(product.id));
    setSelectedProduct(product);
  };

  const handleSubtract = (productId: number) => {
    const existingItem = items.find((item) => item.product_id === productId);

    if (existingItem === undefined) {
      return;
    }

    dispatch(deduceOneFromCart(existingItem));
    if (existingItem.quantity === 0) {
      setSelectedProduct(null);
    }
  };

  const handleProductClicked = (slug: string) => {
    router.push(`products/${slug}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: response } = await Axios.get(
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
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
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
  }, [categoryId, sortBy, classification, orderBy, search]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: response } = await Axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/categories`,
        );
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Container>
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
                onClickClear={() => {
                  setPage(1);
                  setCategoryId(null);
                }}
                sortValue={sortBy}
                orderValue={orderBy}
                classificationValue={classification}
              />
            </FilterContainer>
            <ProductListContainer>
              {products?.data?.map((product) => (
                <ProductCard key={product.id}>
                  {product.is_prescription_required && (
                    <PrescriptionBadge>Membutuhkan Resep</PrescriptionBadge>
                  )}
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
                  {selectedProduct?.id === product.id &&
                  items.find((item) => item.product_id === product.id)
                    ?.quantity !== undefined ? (
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
                      content='Tambah Ke Keranjang'
                      onClick={() => handleAddToCart(product)}
                      $width='150px'
                      $height='50px'
                      $fontSize='16px'
                    />
                  )}
                </ProductCard>
              ))}
            </ProductListContainer>

            {products && products.pagination && (
              <PaginationDiv>
                <PaginationComponent
                  page={products.pagination.page}
                  totalPages={products.pagination.page_count}
                  goToPage={handlePageJump}
                  handlePrevPage={handlePrevPage}
                  handleNextPage={handleNextPage}
                />
              </PaginationDiv>
            )}
          </ProductContent>
        </Content>
        <Footer />
      </Body>
    </Container>
  );
};

export default ProductsPage;
