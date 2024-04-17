import styled from 'styled-components';

export const LoginOrRegisterFormContainer = styled.div<{
  $isLoginPage: boolean;
}>`
  display: flex;
  flex-direction: column;

  width: 75%;
  height: 90%;

  h1 {
    font-size: 48px;
    color: #00b5c0;

    margin-top: ${({ $isLoginPage }) => ($isLoginPage ? '100px' : 0)};
    margin-bottom: 20px;
  }
`;

export const UserTypeSelectionSection = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 300px;

  margin-bottom: 20px;
`;

export const SelectUserTypeBox = styled.div<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 48%;
  height: 100%;
  padding: 10px;
  gap: 10px;

  font-size: 26px;
  color: #00b5c0;

  border: ${({ $isActive }) => ($isActive ? '2px solid #00b5c0' : 'none')};
  border-radius: 25px;
  background-color: #f7fafc;
  cursor: pointer;

  svg {
    object-fit: cover;
    width: 150px;
    height: 150px;
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
  margin-top: 25px;
  margin-bottom: 25px;
  gap: 15px;

  color: #a0aec0;
  font-size: 18px;
`;

export const OAuthDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  cursor: pointer;
  width: 100%;
  height: 75px;
  padding-left: 25px;

  border: 1px solid #cbd5e0;
  border-radius: 50px;
  gap: 25px;

  svg {
    width: 50px;
    height: 95%;
  }

  p {
    width: 100%;
    background-color: transparent;

    text-align: center;
    font-size: 24px;
    color: #67728a;
  }
`;

export const SeparatorLine = styled.div`
  display: inline-block;
  width: 100%;
  height: 1px;
  background-color: #a0aec0;
`;
