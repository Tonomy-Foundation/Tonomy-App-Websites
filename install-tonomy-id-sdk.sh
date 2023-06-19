#!/bin/bash

echo "Branch name: $VERCEL_GIT_COMMIT_REF"

if [[ $VERCEL_GIT_COMMIT_REF != "master" ]]; then 
  echo "Execution start"
  echo "Installing @tonomy/tonomy-id-sdk@development..."

  if yarn add @tonomy/tonomy-id-sdk@development; then
    echo "Package installation completed."
    echo "Execution end"
    exit 0  # Exit with a success code
  else
    echo "Error: Package installation failed."
    exit 1  # Exit with an error code
  fi
else 
  echo "This is not our main branch"
  exit 0  # Exit with a success code
fi