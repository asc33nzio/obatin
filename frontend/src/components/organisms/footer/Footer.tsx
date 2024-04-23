import { 
  Copyright,
  FooterContainer,
  Sitemap,
  Slogan,
  Title,
  Top
} from '@/styles/pages/homepage/Footer.styles'
import React from 'react'
import Link from 'next/link'
import ObatinICO from '@/assets/icons/ObatinICO'

const Footer = (): React.ReactElement =>  {
  return (
    <FooterContainer $resolution='desktop'>
      <Top>
        <Slogan>
          <ObatinICO/>
        </Slogan>
        <Sitemap>
          <ul>
            <Title>
              <Link href="/home" style={{textDecoration:'none'}}>Pages</Link>
            </Title>
            <li>
              <Link href="/home">Home</Link>
            </li>
            <li>
              <Link href="/home">FAQ</Link>
            </li>
            <li>
              <Link href="/home">Kebijakan Privasi</Link>
            </li>
          </ul>

          <ul>
            <Title>
              <Link href="/home">Service</Link>
            </Title>
            <li>
              <Link href="/home">Chat Dokter</Link>
            </li>
            <li>
              <Link href="/home">Beli Obat</Link>
            </li>
          </ul>

          <ul>
            <Title>
              <Link href="/home">Contact</Link>
            </Title>
            <li>
              <Link href="/home">00909098</Link>
            </li>
            <li>
              <Link href="/home">obatin.pharma@gmail.com</Link>
            </li>
          </ul>
        </Sitemap>
      </Top>
      <Copyright>@ Obatin Pharma 2024</Copyright>
    </FooterContainer>
  )
}

export default Footer