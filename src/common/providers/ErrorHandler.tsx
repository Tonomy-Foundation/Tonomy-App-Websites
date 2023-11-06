import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import useErrorStore from "../stores/errorStore";
import TErrorModal from "../molecules/TErrorModal";

export default function ErrorHandlerProvider() {
  const [showModal, setShowModal] = useState(false);

  const errorStore = useErrorStore();

  async function onModalPress() {
    const onClose = errorRef.current.onClose;

    errorStore.unSetError();
    if (onClose) await onClose();
    setShowModal(false);
  }

  // gets the initial value of the error state
  const errorRef = useRef(useErrorStore.getState());

  useEffect(
    () =>
      // subscribe to errorStore changes to update the modal
      // using the `errorStore` variable does not work as changes do not force a re-render
      useErrorStore.subscribe((state) => {
        errorRef.current.error = state.error;
        errorRef.current.title = state.title;
        errorRef.current.expected = state.expected;
        errorRef.current.onClose = state.onClose;

        if (state.error) {
          setShowModal(true);
        }
      }),
    []
  );

  return (
    <TErrorModal
      open={showModal}
      onPress={onModalPress}
      icon="error"
      error={errorRef.current.error}
      title={errorRef.current.title ?? "Something went wrong"}
      expected={errorRef.current.expected}
    />
  );
}
