import styled from 'styled-components';

export const LoginOrRegisterFormContainer = styled.div<{
  $isLoginPage: boolean;
}>`
  display: flex;
  flex-direction: column;

  width: 75%;
  height: 90%;

  h1 {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 15%;
    font-size: 48px;
    color: #00b5c0;

    margin-top: ${({ $isLoginPage }) => ($isLoginPage ? '25px' : 0)};
    margin-bottom: ${({ $isLoginPage }) => ($isLoginPage ? '5px' : 0)};
  }
`;

export const UserTypeSelectionSection = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 200px;

  margin-bottom: 20px;
`;

export const SelectUserTypeBox = styled.div<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 47.5%;
  height: 100%;
  padding: 10px;
  gap: 10px;

  font-size: 24px;
  font-weight: 500;
  color: #00b5c0;

  border: ${({ $isActive }) => ($isActive ? '2px solid #00b5c0' : 'none')};
  border-radius: 25px;
  background-color: #f7fafc;
  cursor: pointer;

  svg {
    display: flex;
    object-fit: cover;
    width: 125px;
    height: 125px;
    border-radius: 50%;
    background: transparent;
  }
`;

export const CreateOrLoginSpan = styled.span<{ $marBot: number }>`
  display: flex;
  flex-direction: row;
  align-items: center;

  width: 100%;
  height: 35px;

  gap: 10px;
  font-size: 18px;
  color: #718096;
  margin-bottom: ${({ $marBot }) => `${$marBot}px`};

  u {
    color: #00b5c0;
    cursor: pointer;
  }
`;

export const RememberAndForgetDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 35px;
  margin-bottom: 25px;

  u {
    cursor: pointer;
    color: #00b5c0;
    font-size: 18px;
  }
`;

export const RememberMeDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  width: 200px;
  height: 100%;
  gap: 10px;

  color: #718096;
  font-size: 18px;

  input {
    cursor: pointer;
  }
`;

export const SectionSeparator = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 35px;
  margin-top: 5px;
  margin-bottom: 5px;
  gap: 15px;

  color: #a0aec0;
  font-size: 18px;
`;

export const OAuthDiv = styled.div<{ $isDesktopDisplay: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;

  cursor: pointer;
  width: 100%;
  height: 55px;
  padding-left: 25px;

  border: 1px solid #cbd5e0;
  border-radius: 50px;
  gap: 25px;

  svg {
    display: flex;
    width: 50px;
    height: 95%;
  }

  p {
    width: 100%;
    background-color: transparent;

    text-align: center;
    font-size: ${({ $isDesktopDisplay }) =>
      $isDesktopDisplay ? '24px' : '20px'};
    color: #67728a;

    text-overflow: ellipsis;
  }
`;

export const SeparatorLine = styled.div`
  display: inline-block;
  width: 100%;
  height: 1px;
  background-color: #a0aec0;
`;

export const ReturnHomeContainerDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 50px;
  margin-top: 35px;

  span {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    height: 100%;
    width: 50%;
    gap: 15px;
    background: transparent;
    color: #718096;
    font-size: 18px;
    font-weight: 600;

    svg {
      cursor: pointer;
      object-fit: cover;
      background: transparent;
      width: 35px;
      height: 35px;

      path {
        stroke: #718096;
      }
    }
  }
`;

export const LoaderDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 55px;
`;
