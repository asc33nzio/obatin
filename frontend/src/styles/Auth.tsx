import styled from 'styled-components';

export const AuthPagesContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100vh;

  svg {
    width: 50%;
  }

  background-color: red;
`;

export const AuthRightSubcontainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 50%;
  height: 100%;
`;

export const LoginFormContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 75%;
  height: 90%;

  h1 {
    font-size: 48px;
    color: #00b5c0;

    margin-top: 100px;
    margin-bottom: 20px;
  }
`;

export const CreateOrLoginSpan = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;

  width: 100%;
  height: 35px;

  background-color: green;
  gap: 10px;
  font-size: 18px;
  color: #718096;
  margin-bottom: 25px;

  u {
    color: #00b5c0;
    cursor: pointer;
  }
`;
