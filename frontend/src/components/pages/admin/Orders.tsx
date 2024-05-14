'use client';
import NavbarAdmin from '@/components/organisms/navbar/NavbarAdmin';
import AdminOrdersTable from '@/components/organisms/table/AdminOrderTable';
import AdminPaymentsTable from '@/components/organisms/table/AdminPaymentTable';
import { Container } from '@/styles/Global.styles';
import AO from '@/styles/pages/admin/AdminOrders.styles';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const OrdersPage = () => {
  const pathName = usePathname();
  const { replace } = useRouter();
  const [showTable, setShowTable] = useState<string | 'payments' | 'orders'>(
    'orders',
  );

  return (
    <>
      <Container>
        <NavbarAdmin />
        <AO.CustomSection>
          <AO.CustomSelect
            onChange={(e) => {
              setShowTable(e.target.value);
              replace(`${pathName}`);
            }}
            defaultValue={showTable}
          >
            <option value='payments'>Daftar Pembayaran</option>
            <option value='orders'>Daftar Pesanan</option>
          </AO.CustomSelect>
          {showTable == 'orders' ? (
            <AdminOrdersTable />
          ) : (
            <AdminPaymentsTable />
          )}
        </AO.CustomSection>
      </Container>
    </>
  );
};

export default OrdersPage;
