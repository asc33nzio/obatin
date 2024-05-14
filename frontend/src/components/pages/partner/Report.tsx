'use client';
import NavbarPartner from '@/components/organisms/navbar/NavbarPartner';
import PartnerStockMovementsTable from '@/components/organisms/table/PartnerStockMovementsTable';
import { Container } from '@/styles/Global.styles';
import AO from '@/styles/pages/admin/AdminOrders.styles';

const ReportPage = () => {
  return (
    <>
      <Container>
        <NavbarPartner />
        <AO.CustomSection>
          <PartnerStockMovementsTable />
        </AO.CustomSection>
      </Container>
    </>
  );
};

export default ReportPage;
