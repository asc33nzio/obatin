'use client';
import Navbar from '@/components/organisms/navbar/Navbar';
import AdminOrdersTable from '@/components/organisms/table/AdminTable';
import { Container } from '@/styles/Global.styles';
import AO from '@/styles/pages/admin/AdminOrders.styles';

const OrdersPage = () => {
  return (
    <>
      <Container>
        <Navbar />
        <AO.CustomSection>
          <AdminOrdersTable />
        </AO.CustomSection>
      </Container>
    </>
  );
};

export default OrdersPage;
