import styled from 'styled-components';

export const BannerContainer = styled.div`
  width: 100%;
  height: 500px;
  padding-top: 2rem;
  @media (max-width: 769px) {
    height: 300px;
    width: 300px;
  }
`;

export const Imagecontainer = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 24px;
  @media (max-width: 769px) {
    height: 300px;
    width: 300px;
  }
`;
