import React, { ReactNode, useState } from "react";
import TModal from "./TModal";
import { TButton } from "../atoms/TButton";
import { TP } from "../atoms/THeadings";
import {
  HttpError,
  EosioUtil,
  CommunicationError,
  AntelopePushTransactionError,
} from "@tonomy/tonomy-id-sdk";
import { Modal } from "@mui/material";

export type TErrorModalProps = Omit<
  React.ComponentProps<typeof Modal> & {
    onPress: () => void;
    title?: string;
    icon: string;
    error?: Error;
    expected?: boolean;
    open?: boolean;
    code?: number;
    cause?: string;
  },
  "children"
>;

export default function TErrorModal(props: TErrorModalProps) {
  const [expanded, setExpanded] = useState(false);

  function switchExpanded() {
    setExpanded((expanded) => !expanded);
  }

  if (props?.expected === false) {
    console.error(props.error);
    console.log(JSON.stringify(props.error, null, 2), props.expected);
    // TODO: log to Tonomy Foundation team
  }

  function isExpandableErrorType() {
    return (
      props?.error instanceof HttpError ||
      props?.error instanceof CommunicationError ||
      props?.error instanceof EosioUtil.AntelopePushTransactionError
    );
  }

  function isExpandable() {
    return isExpandableErrorType() || props?.code || props?.cause;
  }

  function ErrorDetails() {
    if (props.error instanceof HttpError) {
      const error = props.error as HttpError;

      return (
        <div>
          <TP size={2}>Http error:</TP>
          {error.code && (
            <div style={styles.greyText}>HTTP Code: {error.code}</div>
          )}
          <div>Path: {error.path}</div>
          <div>Response: {JSON.stringify(error.response, null, 2)}</div>
          <div>SourceUrl: {error.sourceURL}</div>
        </div>
      );
    } else if (props.error instanceof AntelopePushTransactionError) {
      const error = props.error as AntelopePushTransactionError;
      const trxError = error.error;

      return (
        <div>
          <TP size={2}>Trx error:</TP>
          <div style={styles.greyText}>
            {error.code && <div>HTTP Code: {error.code}</div>}
            <div>Antelope Code: {trxError.code}</div>
            <div>Name: {trxError.name}</div>
            <div>What: {trxError.what}</div>
            <div>Details: {JSON.stringify(trxError.details, null, 2)}</div>
          </div>
        </div>
      );
    } else if (props.error instanceof CommunicationError) {
      const exception = (props.error as CommunicationError).exception;

      return (
        <div>
          <TP size={2}>Communication error:</TP>
          <div style={styles.greyText}>
            <div>Message: {exception.message}</div>
            <div>Status: {exception.status}</div>
            <div>Name: {exception.name}</div>
          </div>
        </div>
      );
    }

    throw new Error("Unexpected error type");
  }

  return (
    <TModal
      open={props.open}
      onPress={props.onPress}
      icon={props.icon}
      iconColor="error"
      title={props.title ?? "Something went wrong"}
      buttonLabel="Close"
    >
      <>
        {/* {props.children} */}
        {props.error && (
          <>
            <div>
              <TP size={2}>{props.error.message}</TP>
            </div>

            {props?.expected === false && (
              <div>The Tonomy Foundation has been notified</div>
            )}

            {isExpandable() && (
              <>
                {expanded && (
                  <>
                    <ErrorDetails />
                  </>
                )}
                <div>
                  <TButton onClick={switchExpanded}>
                    {expanded ? "Hide Error" : "Show Error"}
                  </TButton>
                </div>
              </>
            )}
          </>
        )}
      </>
    </TModal>
  );
}

const styles = {
  boldText: {
    fontWeight: "bold",
  },
  greyText: {
    color: "#888",
  },
};
