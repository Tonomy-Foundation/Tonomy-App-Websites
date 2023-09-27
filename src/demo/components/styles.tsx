import styled from "styled-components";

export const ContainerStyle = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  & p {
    line-height: 30px;
  }
`;

export const PageIntroStyle = styled.div`
  align-items: center;
  text-align: left;
  max-height: 100vh;
  padding: 1rem;
  display: inline;
  flex-direction: column;
  justify-content: center;
  position: relative;
  flex: 1;
  height: 100%;
  & .footer {
    margin-bottom: 2rem;
  },
`;

export const BoxContainer = styled.div`
  text-align: center;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin: 2rem 4rem 0rem;
  border: 1px solid #e4e4e4;
  p {
    text-align: justify;
  }
`;

export const HeaderTonomy = styled.div`
  display: flex;
  width: 1140px;
  height: 180px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: var(--grey-dark-grey, #313938);
  font-size: 220px;
  font-style: normal;
  font-weight: 700;
  line-height: 95px;
  padding-bottom: 60px;
  position: relative;
`;

export const HeaderTonomyID = styled.div`
  display: flex;
  width: 1109px;
  height: 180px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: var(--grey-dark-grey, #313938);
  font-size: 220px;
  font-style: normal;
  line-height: 40px;
  padding-bottom: 60px;
  display: inline;
`;

export const MainDescriptionContainer = styled.div`
  width: 1920px;
  height: 2735px;
`;

export const MainDescription = styled.div`
  display: flex;
  width: 1920px;
  height: 300px;
  flex-direction: column;
  flex-shrink: 0;
  padding: 100px 808px 150px 176px;
  color: var(--grey-dark-grey, #313938);
  font-size: 28px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const MainContainer = styled.div`
  width: 100%;
  flex-shrink: 0;
  background: var(--white-off-white, #f9f9f9);
`;

export const FormHeaderContainer = styled.div`
max-width:: 100%;
margin: 0rem 11rem;
display: flex;
`;

export const FormContainer = styled.div`
  max-width:: 100%;
  flex-shrink: 0;
  border-radius: 10px;
  background: #FFF;
  margin: 1rem 11rem 0px 11rem;
  text-align: center;
  padding: 2rem 0rem;
  margin-top: 1.8rem;
`;

export const FormInput = styled.div`
  width: calc(100% - 100px);
  height: 81px;
  border-radius: 10px;
  outline: none;
  background: #d2f3fa80;
  border: 1px solid #313938;
  margin: 30px auto;
  &:focus-within {
    background: #ffffff;
  }
  input {
    background: #e8f9fc;
    border-radius: 10px;
    height: 100%;
    width: 100%;
    border: none;
    text-align: center;
    padding-right: 300px;
    padding-left: 300px;
  }
  input:focus {
    background: #ffffff;
  }
  div {
    display: inline-grid;
    float: left;
    text-align: left;
    position: absolute;
    margin-left: 40px;
    margin-top: 15px;
  }
  select {
    background: #e8f9fc;
    border-radius: 10px;
    height: 100%;
    width: 100%;
    border: none;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat, repeat;
    background-position: right 0.7em top 71%, 6px 8px;
    background-size: 1.65em auto, 100%;
    text-align: center;
    padding-right: 300px;
    padding-left: 300px;
  }
  select:focus {
    background: #ffffff;
  }
`;

export const TransactionButton = styled.button`
  max-width: 100%;
  height: 75px;
  border-radius: 10px;
  background-color: #67d7ed;
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  border: 1px;
  margin-top: 2rem !important;
  margin: 0 auto;
  padding: 0rem 2rem;
  cursor: pointer;
`;

export const PageFooter = styled.div`
  width: 304px;
  height: 100px;
  margin-left: 138px;
  border-radius: 10px;
  margin-top: 50px;
  font-size: 22px;
  font-weight: 800;
  line-height: 14px;
  letter-spacing: 0.5px;
  text-align: left;
`;

export const CodeSnippetCombo = styled.select`
  width: 304px;
  height: 46px;
  border-radius: 10px;
  background-color: #313938;
  color: white;
  padding: 10px;
`;

export const CircleContainer = styled.div`
  border-radius: 50%;
  background: radial-gradient(
    50% 50% at 50% 50%,
    rgba(103, 203, 222, 0.5) 0%,
    rgba(76, 198, 220, 0.61) 33%,
    rgba(55, 195, 219, 0.7) 56%
  );
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0.005em;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  padding: 2.2rem;
`;
