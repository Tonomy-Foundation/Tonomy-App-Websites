import React from "react";
import { TButton } from "../atoms/TButton";
import { Box, Modal } from "@mui/material";
import TIcon from "../atoms/TIcon";

/**
 * @property {function} onPress - function to be called when the modal is closed
 * @property {string} icon - icon to be displayed from https://fonts.google.com/icons
 * @property {string} iconColor - color of the icon from the theme
 * @property {string} title - title of the modal
 * @property {string} buttonLabel - label of the close button
 * @property {boolean} open - whether the modal is open or not
 */
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
};

export default function TModal(props: ModalProps) {
  return (
    <Modal open={props.open} onClose={props.onPress}>
      <Box sx={styles.modal} className="mobile-error-handler">
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
