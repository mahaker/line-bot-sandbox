# sandbox-typescript

[line-bot-sdk-nodejs](https://github.com/line/line-bot-sdk-nodejs)

## ボットのプロバイダーとチャネルを作成する

1. [LINE Developersへログイン](https://developers.line.biz/ja/?status=success)
2. プロバイダー作成
   https://developers.line.biz/console/register/messaging-api/provider/
   から「新規プロバイダー作成」を選択して「次のページ」をクリック
3. チャネル作成
   アプリ名やアプリ説明は適当に。
   プランは「Developer Trial」を選択（フリープランだとpushができない。）
4. チャネルの設定
   「チャネル基本設定」画面を開く。
   以下の設定を変更する。
   - アクセストークン → 再発行（失効までの時間は0時間でOK）
   - Webhook送信 → 利用する
   - Webhook URL → 「Setup Heroku」で作成するherokuアプリのURL + コントローラのパス
     - 例) https://linebot-typescript.herokuapp.com/webhook
   - 自動応答メッセージ → 利用しない
5. チャネルができたので、「チャネル基本設定」画面にあるQRコードを、LINEアプリで読み込んで友達に追加してください。

## Setup Heroku

Using [heroku-buildpack-monorepo](https://elements.heroku.com/buildpacks/lstoll/heroku-buildpack-monorepo)

``` sh
# Install heroku cli
$ brew install heroku/brew/heroku

# Login to heroku
$ heroku login

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
$ heroku buildpacks:add heroku/nodejs -a [app-name]
$ heroku config:set NPM_CONFIG_PRODUCTION=false -a [app-name]

# Registration git repository
$ heroku git:remote -a [app-name] 
$ git push heroku master
$ heroku logs --tail
```

## Development

``` sh
$ git clone git@github.com:mahaker/line-bot-sandbox.git
$ cd typescript
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
