import styled from 'styled-components';

export const DashboardPageContainer = styled.div<{
  $isDesktopDisplay: boolean;
}>`
  display: flex;
  flex-direction: column;

  height: ${({ $isDesktopDisplay }) => ($isDesktopDisplay ? '135vh' : '200vh')};
  width: 100vw;
  max-width: 100vw;

  overflow-x: hidden;
`;

export const DoctorDashboardPageContainer = styled.div<{
  $isDesktopDisplay: boolean;
}>`
  display: flex;
  flex-direction: column;

  height: ${({ $isDesktopDisplay }) => ($isDesktopDisplay ? '135vh' : '200vh')};
  width: 100vw;
  max-width: 100vw;

  overflow-x: hidden;
`;

export const DashboardPageContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100vw;
  height: 83%;
  overflow-y: hidden;
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

export const DoctorProfileContainer = styled.div<{
  $isDesktopDisplay: boolean;
}>`
  display: flex;
  flex-direction: column;

  width: ${({ $isDesktopDisplay }) => ($isDesktopDisplay ? '50%' : '90%')};
  height: ${({ $isDesktopDisplay }) => ($isDesktopDisplay ? '80%' : '100%')};
  gap: 10px;
  margin-top: -15px;
  margin-bottom: 15px;
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
  padding-bottom: 10px;
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
  button {
    align-items: center;
    padding: 10px;
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
    display: flex;
    align-items: center;
    justify-content: space-between;

    font-size: 16px;
    color: #4a5568;
    margin-bottom: 5px;

    span {
      font-size: 16px;
      color: #4a5568;
      margin-bottom: 5px;
      font-weight: 500;
    }
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

export const DoctorProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 20%;
`;

export const ContentSubcontainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 50%;
  height: 100%;

  p {
    font-size: 24px;
    text-align: center;
    color: #00b5c0;
    width: 100%;
    height: 50%;

    u {
      cursor: pointer;
      font-size: 24px;
      color: #00b5c0;
      font-weight: 500;
    }
  }
`;

export const AltDetailDiv = styled.div`
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

  p {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const ClockDiv = styled.section`
  display: flex;
  align-items: center;
  width: 100%;

  svg {
    stroke: #00b5c0;

    :hover {
      fill: aqua;
    }
  }
`;

export const RadioInputGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 50px;
  gap: 10px;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    height: 100%;
    width: 60px;
    font-size: 16px;
  }
`;
