"use strict"; //厳格モード(おまじない)
//パッケージをロードする
require('date-utils')//Date(日時)を便利にするやつ
//discord.jsをインポート
const { Client, GatewayIntentBits } = require('discord.js'); //discordjsから必要なのをrequire
const { Events } = require('discord.js');//イベント一覧
const { Configuration, OpenAIApi } = require("openai");

const client = new Client({ //インテントを設定してクライアントを定義する
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
 		GatewayIntentBits.GuildMembers,
 	],
});

//BOTトークンを変数tokenに読み込み
const { token } = require('./config.json');

//デバッグ用に情報書き出し
console.log("-------start up-------");
//今の時間をフォーマットしてstartup_timeに入れる
const startup_time = new Date().toFormat("YYYY/MM/DD HH24時MI分SS秒");
//ログとしてバージョン情報と起動した日時を出力しておく
console.log("start_up:" + startup_time);
console.log("node js   version : " + process.versions.node);
console.log("discordjs version : " + require('discord.js').version);
console.log("----------------------");
//デバッグ用に情報書き出し ここまで

//ログイン処理
client.login(token);
//起動したときに最初に走る処理
client.on('ready', async () => {
   console.log(`${new Date().toFormat("YYYY/MM/DD HH24時MI分SS秒")} ${client.user.tag}でログインしました。`);
});


const configuration = new Configuration({
  apiKey: "xxxxxxxxxxxx",
});
const openai = new OpenAIApi(configuration);

//MessageCreateEvent処理(サーバーにメッセージが送信された時の処理)
client.on(Events.MessageCreate, async message => { //messageに作られたmessageとかいろいろ入る
    if (message.author.bot) {//メッセージの送信者がBOTなら
        return;//returnしてこの先の処理をさせない。
    }
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: `${message.content}\n `}],
            n: 3,
        });
        console.log(completion.data.choices[0].message);

        // 取得した回答を返す
        await message.channel.send(completion.data.choices[0].message);
    } catch (error) {
        console.error("Error:", error);
    }
});