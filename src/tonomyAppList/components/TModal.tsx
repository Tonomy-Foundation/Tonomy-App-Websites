import React from "react";
import { Box, Modal, Button, Typography, ButtonBase } from "@mui/material";
import IconClose from "../assets/icon-close.png";
import TImage from "../../common/atoms/TImage";

export type ModalProps = React.ComponentProps<typeof Modal> & {
  onCancel: () => void;
  onConfirm: () => void;
  image: string;
  imageAlt?: string;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  open: boolean;
};

const styles = {
  overlay: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    height: "100vh",
    width: "100vw",
    position: "fixed" as const,
    top: 0,
    left: 0,
    zIndex: 1300,
    padding: "16px",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    width: "100%",
    maxWidth: 560,
    height: 345,
    padding: "25px 50px",
    textAlign: "center" as const,
    boxShadow: "0px 4px 16px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
    position: "relative" as const, // Added for proper positioning
  },
  closeButton: {
    position: "absolute" as const,
    top: "16px",
    right: "16px",
    padding: "4px",
    minWidth: "auto",
  },
  imageWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "25px",
    marginBottom: "16px",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "80px",
    objectFit: "contain" as const,
  },
  title: {
    fontSize: "24px",
    fontWeight: 600,
    marginBottom: "6px",
  },
  description: {
    fontSize: "17px",
    marginBottom: "35px",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    marginTop: "auto",
    marginBottom: "30px",
    padding: "0px 5rem",
  },
};

export default function TModal({
  open,
  onCancel,
  onConfirm,
  image,
  imageAlt = "",
  title,
  description,
  confirmLabel = "Confirm Swap",
  cancelLabel ,
}: ModalProps) {
  return (
    <Modal open={open} onClose={onCancel}>
      <Box sx={styles.overlay}>
        <Box sx={styles.modalBox}>
          {/* Close button positioned absolutely at top-left */}
          <ButtonBase 
            onClick={onCancel}
            sx={styles.closeButton}
          >
            <TImage
              height={20}
              width={20}
              src={IconClose}
              alt="Close icon"
            />
          </ButtonBase>
          
          <div>
            <div style={styles.imageWrapper}>
              <img 
                src={image} 
                alt={imageAlt} 
                style={styles.image}
              />
            </div>
            <Typography sx={styles.title}>{title}</Typography>
            {description && (
              <Typography sx={styles.description}>{description}</Typography>
            )}
          </div>

          <div style={styles.buttonRow}>{
            cancelLabel && <Button
              variant="outlined"
              onClick={onCancel}
              sx={{
                flex: "0 0 35%",
                borderRadius: "8px",
                padding: "10px",
                fontSize: "16px",
                fontWeight: 600,
                borderColor: "transparent",
                backgroundColor: "#EDF2F9",
                color: "var(--black)",
                "&:hover": { backgroundColor: "#EDF2F9",  borderColor: "transparent", color: "var(--black)"},
              }}
            >
              {cancelLabel}
            </Button>}
            

            <Button
              variant="contained"
              onClick={onConfirm}
              sx={{
                flex: "1",
                backgroundColor: "var(--primary)",
                "&:hover": { backgroundColor: "#6A46D1" },
                borderRadius: "8px",
                padding: "10px",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </Box>
      </Box>
    </Modal>
  );
}