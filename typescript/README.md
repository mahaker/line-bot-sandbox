# sandbox-typescript

[line-bot-sdk-nodejs](https://github.com/line/line-bot-sdk-nodejs)

## What is this?

睡眠クイズ（全3問）を出してくれるボット

- トークで「クイズ」と話しかけるとクイズスタート
- 回答はリッチメニューの【⭕️】と【❌】で行う。

![screenshot](image/screenshot.gif)

## Set up

Please see [setting.md](./setting.md)

## Create richmenu 

Please see [bot/README.md](./bot/README.md)

## Development

``` sh
$ git clone git@github.com:mahaker/line-bot-sandbox.git
$ cd typescript
$ npm install
$ npm run start 
```

## Deploy

before: [setting.md](./setting.md)

``` sh
$ git add {files}
$ git commit
$ git push heroku master
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
