
// const {
//     sequelize,
//     User,
//     Category,
//     Good, TrackedGood, History
// } = require("./db/models");
// const {saveCategoriesIfNotExist, getAllGoodsByCategory, parseGood, getJsDomByUrl, commitPriceChange,
//     checkTrackedGoodPrice
// } = require("./src/checker");

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
// const {where} = require("sequelize");
const url = require("url");
// const {FORMAT} = require("sqlite3");
const axios = require("axios");
const { spawn, spawnSync, execSync, exec } = require('child_process');
const {Logger} = require("sequelize/lib/utils/logger");
const path  = require('path');


bot.setMyCommands([...BotCommand.map(c => ({ command: c.name, description: c.description }))]);

const admin_user_id = 473591842;

const start = async () =>
{
    writeLog('Service was started');

    // await sequelize.authenticate();
    // await sequelize.sync();

    // if(mode == 'development') {
    //     await sequelize.sync({ alter : { drop: false } });
    //     // await sequelize.sync({ force: true });
    // } else {
    //     await sequelize.sync();
    // }

    // every day scan
    const priceCheckerTask = cron.schedule('0 * * * *', async () => {
        console.log('\n ============= cron job is begin ============= \n');
        // await checkTrackedGoodPrice(bot);
        console.log('\n ============= cron job end ============= \n');
    });

    const jobs = [priceCheckerTask];

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const user = msg.from;
        const pathToRoot =  path.resolve(__dirname, '..');
        const pathToExec = path.resolve(__dirname, '..', 'yt-dlp_win', 'yt-dlp.exe');


        const links = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'links_list.json'), 'utf8'));
        // const member = await bot.getChatMember(chatId, user.id);
        // const dbUser = await User.findOne({ where: { id: user.id}});

        // user must be registered in system
        // if(!dbUser && text != CommandName.START) return bot.sendMessage(chatId, '/start - to register');

        if(user.id != admin_user_id) return;


        try {
            switch (text) {
                case CommandName.START: {
                    CommandHistory.deleteCommandHistoryIfExist(user);

                    //TODO: encoding error
                    // console.log(downloadProcess.stdout);

                    const url = 'https://www.twitch.tv/videos/1948368665';
                    const options = [
                        `--config-location ${path.resolve(pathToRoot, 'config.txt')}`
                    ]
                    const interceptOutput = {stdio: ['ignore', process.stdout, 'ignore']}
                    console.log(pathToExec);

                    const downloadProcess = spawn(`${pathToExec} ${options.join(' ')} ${url}`, [''], {shell: true});

                    downloadProcess.stderr.on('data', (data) => {
                        console.log(`ERROR: \n${data}`);
                    });
                    downloadProcess.stdout.on('data', (data) => {
                        console.log(`child stdout: \n${data}`);
                        writeLog(`${data}`);
                    });
                    downloadProcess.on('close', function (code) {
                        console.log("finish");
                    });

                    await bot.sendSticker(chatId, stickerList.find(s => s.name == 'Hello').url);
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
                            }
                            case CommandName.DELETE_TRACK_ITEM: {
                                const goodId = parseInt(text);
                                // await TrackedGood.destroy({where: {goodId, userId: user.id}})
                                return bot.sendMessage(chatId, StatusMessages.SUCCESS_DELETED);
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
                // const category = await Category.findOne({ where: { id: payload }});
                // if(!category) return bot.sendMessage(StatusMessages.NOT_CORRECT_DATA);
                //
                // const changedPriceGoods = await getAllGoodsByCategory(category);
                // const answer = goodChangesMsgFormat(changedPriceGoods);
                //
                // if(!Array.isArray(answer) || answer.length === 0)
                //     return bot.sendMessage(opts.chat_id, StatusMessages.NO_CHANGES);
                //
                // answer.forEach((item) => {
                //     // bot.answerCallbackQuery(query.id, {text: item.substring(0, 199), show_alert: true});
                //     bot.sendMessage(opts.chat_id, item, {parse_mode: 'HTML'});
                // });
                break;
            }
        }
    });
    bot.on("polling_error", (msg) => console.log(msg));
}

start();

console.log("end");




