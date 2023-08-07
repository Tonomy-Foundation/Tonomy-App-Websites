# Tonomy Apps

This repo contains all the following react apps that the Tonomy-Foundation uses:

- Demo website: this app demonstrate the demo flows of the tonomy id. Available at [https://demo.staging.tonomy.foundation](https://demo.staging.tonomy.foundation)
- Accounts website: this website manages the user SSO system and helps Tonomy ID user to connect to multiple websites. Available at [https://accounts.staging.tonomy.foundation](https://accounts.staging.tonomy.foundation)
<!-- - App Manager Website: developers portal to get Oauth access -->

## Dependencies

- Linux debian distribution (Ubuntu 20.0.4 LTS used)
- [Nodejs](https://nodejs.org) v18.0.0+ suggested installed with [nvm](https://github.com/nvm-sh/nvm) with corepack enabled. (installing yarn alone is also fine)

Extra dependencies for `yarn run local`

- [docker](https://www.docker.com/) v20.10.16+
- [docker-compose](https://docs.docker.com/compose/) v1.29.2+

## Usage

### `yarn run dev`

Runs the app in development mode

- Demo: <http://demo.localhost:5174>
- Accounts: <http://accounts.localhost:5174>

### `yarn run local`

Runs the app in development mode and uses nginx to route the port to the respective app

- Demo: <http://localhost:3001>
- Accounts: <http://localhost:3000>

**the vite app port isn't important**  it will only be used inside the nginx.

### `yarn add @tonomy/tonomy-id-sdk@development`

this install the tonomy-id-sdk with development tag

### `yarn run build`

builds the apps into `./dist` folder.
Making the apps ready for production.

### `yarn run preview`

test how the apps will look like on production. <br>
this is still experimental and needs some proxy configuration to make it works

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
