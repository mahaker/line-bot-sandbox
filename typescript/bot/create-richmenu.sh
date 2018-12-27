#!/bin/bash

# requirements
# チャネルアクセストークン
# jq

while getopts ":a:i:u:" OPT ; do
  if [ $OPT = 'a' ]; then
    CHANNEL_ACCESS_TOKEN=$OPTARG
  elif [ $OPT = 'i' ]; then
    IMAGE_PATH=$OPTARG
  elif [ $OPT = 'u' ]; then
    USER_ID=$OPTARG
  else
    echo "無効なオプションです。"
    echo 'usage: ./create-richmenu.sh -u {userid} -a {channel access token} -i {/path/to/image.jpg}'
    exit 1
  fi
done

# デフォルトリッチメニューの取得
echo 'デフォルトリッチメニューの取得'
DEFAULT_RICHMENU_ID=`curl -s -X GET https://api.line.me/v2/bot/user/all/richmenu -H "Authorization: Bearer $CHANNEL_ACCESS_TOKEN" | jq -r ".richMenuId"`
if [ "$DEFAULT_RICHMENU_ID" != 'null' ]; then
  # デフォルトリッチメニューの解除
  echo 'デフォルトリッチメニューの解除'
  curl -s -X DELETE https://api.line.me/v2/bot/user/all/richmenu -H "Authorization: Bearer $CHANNEL_ACCESS_TOKEN"
fi

# リッチメニューの作成
# -d オプションにリッチメニューのJSONを貼り付けてください。
# Bot Desiner(https://developers.line.biz/ja/services/bot-designer/)を使うと、JSONを簡単に生成できて便利
echo 'リッチメニューの作成'
NEW_RICHMENU_ID=`curl -s -X POST https://api.line.me/v2/bot/richmenu \
-H "Authorization: Bearer $CHANNEL_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d \
'{
  "size": {
    "width": 2500,
    "height": 843
  },
  "selected": true,
  "name": "リッチメニュー 1",
  "chatBarText": "クイズコントロール",
  "areas": [
    {
      "bounds": {
        "x": 2,
        "y": 4,
        "width": 1316,
        "height": 557
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
        "height": 555
      },
      "action": {
        "type": "postback",
        "displayText": "ばつ",
        "data": "{\"cmd\": \"answer\", \"answer\": false}"
      }
    },
    {
      "bounds": {
        "x": 0,
        "y": 564,
        "width": 827,
        "height": 279
      },
      "action": {
        "type": "postback",
        "displayText": "はじめから",
        "data": "{\"cmd\": \"ctrl\", \"action\": \"restart\"}"
      }
    },
    {
      "bounds": {
        "x": 829,
        "y": 561,
        "width": 900,
        "height": 282
      },
      "action": {
        "type": "postback",
        "displayText": "くわしく見る",
        "data": "{\"cmd\": \"ctrl\", \"action\": \"detail\"}"
      }
    },
    {
      "bounds": {
        "x": 1731,
        "y": 562,
        "width": 769,
        "height": 281
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
echo 'リッチメニューに画像を設定'
curl -s -X POST "https://api.line.me/v2/bot/richmenu/$NEW_RICHMENU_ID/content" \
-H "Authorization: Bearer $CHANNEL_ACCESS_TOKEN" \
-H "Content-Type: image/jpeg" \
-T $IMAGE_PATH 

# ユーザーとリッチメニューを関連づけ
echo 'ユーザーとリッチメニューを関連付け'
curl -s -X POST "https://api.line.me/v2/bot/user/$USER_ID/richmenu/$NEW_RICHMENU_ID" \
-H "Authorization: Bearer $CHANNEL_ACCESS_TOKEN"

echo $?
