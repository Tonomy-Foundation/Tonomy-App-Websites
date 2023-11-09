import MobileScreen from "../assets/Group_567_1.png";
import {
  MainContainer,
  TransactionButton,
  CircleContainer,
} from "../components/styles";
import { Box } from "@mui/material";
import { TH4 } from "../../common/atoms/THeadings";

export type SuccessSectionProps = {
  labels: Array<string>;
  message: string;
  url?: string | undefined;
  submit?: () => void;
};

const SuccessSection = (props: SuccessSectionProps) => {
  return (
    <MainContainer>
      <Box
        sx={{
          pt: 2,
          pb: 10,
        }}
      >
        <TH4 className="successfully-signed">Congratulations</TH4>
        <TH4 className="successfully-signed">{props.message}</TH4>
      </Box>
      <CircleContainer className="circle-insurance-claims">
        {props.labels[0]}
      </CircleContainer>
      <CircleContainer className="circle-shipping-logistic-events">
        {props.labels[1]}
      </CircleContainer>
      <CircleContainer className="Circle-games">
        {props.labels[2]}
      </CircleContainer>
      <CircleContainer className="circle-ntfs">
        {props.labels[3]}
      </CircleContainer>
      <CircleContainer className="circle-accounting-and-defi">
        {props.labels[4]}
      </CircleContainer>
      <CircleContainer className="circle-votes">
        {props.labels[5]}
      </CircleContainer>

      <Box sx={{ display: "grid", mt: 5 }}>
        <img src={MobileScreen} alt="mobile-screen" className="mobile-screen" />
        <TransactionButton onClick={props.submit}>
          TRY SIGNING A DOCUMENT AGAIN
        </TransactionButton>
        {props.url && (
          <TH4 className="set-blockchain">
            See it on the blockchain{" "}
            <a target="_blank" href={props.url} rel="noreferrer">
              here
            </a>
          </TH4>
        )}
      </Box>
    </MainContainer>
  );
};

export default SuccessSection;
