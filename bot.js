require('dotenv').config();
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf/markup')
const COUTRIES_LIST = require('./constants')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) =>
  ctx.reply(
    `
    Welcome! ${ctx.message.from.first_name}!
    Here is CORONAVIRUS SHIT, you can check all countries by using /help.
`,
    Markup.keyboard([
      ['US', 'Germany'],
      ['Ukraine', 'Italy'],
    ])
      .resize()
      .extra()
  ));

bot.help((ctx) => ctx.reply(COUTRIES_LIST))

bot.on('text', async (ctx) => {
  let data = {}

  try {
    data = await api.getReportsByCountries(ctx.message.text);

    const formatData = `
  Страна: ${data[0][0].country}
  Случаи: ${data[0][0].cases}
  Смертей: ${data[0][0].deaths}

  `;
    ctx.reply(formatData)
  } catch {
    ctx.reply(`Sorry, I don't know this county(You wrote a wrong name)`)
  }
});
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()

console.log('Bot is running')