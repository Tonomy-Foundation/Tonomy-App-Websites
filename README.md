# Tonomy Apps

This repo contains all the following react apps that the Tonomy-Foundation uses:

- Demo website: this app demonstrate the demo flows of the tonomy id. Available at [https://demo.staging.tonomy.foundation](https://demo.staging.tonomy.foundation)
- Accounts website: this website manages the user account and single sign-on system and helps Tonomy ID user to connect to multiple websites. Available at [https://accounts.staging.tonomy.foundation](https://accounts.staging.tonomy.foundation)

## Dependencies

- Linux debian distribution (Ubuntu 20.0.4 LTS used)
- [Nodejs](https://nodejs.org) v18.0.0+ suggested installed with [nvm](https://github.com/nvm-sh/nvm) with corepack enabled. (installing yarn alone is also fine)

## Usage

### `yarn run dev`

Runs the app in development mode

- Demo: <http://demo.localhost:5174>
- Accounts: <http://accounts.localhost:5174>

**the vite app port isn't important**  it will only be used inside the nginx.

### `yarn run build`

builds the apps into `./dist` folder.
Making the apps ready for production.

### `yarn run preview`

test how the apps will look like on production. <br>
this is still experimental and needs some proxy configuration to make it works


## Update the Tonomy-ID-SDK version to the latest

```bash
yarn run updateSdkVersion development
# or
yarn run updateSdkVersion master
```

### `yarn run lint`

shows all the linting errors

### `yarn run lint:fix`

automatically fix all auto-fixable lint errors

## Configuration and environment variables

Set the configuration variables in the desired file in `./src/config`

Config file is choosing based on the value of environment variable `VITE_APP_NODE_ENV`. `config.json` is used by default.

Other environment variables override the values in the config file:

- VITE_BLOCKCHAIN_URL
- VITE_SSO_WEBSITE_ORIGIN
- VITE_COMMUNICATION_URL

## Errors

### Debugging

Uses [debug](https://www.npmjs.com/package/debug) package. Use `export VITE_DEBUG="tonomy*"` to see all debug logs.

### Common errors and how to fix

`Origin not found`

You might be running in stand-alone mode and trying to complete the SSO loin flow. This is not possible stand-alone mode.

**FIX:** Run Tonomy ID using `./app.sh` with the Tonomy ID Integration repository.
