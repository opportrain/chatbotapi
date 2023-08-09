const express = require("express")
const app = express()
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const token = process.env.TELEGRAM_BOT_KEY
app.use(express.static("public"))
app.listen(process.env.PORT || 5000,
    () => console.log("Server is running..."));

const bot = new TelegramBot(token, {polling: true});

const welcomeUser=async function (msg) {
    await bot.sendMessage(msg.chat.id, `Welcome to Opportrain ${msg.chat.first_name}!`);
}

bot.onText(/opportrain/, async (msg) => {

    await welcomeUser(msg)

});