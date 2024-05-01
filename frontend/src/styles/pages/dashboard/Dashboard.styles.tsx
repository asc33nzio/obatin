import styled from 'styled-components';

export const DashboardPageContainer = styled.div<{
  $isDesktopDisplay: boolean;
}>`
  display: flex;
  flex-direction: column;

  width: 99vw;
  max-width: 100vw;
  height: ${({ $isDesktopDisplay }) => ($isDesktopDisplay ? '125vh' : '200vh')};
  overflow-x: hidden;
`;

export const DashboardPageContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding-top: 50px;

  width: 100vw;
  height: 95%;
`;

export const ProfileContainer = styled.div<{ $isDesktopDisplay: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: ${({ $isDesktopDisplay }) => ($isDesktopDisplay ? '50%' : '90%')};
  height: ${({ $isDesktopDisplay }) => ($isDesktopDisplay ? '40%' : '100%')};
  gap: 10px;

  margin-bottom: 100px;
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

export const ProfileHeaderButtonsDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  width: 40%;
  height: 100%;

  gap: 25px;
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

  span {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 60%;
    height: 15%;

    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const ImgBg = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 275px;
  height: 275px;
  margin-bottom: 20px;

  border-radius: 50%;
  border: 5px solid #00b5c0;
  box-shadow: 0 0 10px 5px #bdbdbd;

  img {
    object-fit: cover;
    width: 265px;
    height: 265px;
    border-radius: 50%;
    background: transparent;
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
    margin-top: 5px;

    :hover {
      fill: #ff3f3f;
    }
  }

  span {
    margin-top: 15px;
  }
`;

export const AddressContainer = styled.div<{ $isDesktopDisplay: boolean }>`
  display: block;
  flex-direction: column;
  align-items: center;

  width: ${({ $isDesktopDisplay }) => ($isDesktopDisplay ? '50%' : '90%')};
  height: 45%;

  overflow-y: scroll;
`;

export const AddressHeader = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  background-color: #ffffff;
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

  z-index: 1;
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
