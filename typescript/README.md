# sandbox-typescript

[line-bot-sdk-nodejs](https://github.com/line/line-bot-sdk-nodejs)

## Setup Heroku

Using [heroku-buildpack-monorepo](https://elements.heroku.com/buildpacks/lstoll/heroku-buildpack-monorepo)

``` sh
# Install heroku cli
$ brew install heroku/brew/heroku

# Create app
$ git clone git@github.com:mahaker/line-bot-sandbox.git
$ cd typescript && heroku create [app-name]

# Add heroku-buildpack-monorepo and settings
$ heroku buildpacks:add -a [app-name] https://github.com/lstoll/heroku-buildpack-monorepo
$ heroku config:set APP_BASE=typescript -a [app-name]

# Add LINE Bot credentials
$ heroku config:set LINE_CHANNEL_ACCESS_TOKEN=[Your ChannelAccessToken] -a [app-name]
$ heroku config:set LINE_CHANNEL_SECRET=[Your ChannelSecret] -a [app-name]

# Add heroku/nodejs buildpack
$ heroku buildpacks:add heroku/nodejs

# Registration git repository
$ heroku git:remote -a [app-name] 
$ git push heroku master
```

## Development

``` sh
$ git clone git@github.com:mahaker/line-bot-sandbox.git
$ cd sandbox-typescript
$ npm install
$ npm run start 
```

## Build

``` sh
$ npm run build
```

## Unit Test 

``` sh
$ npm run test 
```

## Lint 

``` sh
$ npm run lint 
```
