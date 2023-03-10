# Tonomy Apps

This repo contains all the following react apps that the Tonomy-Foundation uses:

- Demo website: this app demonstrate the demo flows of the tonomy id
- SSO website: this website manages the user SSO system and helps tonomy Id user to connect to multiple websites.
<!-- - App Manager Website: developers portal to get Oauth access -->

## Dependencies

- Linux debian distribution (Ubuntu 20.0.4 LTS used)
- [Nodejs](https://nodejs.org) v18.0.0+ suggested installed with [nvm](https://github.com/nvm-sh/nvm) with corepack enabled. (installing yarn alone is also fine)
- [docker](https://www.docker.com/) v20.10.16+
- [docker-compose](https://docs.docker.com/compose/) v1.29.2+

## Usage

### `yarn local`

runs the app in development mode. Uses nginx to route the port to the correct app

- demo port: 3001
- SSO port: 3000

**the vite app port isn't important**  it will only be used inside the nginx.

### `yarn build`

builds the apps into `./dist` folder.
Making the apps ready for production.

### `yarn preview`

test how the apps will look like on production. <br>
this is still experimental and needs some proxy configuration to make it works

### `yarn lint`

shows all the linting errors

### `yarn lint:fix`

automatically fix all auto-fixable lint errors

## Configuration and environment variables

Set the configuration variables in the desired file in `./src/config`

Config file is choosing based on the value of environment variable `NODE_ENV`. `config.json` is used by default.

Other environment variables override the values in the config file:

- VITE_BLOCKCHAIN_URL
- VITE_SSO_WEBSITE_ORIGIN
- VITE_COMMUNICATION_URL
