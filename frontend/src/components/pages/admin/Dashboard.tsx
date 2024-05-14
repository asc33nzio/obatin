/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import {
  navigateToAdminDoctorApproval,
  navigateToAdminOrders,
  navigateToAdminPartner,
  navigateToAdminProduct,
} from '@/app/actions';
import NavbarAdmin from '@/components/organisms/navbar/NavbarAdmin';
import { useToast } from '@/hooks/useToast';
import { Container } from '@/styles/Global.styles';
import Admin from '@/styles/pages/admin/AdminOrders.styles';
import { ProductType } from '@/types/Product';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const ContentContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
`;

const AdminActionContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const AdminCardMenu = styled.div`
  padding: 1rem;
  font-size: 20px;
  border: 1px solid grey;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #00000034;
  }
`;

const DashboardPage = () => {
  const accessToken = getCookie('access_token');
  const { setToast } = useToast();
  const [products, setProducts] = useState<ProductType[]>([]);
  const fetchProducts = async () => {
    try {
      const { data: res } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/products?limit=5&sort_by=sales`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setProducts(res.data);
    } catch (error) {
      console.error(error);
      setToast({
        showToast: true,
        toastMessage: 'Maaf terjadi kesalahan',
        toastType: 'error',
        resolution: 'desktop',
        orientation: 'center',
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Container>
        <NavbarAdmin />
        <ContentContainer>
          <Title>Produk populer hari ini</Title>
          <Admin.TableFilterWrapper>
            <Admin.Table>
              <thead>
                <tr>
                  <th>Gambar</th>
                  <th>Nama</th>
                  <th>Jumlah Penjualan</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'green' : ''}>
                    <td>
                      <Image
                        src={item.image_url}
                        alt='product'
                        width={30}
                        height={30}
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.sales || 0}</td>
                  </tr>
                ))}
              </tbody>
            </Admin.Table>
          </Admin.TableFilterWrapper>
          <Title>Aksi</Title>
          <AdminActionContainer>
            <AdminCardMenu onClick={() => navigateToAdminProduct()}>
              Atur Produk
            </AdminCardMenu>
            <AdminCardMenu onClick={() => navigateToAdminOrders()}>
              Atur Pesanan
            </AdminCardMenu>
            <AdminCardMenu onClick={() => navigateToAdminPartner()}>
              Atur Partner
            </AdminCardMenu>
            <AdminCardMenu onClick={() => navigateToAdminDoctorApproval()}>
              Atur Permohonan Dokter
            </AdminCardMenu>
          </AdminActionContainer>
        </ContentContainer>
      </Container>
    </>
  );
};

export default DashboardPage;
