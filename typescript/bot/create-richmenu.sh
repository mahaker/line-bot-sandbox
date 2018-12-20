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
    "width": ,
    "height": 
  },
  "selected": ,
  "name": "",
  "chatBarText": "",
  "areas": [
    {
      "bounds: {
        "x": ,
        "y": ,
        "width": ,
        "height":
      },
      "action": {
        "type": "",
        "displayText": "",
        "data": ""
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
