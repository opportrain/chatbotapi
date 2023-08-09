const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const token = process.env.TELEGRAM_BOT_KEY
process.config()
const bot = new TelegramBot(token, {polling: true});

const welcomeUser=async function (msg) {
    await bot.sendMessage(msg.chat.id, `Welcome to Opportrain ${msg.chat.first_name}!`);
}

bot.onText(/opportrain/, async (msg) => {

    await welcomeUser(msg)

});