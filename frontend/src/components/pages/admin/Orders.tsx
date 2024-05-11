'use client';
import Navbar from '@/components/organisms/navbar/Navbar';
import AdminTables from '@/components/organisms/table/AdminTable';
import { Container } from '@/styles/Global.styles';
import AO from '@/styles/pages/admin/AdminOrders.styles';
import { useState } from 'react';

const OrdersPage = () => {
  const [showTable, setShowTable] = useState<string | 'payments' | 'orders'>(
    'orders',
  );

  return (
    <>
      <Container>
        <Navbar />
        <AO.CustomSection>
          <AO.CustomSelect
            onChange={(e) => setShowTable(e.target.value)}
            defaultValue={showTable}
          >
            <option value='payments'>Daftar Pembayaran</option>
            <option value='orders'>Daftar Pesanan</option>
          </AO.CustomSelect>
          {showTable == 'orders' ? (
            <AdminTables.Orders />
          ) : (
            <AdminTables.Payments />
          )}
        </AO.CustomSection>
      </Container>
    </>
  );
};

export default OrdersPage;
