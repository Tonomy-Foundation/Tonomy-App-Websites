import styled from "styled-components";

export const ContainerStyle = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  background: linear-gradient(
    115.56deg,
    var(--main-light-gradient) 44.33%,
    var(--main-blue-gradient) 89.31%
  );
`;

export const HeaderTonomy = styled.div`
  display: flex;
  width: 1140px;
  height: 180px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: var(--gray-900, #313938);
  font-size: 220px;
  font-style: normal;
  font-weight: 500;
  line-height: 95px;
  position: relative;
  padding-bottom: 60px;
`;

export const HeaderTonomySmall = styled.div`
  display: flex;
  width: 1500px;
  height: 180px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: var(--gray-900, #313938);
  font-size: 120px;
  font-style: normal;
  font-weight: 500;
  line-height: 95px;
  position: relative;
  padding-bottom: 60px;
`;

export const MainContainer = styled.div`
  width: 100%;
  flex-shrink: 0;
  background: var(--white-off-white, #f9f9f9);
  @media only screen and (max-width: 767px) {
    background: var(--gray-50);
  }
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
  @media only screen and (max-width: 767px) {
    margin: 1rem;

  }
`;

export const TransactionButton = styled.button`
  max-width: 100%;
  height: 65px;
  border-radius: 10px;
  background-color: var(--primary);
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  border: 1px;
  margin-top: 2rem !important;
  margin: 0 auto;
  padding: 0rem 1.7rem;
  cursor: pointer;
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
