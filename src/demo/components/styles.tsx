import styled from "styled-components";

export const ContainerStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
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

export const HeaderContainer = styled.div`
  width: 100%;
  height: 1080px;
  background: linear-gradient(115.56deg, #C1EEF8 44.33%, #67D7ED 89.31%);
  padding: 32px 32px 10px 158px;
}`;

export const HeaderDescription = styled.div`
  display: flex;
  width: 783px;
  height: 290px;
  flex-direction: column;
  flex-shrink: 0;x;
  color: var(--grey-dark-grey, #313938);
  font-size: 32px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}`;

export const FeatureNameLabel = styled.p`
  color: var(--grey-dark-grey, #313938);
  font-size: 40px;
  font-style: normal;
  font-weight: 500;
  line-height: 14px;
  letter-spacing: 0.5px;
}`;

export const HowToUseLabe = styled.p`
  color: var(--grey-dark-grey, #313938);
  font-size: 64px;
  font-style: normal;
  font-weight: 500;
  line-height: 40px;
  padding-top: 300px;
  padding-left: 140px;
}`;

export const HeaderTonomy = styled.div`
  display: flex;
  width: 1109px;
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
}`;

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
}`;

export const MainDescriptionContainer = styled.div`
  width: 1920px;
  height: 2735px;
}`;

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
}`;

export const MainContainer = styled.div`
  width: 100%;
  height: 1185px;
  flex-shrink: 0;
  background: var(--white-off-white, #F9F9F9);
}`;

export const BalanceContainer = styled.div`
  width: 700px;
  height: 124px;
  flex-shrink: 0;
  margin-top: 80px;
  margin-left: 181px;
  border-radius: 10px;
  background: linear-gradient(180deg, #E8F8FC 0%, #67D7ED 100%);
  display: inline-block;
}`;

export const BalanceContainerTest = styled.p`
  color: var(--grey-dark-grey, #313938);
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 40px;
  margin-top: 42px;
  margin-left: 31px;
}`;

export const FormContainer = styled.div`
  max-width:: 100%;
  height: 679px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #FFF;
  margin: 30px 181px 0px 181px;
}`;
