#!/bin/bash

# requirements
# チャネルアクセストークン
# jq

while getopts ":a:i:" OPT ; do
  if [ $OPT = 'a' ]; then
    CHANNEL_ACCESS_TOKEN=$OPTARG
  elif [ $OPT = 'i' ]; then
    IMAGE_PATH=$OPTARG
  else
    echo "無効なオプションです。"
    echo 'usage: ./create-richmenu.sh -a {channel access token} -i {/path/to/image.jpg}'
    exit 1
  fi
done

# デフォルトリッチメニューの取得
DEFAULT_RICHMENU_ID=`curl -s -X GET https://api.line.me/v2/bot/user/all/richmenu -H "Authorization: Bearer $CHANNEL_ACCESS_TOKEN" | jq -r ".richMenuId"`
if [ "$DEFAULT_RICHMENU_ID" != 'null' ]; then
  # デフォルトリッチメニューの解除
  curl -s -X DELETE https://api.line.me/v2/bot/user/all/richmenu -H "Authorization: Bearer $CHANNEL_ACCESS_TOKEN"
fi

# TODO リッチメニューとユーザーのリンク

# リッチメニューの作成
NEW_RICHMENU_ID=`curl -v -X POST https://api.line.me/v2/bot/richmenu \
-H "Authorization: Bearer $CHANNEL_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d \
'{
  "size": {
    "width": 2500,
    "height": 1686
  },
  "selected": true,
  "name": "リッチメニュー 1",
  "chatBarText": "お知らせ",
  "areas": [
    {
      "bounds": {
        "x": 2,
        "y": 4,
        "width": 1316,
        "height": 1118
      },
      "action": {
        "type": "postback",
        "displayText": "まる",
        "data": "{\"cmd\": \"answer\", \"answer\": true}"
      }
    },
    {
      "bounds": {
        "x": 1320,
        "y": 4,
        "width": 1174,
        "height": 1116
      },
      "action": {
        "type": "postback",
        "displayText": "ばつ",
        "data": "{\"cmd\": \"answer\", \"answer\": false}"
      }
    },
    {
      "bounds": {
        "x": 4,
        "y": 1127,
        "width": 812,
        "height": 559
      },
      "action": {
        "type": "postback",
        "displayText": "はじめから",
        "data": "{\"cmd\": \"ctrl\", \"action\": \"restart\"}"
      }
    },
    {
      "bounds": {
        "x": 818,
        "y": 1125,
        "width": 915,
        "height": 559
      },
      "action": {
        "type": "postback",
        "displayText": "くわしく見る",
        "data": "{\"cmd\": \"ctrl\", \"action\": \"detail\"}"
      }
    },
    {
      "bounds": {
        "x": 1735,
        "y": 1120,
        "width": 765,
        "height": 566
      },
      "action": {
        "type": "postback",
        "displayText": "次のクイズ",
        "data": "{\"cmd\": \"ctrl\", \"action\": \"next\"}"
      }
    }
  ]
}' | jq -r ".richMenuId"`

# リッチメニューに画像を設定
curl -v -X POST https://api.line.me/v2/bot/richmenu/{richMenuId}/content \
-H "Authorization: Bearer $CHANNEL_ACCESS_TOKEN" \
-H "Content-Type: image/jpeg" \
-T $IMAGE_PATH 

# ボットとリッチメニューを関連づけ
# useridはボットの「チャネル基本設定」画面の最下部にある。
# curl -v -X POST https://api.line.me/v2/bot/user/{userId}/richmenu/{richMenuId} \
# -H "Authorization: Bearer {channel access token}"
