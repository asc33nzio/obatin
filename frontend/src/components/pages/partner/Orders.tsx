'use client';
import Navbar from '@/components/organisms/navbar/Navbar';
import PartnerOrdersTable from '@/components/organisms/table/PartnerOrderTable';
import { Container } from '@/styles/Global.styles';
import AO from '@/styles/pages/admin/AdminOrders.styles';

const OrdersPage = () => {
  return (
    <>
      <Container>
        <Navbar />
        <AO.CustomSection>
          <PartnerOrdersTable />
        </AO.CustomSection>
      </Container>
    </>
  );
};

export default OrdersPage;
