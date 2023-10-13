
const {
    sequelize,
    User,
    Category,
    Good, TrackedGood, History
} = require("./db/models");
const {saveCategoriesIfNotExist, getAllGoodsByCategory, parseGood, getJsDomByUrl, commitPriceChange,
    checkTrackedGoodPrice
} = require("./src/checker");
const {
    StatusMessages,
    CommandName,
    GoodsPageType,
    goodChangesMsgFormat,
    getOptionsFromCategories,
    BotCommand, stickerList, getDefAnswer, getExtraQuestion, getInfoMsg, AdminCommandName
} = require('./src/utills');
const CommandHistory = require('./src/commandHistory');

require('dotenv').config();

const TelegramApi = require('node-telegram-bot-api');
const token = process.env.CHAT_BOT_TOKEN;
const baseTargetUrl = process.env.BASE_TARGET_URL;

const mode = process.env.MODE ?? 'development';
const bot = new TelegramApi(token, {
    polling: true
});

const fs = require('fs');
const writeLog = require('./src/logger.js');
const http = require("http");
const cron = require('node-cron');
const moment = require("moment/moment");
const {where} = require("sequelize");
const url = require("url");
const {FORMAT} = require("sqlite3");
const axios = require("axios");
const {getGoodHistoryStatistic} = require("./src/chart");


bot.setMyCommands([...BotCommand.map(c => ({ command: c.name, description: c.description }))]);

const admin_user_id = 473591842;

console.log(baseTargetUrl);

