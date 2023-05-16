import React from "react";
import { TButton } from "../atoms/TButton";
import { Box, Modal } from "@mui/material";
import TIcon from "../atoms/TIcon";

export type ModalProps = React.ComponentProps<typeof Modal> & {
  onPress: () => void;
  icon: string;
  iconColor?:
  | "inherit"
  | "action"
  | "disabled"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";
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
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 1,
    padding: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
};

export default function TModal(props: ModalProps) {
  return (
    <Modal open={props.open} onClose={props.onPress}>
      <Box sx={styles.modal}>
        <Box sx={styles.modalContent}>
          <div style={{ textAlign: "center" }}>
            <TIcon color={props.iconColor} icon={props.icon} />
            <div style={styles.title}>{props.title}</div>
            {props.children}
            <div
              style={{
                marginTop: 16,
                textAlign: "right",
              }}
            >
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
