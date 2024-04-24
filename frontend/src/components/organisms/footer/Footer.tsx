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
import { navigateToHome } from '@/app/actions';

const Footer = (): React.ReactElement => {
  return (
    <FooterContainer $resolution='desktop'>
      <Top>
        <Slogan>
          <ObatinICO />
        </Slogan>
        <Sitemap>
          <ul>
            <Title>
              <a
                onClick={() => navigateToHome()}
                style={{ textDecoration: 'none' }}
              >
                Pages
              </a>
            </Title>
            <li>
              <a onClick={() => navigateToHome()}>Home</a>
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
              <a onClick={() => navigateToHome()}>Service</a>
            </Title>
            <li>
              <a onClick={() => navigateToHome()}>Chat Dokter</a>
            </li>
            <li>
              <a onClick={() => navigateToHome()}>Beli Obat</a>
            </li>
          </ul>

          <ul>
            <Title>
              <a onClick={() => navigateToHome()}>Contact</a>
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
