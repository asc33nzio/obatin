import styled from 'styled-components';

export const DashboardPageContainer = styled.div<{
  $isDesktopDisplay: boolean;
}>`
  display: flex;
  flex-direction: column;

  width: 100vw;
  height: ${({ $isDesktopDisplay }) => ($isDesktopDisplay ? '100vh' : '200vh')};
`;

export const DashboardPageContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100vw;
  height: inherit;
`;

export const ProfileContainer = styled.div<{ $isDesktopDisplay: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: ${({ $isDesktopDisplay }) => ($isDesktopDisplay ? '50%' : '90%')};
  height: ${({ $isDesktopDisplay }) => ($isDesktopDisplay ? '66%' : '100%')};
  gap: 10px;
`;

export const ProfileHeader = styled.div<{ $isDesktopDisplay: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: ${({ $isDesktopDisplay }) => ($isDesktopDisplay ? '15%' : '8%')};
  padding-left: 15px;
  padding-right: 15px;
  border-bottom: 1px solid #00b5c0;

  h1 {
    color: #00b5c0;
    font-size: 38px;
    background: transparent;
  }
`;

export const ProfileContent = styled.section<{ $isDesktopDisplay: boolean }>`
  display: flex;
  flex-direction: ${({ $isDesktopDisplay }) =>
    $isDesktopDisplay ? 'row' : 'column'};
  align-items: center;

  width: 100%;
  height: 100%;
`;

export const ProfileContentLeft = styled.div<{ $isDesktopDisplay: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  width: ${({ $isDesktopDisplay }) => ($isDesktopDisplay ? '50%' : '100%')};
  height: inherit;
  gap: 15px;
`;

export const ImgBg = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 275px;
  height: 275px;

  border-radius: 50%;
  box-shadow: 0 0 10px 5px #bdbdbd;

  svg {
    object-fit: cover;
    width: 265px;
    height: 265px;
    border-radius: 50%;
    background-color: red;
  }
`;

export const ProfileContentSeparator = styled.div`
  display: inline-block;

  width: 1px;
  height: 95%;

  background-color: #a5a5a5;
`;

export const ProfileContentRight = styled.div<{ $isDesktopDisplay: boolean }>`
  display: flex;
  flex-direction: column;

  width: ${({ $isDesktopDisplay }) => ($isDesktopDisplay ? '50%' : '100%')};
  height: inherit;
  padding-left: 15px;

  h2 {
    font-size: 16px;
    color: #4a5568;
    margin-bottom: 5px;
  }
`;

export const UserDetailDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  width: 100%;
  height: 60px;
  margin-bottom: 5px;
  color: #a5a5a5;
  font-size: 18px;
  gap: 10px;

  svg {
    cursor: pointer;
    justify-self: flex-start;
    background: transparent;
    object-fit: cover;
    width: 30px;
    height: 30px;

    :hover {
      fill: #ff3f3f;
    }
  }

  span {
    margin-top: 15px;
  }
`;

export const AddressContainer = styled.div<{ $isDesktopDisplay: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: ${({ $isDesktopDisplay }) => ($isDesktopDisplay ? '50%' : '90%')};
  height: 40%;

  overflow-y: auto;
`;

export const AddressHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 15%;
  padding-left: 15px;
  padding-right: 15px;
  border-bottom: 1px solid #00b5c0;
  margin-bottom: 10px;

  h1 {
    color: #00b5c0;
    font-size: 38px;
    background: transparent;
  }
`;

export const GenderSelect = styled.select`
  width: 100%;
  height: 30px;

  background-color: #f7fafc;
  color: #4a5568;
  border-color: #d0d9e3;
  border-radius: 10px;
  outline: none;
  padding-left: 15px;
  font-size: 17px;

  cursor: pointer;
`;
