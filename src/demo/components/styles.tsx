import styled from "styled-components";

export const ContainerStyle = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(115.56deg, #c1eef8 44.33%, #67d7ed 89.31%);

  & p {
    line-height: 30px;
  }
`;

export const PageIntroStyle = styled.div`
  align-items: center;
  text-align: left;
  max-height: 100vh;
  overflow: auto;
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
}`;

export const BoxContainer = styled.div`
  text-align: center;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin: 2rem 4rem 0rem;
  border: 1px solid #E4E4E4;
  p {
    text-align: justify;
  }

}`;
