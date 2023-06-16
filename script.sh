#!/bin/bash
echo "banch name $VERCEL_GIT_COMMIT_REF"
if [[ $VERCEL_GIT_COMMIT_REF == "main"  ]] ; then 

  echo "This is our main branch"

else 

  echo "This is not our main branch"

fi