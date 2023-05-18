import styled from "styled-components";

export const ContainerStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  align-items: center;

  & p {
    line-height: 30px;
    max-width: 900px;
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
    max-width: 600px;
    text-align: justify;
  }

}`;
