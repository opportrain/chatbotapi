const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const token = process.env.TELEGRAM_BOT_KEY

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\opportrain/, (msg) => {
     console.log(msg.text)
     bot.sendMessage(msg.chat.id,
        msg.text);
});