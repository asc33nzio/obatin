import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const AddressCardContainer = styled.div<{
  $justify: string | undefined;
  $marBot: number | undefined;
  $disableBorder: boolean | undefined;
  $padding?: string | undefined;
  $height?: number | undefined;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ $justify }) => ($justify ? $justify : 'center')};
  border-bottom: ${({ $disableBorder }) =>
    $disableBorder ? 'none' : '1px solid #000000'};
  margin-bottom: ${({ $marBot }) => ($marBot ? `${$marBot}px` : '10px')};
  width: 100%;
  height: ${({ $height }) => ($height ? `${$height}px` : '25%')};
  padding: ${({ $padding }) => ($padding ? $padding : 0)};
`;

export const AddressCardLeftSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 80%;
  height: 100%;
`;

export const AddressCardHeader = styled.div<{ $fontSize: number | undefined }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  width: 100%;
  height: 32.5%;
  gap: 25px;

  h1 {
    color: ${COLORS.primary_text};
    font-size: ${({ $fontSize }) => ($fontSize ? `${$fontSize}px` : '24px')};
    font-weight: 400;
    background: transparent;
  }
`;

export const AddressDetails = styled.p`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  width: 100%;
  height: 65%;

  overflow: hidden;
  overflow-y: auto;
  text-overflow: ellipsis;
  font-size: 14px;
`;

export const IsMainAddressBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;

  width: 95px;
  height: 20px;

  border: 1px solid #00b5c0;
  border-radius: 5px;
  color: #00b5c0;
  font-size: 14px;
  font-weight: 550;
`;

export const AddressCardRightSection = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  width: 20%;
  height: 100%;
  gap: 25px;

  svg {
    cursor: pointer;
    :hover {
      fill: #e7833c;
    }
  }
`;
