#!/bin/bash

echo "banch name $VERCEL_GIT_COMMIT_REF"
if [[ $VERCEL_GIT_COMMIT_REF != "master"  ]] ; then 
  echo "execution start"
  yarn add @tonomy/tonomy-id-sdk@development
  echo "execution end"
else 
  echo "This is not our main branch"
fi
