#!/bin/bash

echo "banch name $VERCEL_GIT_COMMIT_REF"
if [[ $VERCEL_GIT_COMMIT_REF != "master"  ]] ; then 
  echo "execution start"
  yarn add @tonomy/tonomy-id-sdk@development
  echo "execution end"
  exit 0
else 
  echo "This is not our main branch"
  exit 1
fi
