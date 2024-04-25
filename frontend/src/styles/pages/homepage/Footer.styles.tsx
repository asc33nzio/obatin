import styled from 'styled-components';
import { COLORS } from '@/constants/variables';

export const FooterContainer = styled.div<{ $resolution: string }>`
  height: ${({ $resolution }) =>
    $resolution === 'desktop' ? '300px' : '60px'};
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${COLORS.input_border};
  padding: 2rem 0 0 0;
`;

export const Top = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const Sitemap = styled.div`
  display: flex;
  gap: 40px;

  ul {
    li {
      padding-bottom: 10px;
      list-style: none;

      a {
        text-decoration: none;
        color: ${COLORS.primary_text};
      }
    }
  }
`;

export const Title = styled.li`
  font-weight: 700;
`;

export const SiteItems = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SiteItem = styled.li`
  display: flex;
  flex-direction: column;
  color: ${COLORS.primary_text};
`;
/* &L {
    text-decoration: none;
    color: ${COLORS.primary_text};
  } */

export const Slogan = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  color: ${COLORS.primary_text};

  svg {
    width: 300px;
  }

  @media screen and (min-width: 620) {
    svg {
      width: 200px;
    }
  }
`;

export const Copyright = styled.p`
  color: ${COLORS.primary_text};
`;
