import React from "react";
import { TButton } from "../atoms/TButton";
import { Box, Modal } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

export type ModalProps = React.ComponentProps<typeof Modal> & {
  onPress: () => void;
  icon: string;
  iconColor?: string;
  title: string;
  buttonLabel?: string;
  open: boolean;
  enableLinkButton?: boolean;
  linkButtonText?: string;
  linkOnPress?: () => void;
};

const styles = {
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 50,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 1,
    padding: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  buttonView: {
    marginTop: 16,
    textAlign: "right",
  },
};

export default function TModal(props: ModalProps) {
  return (
    <Modal
      open={props.open}
      onClose={props.onPress}
    >
      <Box sx={styles.modal}>
        <Box sx={styles.modalContent}>
          <div style={{ textAlign: "center" }}>
            <div>
              <DeleteIcon />
            </div>
            <div style={styles.title}>{props.title}</div>
            {props.children}
            <div style={styles.buttonView}>
              <TButton onClick={props.onPress}>
                {props.buttonLabel ?? "OK"}
              </TButton>
            </div>
          </div>
        </Box>
      </Box>
    </Modal>
  );

}
