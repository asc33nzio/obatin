import styled from 'styled-components';

export const DashboardPageContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100vw;
  height: 100vh;
`;

export const DashboardPageContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100vw;
  height: inherit;
`;

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 45%;
  height: 60%;
  gap: 10px;
`;

export const ProfileHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 15%;
  padding-left: 25px;
  padding-right: 25px;
  border-bottom: 1px solid #00b5c0;

  h1 {
    color: #00b5c0;
    font-size: 38px;
    background: transparent;
  }
`;

export const ProfileContent = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;

  width: 100%;
  height: 100%;
`;

export const ProfileContentLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  width: 50%;
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

export const ProfileContentRight = styled.div`
  display: flex;
  flex-direction: column;

  width: 50%;
  height: inherit;
  padding-left: 15px;

  h2 {
    color: #4a5568;
    margin-bottom: 5px;
  }
`;

export const UserDetailDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  width: 100%;
  height: 75px;
  padding-right: 15px;
  margin-bottom: 25px;
  color: #a5a5a5;
  font-size: 18px;
  gap: 15px;

  svg {
    cursor: pointer;
    object-fit: cover;
    background: transparent;
    width: 25px;
    height: 25px;
    margin-top: 15px;
  }

  span {
    margin-top: 15px;
  }
`;

export const AddressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 45%;
  height: 40%;
`;

export const AddressHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 15%;
  padding-left: 25px;
  padding-right: 25px;
  border-bottom: 1px solid #00b5c0;

  h1 {
    color: #00b5c0;
    font-size: 38px;
    background: transparent;
  }
`;