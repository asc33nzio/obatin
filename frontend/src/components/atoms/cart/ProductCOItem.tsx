import { Details, ProductItem } from '@/styles/pages/product/Cart.styles';
import React from 'react';
import { Section } from '@/styles/pages/checkout/CheckoutPage.styles';

const ProductCOItem = () => {
  return (
    <ProductItem>
      <Details>
        <Section $isBorder={false}>
          <h2>Info Farmasi</h2>
          <p>Sentosa Farma Apotek 477</p>
          <p>
            Jl. Edy IV No.21, RW.6, Guntur, Kecamatan Setiabudi, Kota Jakarta
            Selatan, Daerah Khusus Ibukota Jakarta 12980, Indonesia
          </p>
        </Section>
        <Section $isBorder={false}>
          <h2>Metode Pengiriman</h2>
          <p>harga pengiriman: 7025</p>
        </Section>
      </Details>
    </ProductItem>
  );
};

export default ProductCOItem;
