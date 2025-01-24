#!/bin/bash

# Initialize variables
directoryPath="public/.well-known"
filePath="$directoryPath/apple-app-site-association"
tonomyAppId=""
branch=${1-default}

# Function to log errors and exit
log_error_and_exit() {
  echo "Error: $1"
  exit 1
}


# Determine appId based on the branch
case $branch in
  master)
    appId="united-wallet"
    ;;
  testnet)
    appId="pangea-testnet"
    ;;
  development)
    appId="tonomy-id-staging"
    ;;
  *)
    appId="tonomy-id-development"
    ;;
esac

# Construct the appID for the JSON object
tonomyAppId="6BLD42QR78.foundation.tonomy.projects.$appId"
echo "App ID: $tonomyAppId"

# Create the JSON object as a string
appleAppSiteAssociation=$(cat <<EOF
{
  "applinks": {
    "details": [
      {
        "appIDs": ["$tonomyAppId"],
        "paths": ["/login/*"]
      }
    ]
  }
}
EOF
)

# Ensure the directory exists
if [ ! -d "$directoryPath" ]; then
  mkdir -p "$directoryPath" || log_error_and_exit "Failed to create directory: $directoryPath"
  echo "Directory created: $directoryPath"
fi

# Write the JSON object to the file
echo "$appleAppSiteAssociation" > "$filePath" || log_error_and_exit "Failed to write to file: $filePath"
echo "File written successfully to $filePath"