const start = async () =>
{
    writeLog('Service was started');

    await sequelize.authenticate();
    await sequelize.sync();

    // if(mode == 'development') {
    //     await sequelize.sync({ alter : { drop: false } });
    //     // await sequelize.sync({ force: true });
    // } else {
    //     await sequelize.sync();
    // }


    // a('https://jabko.ua/rus/apple-watch/apple-watch-series-8/apple-watch-series-8-45mm-midnight-aluminum-case-with-midnight-sport-band');

    // return;

    // every day scan
    const priceCheckerTask = cron.schedule('0 * * * *', async () => {
        console.log('\n ============= cron job is begin ============= \n');
        await checkTrackedGoodPrice(bot);
        console.log('\n ============= cron job end ============= \n');
    });

    const jobs = [priceCheckerTask];

    const categories = await saveCategoriesIfNotExist();
    const categoryOptions = getOptionsFromCategories(categories);

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const user = msg.from;
        // const member = await bot.getChatMember(chatId, user.id);
        const dbUser = await User.findOne({ where: { id: user.id}});

        // user must be registered in system
        if(!dbUser && text != CommandName.START) return bot.sendMessage(chatId, '/start - to register');

        try {
            switch (text) {
                case CommandName.START: {
                    CommandHistory.deleteCommandHistoryIfExist(user);
                    await bot.sendSticker(chatId, stickerList.find(s => s.name == 'Hello').url);

                    if(!dbUser) {
                        await User.create({ id: user.id, chatId, name: user.first_name });
                        return bot.sendMessage(chatId, getDefAnswer(text));
                    } else {
                        return bot.sendMessage(chatId, StatusMessages.INFO_TIP);
                    }
                }
                case CommandName.INFO: {
                    CommandHistory.deleteCommandHistoryIfExist(user);
                    return bot.sendMessage(chatId, getInfoMsg(), { parse_mode: 'HTML' });
                }
                case CommandName.TRACK: {
                    CommandHistory.deleteCommandHistoryIfExist(user);
                    CommandHistory.addOrUpdateCommandHistory(user, CommandName.TRACK);
                    const def_answer = BotCommand.find(bc => bc.name === text).default_answer;
                    return bot.sendMessage(chatId, def_answer);
                }
                case CommandName.TRACK_LIST:
                    const trackList = (await User.findOne({ where: {id: user.id}, include:
                        { model: TrackedGood, include: Good }
                    })).TrackedGoods;
                    const answer = trackList.length > 0 ? trackList.map(
                        tl => `[${tl.Good.id}]${tl.Good.name} | Отслеживаете от ${tl.min_percent}%\n`
                    ).join('') : StatusMessages.TRACK_TIP;
                    writeLog('show track list');
                    return bot.sendMessage(chatId, answer);
                case CommandName.DELETE_TRACK_ITEM:
                    CommandHistory.deleteCommandHistoryIfExist(user);
                    CommandHistory.addOrUpdateCommandHistory(user, CommandName.DELETE_TRACK_ITEM);
                    return bot.sendMessage(chatId, getDefAnswer(text));
                case CommandName.CATEGORY_LIST: {
                    return bot.sendMessage(chatId, getDefAnswer(text), categoryOptions);
                }
                case CommandName.SCAN_BY_CATEGORY: {
                    return bot.sendMessage(chatId, getDefAnswer(text), categoryOptions);
                }

                case CommandName.STATISTIC: {
                    CommandHistory.deleteCommandHistoryIfExist(user);
                    CommandHistory.addOrUpdateCommandHistory(user, CommandName.GET_STATISTIC_PHOTO);
                    return bot.sendMessage(chatId, getDefAnswer(text));
                }


                case AdminCommandName.STOP_ALL_CORN_JOBS: {
                    if (user.id !== admin_user_id)
                        return bot.sendMessage(chatId, StatusMessages.NOT_ALLOW_FOR_YOUR_ROLE)
                    jobs.forEach(job => job.stop());
                    return bot.sendMessage(chatId, 'corn jobs stopped successfully');
                }
                case AdminCommandName.START_ALL_CORN_JOBS: {
                    if (user.id !== admin_user_id)
                        return bot.sendMessage(chatId, StatusMessages.NOT_ALLOW_FOR_YOUR_ROLE)
                    jobs.forEach(job => job.start());
                    return bot.sendMessage(chatId, 'corn jobs started successfully');
                }
                case AdminCommandName.SHOW_LOGS: {
                    if (user.id !== admin_user_id)
                        return bot.sendMessage(chatId, StatusMessages.NOT_ALLOW_FOR_YOUR_ROLE);
                    return bot.sendDocument(chatId, './logs/logs.txt', { caption: "logs"});
                }

                default: {
                    const existCommand = CommandHistory.history.find(c => c.user.id == user.id);
                    if(existCommand) {
                        switch (existCommand.command) {
                            case CommandName.TRACK: {
                                if(existCommand.step == 0)  {
                                    if(!text.includes(baseTargetUrl))
                                        return bot.sendMessage(chatId, StatusMessages.NOT_CORRECT_DATA);

                                    CommandHistory.addOrUpdateCommandHistory(user, CommandName.TRACK, 1, {url: text });
                                    return bot.sendMessage(chatId, getExtraQuestion(CommandName.TRACK, 0));
                                }
                                if(existCommand.step == 1) {
                                    existCommand.state.percent = text;
                                    const {url, percent } = existCommand.state;

                                    const minPercent = parseInt(percent);
                                    if(Number.isNaN(minPercent))
                                        return bot.sendMessage(chatId, StatusMessages.NOT_CORRECT_DATA);
                                    if(minPercent < 0 || minPercent > 100)
                                        return bot.sendMessage(chatId, StatusMessages.NOT_CORRECT_DATA);

                                    const response = await axios.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
                                    const currencyBuy = response.data[1].buy;

                                    let good = await Good.findOne({ where: { url } });
                                    if(!good) {
                                        const document = (await getJsDomByUrl(`${url}`, false)).window.document;
                                        //TODO: define category
                                        good = (await parseGood(document, GoodsPageType.SHOW, currencyBuy, null, url)).good;
                                    }

                                    const [track, created] = await TrackedGood.findOrCreate({
                                        where: {goodId: good.id, userId: user.id },
                                        defaults: { goodId: good.id, userId: user.id, min_percent: minPercent}
                                    });

                                    // обновить запись если такова уже существует в списке (в случае повторного добавления в список пользователем)
                                    if(track.min_percent != minPercent) {
                                        await TrackedGood.update({ min_percent: minPercent }, {
                                            where:  {goodId: good.id, userId: user.id }}
                                        );
                                    }

                                    CommandHistory.deleteCommandHistoryIfExist(user);
                                    return bot.sendMessage(chatId, StatusMessages.SUCCESS_ADD_TO_TRACK_LIST);
                                }
                                break;
                            }
                            case CommandName.DELETE_TRACK_ITEM: {
                                const goodId = parseInt(text);
                                await TrackedGood.destroy({where: {goodId, userId: user.id}})
                                return bot.sendMessage(chatId, StatusMessages.SUCCESS_DELETED);
                            }
                            case CommandName.GET_STATISTIC_PHOTO: {
                                const trackedGood = await TrackedGood.findOne({
                                    where: { userId: user.id, goodId: text },
                                    include: [Good]
                                });
                                if(!trackedGood) return bot.sendMessage(chatId, StatusMessages.NOT_FOUND);
                                const histories = await History.findAll({
                                    where: { goodId: trackedGood.goodId },
                                    order: [ ['createdAt', 'ASC'] ],
                                });
                                if(histories.length === 0) return bot.sendMessage(chatId, StatusMessages.EMPTY_LIST);

                                const graphicPhoto = getGoodHistoryStatistic(histories, trackedGood.Good).toURL();
                                return bot.sendPhoto(chatId, graphicPhoto);
                            }
                        }
                    }
                    return bot.sendMessage(chatId, StatusMessages.COMMAND_NOT_FOUND);
                }
            }
        } catch (e) {
            writeLog(`Error ${e}`);
            return bot.sendMessage(chatId, StatusMessages.ERROR);
        }
    })

    bot.on('callback_query', async (query) =>{
        //настройки для редактирования сообщения
        const opts = {
            chat_id: query.message.chat.id,
            message_id: query.message.message_id,
        };

        const [command, payload] = query.data.split('#');

        switch (command) {
            case CommandName.SCAN_BY_CATEGORY: {
                const category = await Category.findOne({ where: { id: payload }});
                if(!category) return bot.sendMessage(StatusMessages.NOT_CORRECT_DATA);

                const changedPriceGoods = await getAllGoodsByCategory(category);
                const answer = goodChangesMsgFormat(changedPriceGoods);

                if(!Array.isArray(answer) || answer.length === 0)
                    return bot.sendMessage(opts.chat_id, StatusMessages.NO_CHANGES);

                answer.forEach((item) => {
                    // bot.answerCallbackQuery(query.id, {text: item.substring(0, 199), show_alert: true});
                    bot.sendMessage(opts.chat_id, item, {parse_mode: 'HTML'});
                });
                break;
            }
        }
    });
    bot.on("polling_error", (msg) => console.log(msg));
}

start();


console.log("end");




