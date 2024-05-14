import {
  Copyright,
  FooterContainer,
  Sitemap,
  Slogan,
  Title,
  Top,
} from '@/styles/organisms/Footer.styles';
import React from 'react';
import ObatinICO from '@/assets/icons/ObatinICO';
import {
  navigateToDoctorList,
  navigateToHome,
  navigateToProductList,
} from '@/app/actions';

const Footer = (): React.ReactElement => {
  return (
    <FooterContainer $resolution='desktop'>
      <Top>
        <Slogan>
          <ObatinICO handleClick={() => navigateToHome()} />
        </Slogan>
        <Sitemap>
          <ul>
            <Title>
              <a
                onClick={() => navigateToHome()}
                style={{ textDecoration: 'none' }}
              >
                Halaman
              </a>
            </Title>
            <li>
              <a onClick={() => navigateToHome()}>Beranda</a>
            </li>
            <li>
              <a onClick={() => navigateToHome()}>FAQ</a>
            </li>
            <li>
              <a onClick={() => navigateToHome()}>Kebijakan Privasi</a>
            </li>
          </ul>

          <ul>
            <Title>
              <a onClick={() => navigateToHome()}>Layanan</a>
            </Title>
            <li>
              <a onClick={() => navigateToDoctorList()}>Chat Dokter</a>
            </li>
            <li>
              <a onClick={() => navigateToProductList()}>Beli Obat</a>
            </li>
          </ul>

          <ul>
            <Title>
              <a onClick={() => navigateToHome()}>Kontak</a>
            </Title>
            <li>
              <a onClick={() => navigateToHome()}>00909098</a>
            </li>
            <li>
              <a onClick={() => navigateToHome()}>obatin.pharma@gmail.com</a>
            </li>
          </ul>
        </Sitemap>
      </Top>
      <Copyright>@ Obatin Pharma 2024</Copyright>
    </FooterContainer>
  );
};

export default Footer;
