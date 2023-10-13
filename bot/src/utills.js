const moment = require("moment");
const {User, TrackedGood, Good} = require("../db/models");
const {getJsDomByUrl, parseGood, commitPriceChange} = require("./checker");


const CommandName = {
    START: '/start',
    SCAN_BY_CATEGORY: '/scan_by_category',
    TRACK: '/track',
    TRACK_LIST: '/track_list',
    CATEGORY_LIST: '/category_list',
    DELETE_TRACK_ITEM: '/delete_track_item',
    INFO: '/info',
    STATISTIC: '/statistic',
    GET_STATISTIC_PHOTO: '/get_statistic_photo'
}
const AdminCommandName = {
    STOP_ALL_CORN_JOBS: '/stop_all_corn_jobs',
    START_ALL_CORN_JOBS: '/start_all_corn_jobs',
    SHOW_LOGS: '/show_logs'
}

const currenDateTimeStamp = `===== ${moment().format('DD-MM-YYYY h:mm:ss a')} =====`

const StatusMessages = {
    NO_CHANGES: `Нет изменений. \n${currenDateTimeStamp}`,
    SUCCESS_DELETED: 'Удаление прошло успешно',
    SUCCESS_CREATED: 'Запись создана',
    ERROR: 'Произошла ошибка. Попробуйте позже',
    COMMAND_NOT_FOUND: 'Комманда не найдена',
    NOT_CORRECT_DATA: 'Не верно введеные дынные. Попробуйте сново!',
    INFO_TIP: `Вы можете посмотреть список комманд с помощью команды ${CommandName.INFO}`,
    TRACK_TIP: 'Список пуст. /track - комманда для добавления в этот список',
    SUCCESS_ADD_TO_TRACK_LIST: 'Ок. Буду следить.',
    NOT_ALLOW_FOR_YOUR_ROLE: 'Комманда не может быть выполненна вами',
    NOT_FOUND: 'Not Found',
    EMPTY_LIST: 'Empty list'
}

const CallbackPayloadSeparator = '#';

const BotCommand = [
    {
        name: CommandName.START,
        description: 'Enter start to register yourself in system',
        default_answer: `Добро пожаловать. ${StatusMessages.INFO_TIP}`,

    },
    {
        name: CommandName.SCAN_BY_CATEGORY,
        description: 'Scan all goods by category',
        default_answer: 'Выберите категорию',

    },
    {
        name: CommandName.TRACK,
        description: 'Add good to your personal track list',
        default_answer: 'Скинь мне ссылку на товар магазина Ябко',
    },
    {
        name: CommandName.TRACK_LIST,
        description: 'Show your track list',
        default_answer: CommandName.TRACK_LIST,

    },
    {
        name: CommandName.CATEGORY_LIST,
        description: 'Show category list',
        default_answer: 'Вот список категорий в магазине Ябко.\n' +
        'Вы можете нажать на соответствующию категорию и узнать от последних изменениях цен в ней (если они есть)'
    },
    {
        name: CommandName.DELETE_TRACK_ITEM,
        description: 'Delete track entry from tack list',
        default_answer: 'Введите id товара для удаления',

    },
    {
        name: CommandName.INFO,
        description: 'Show your bot capability',
        default_answer: ''
    },
    {
        name: CommandName.STATISTIC,
        description: 'Send statistic image of price changes for specify good',
        default_answer: 'Give me a good id'
    },
];

const getDefAnswer = (text) => BotCommand.find(bc => bc.name === text).default_answer;

const GoodsPageType = {
    LIST: {
        NameSelector: '.slide-title > span',
        UrlSelector: '.product_link',
        PriceUah: '.price-cur > .uah > span',
    },
    SHOW: {
        NameSelector: '.product-info__title',
        UrlSelector: '.container-crumbs > ul > li:nth-last-child(1) > a',
        PriceUah: '.price-new__uah',
        PriceUsd: '.price-new__usd'
    }
}

const stickerList = [
    {
        name: 'Hello',
        url: `https://tlgrm.ru/_/stickers/a93/3bb/a933bb07-c608-4603-8765-ee62fb481afc/1.webp`
    }
]

const max_msg_c_at_time = 24;
const getColoredSpan = (color, val, char = null, type = 'abs') => {
    if(type == 'abs')
        return `<b style=\"color: ${color}\">${char == '+' ? '+' : ''}${val} грн</b>`;
    if(type == 'percent')
        return `<b style=\"color: ${color}\">${char}${val}%</b>`;
}

const goodChangesMsgFormat = (changedGoods) => {
    const res = changedGoods.length > max_msg_c_at_time
        ? changedGoods.slice(0, max_msg_c_at_time) : changedGoods;

    return res.map(changedGood => {
        const {percentDiff: valPercent, absoluteDiff: valAbs, char } = changedGood.diff;
        const diffColor = changedGood.diff.percentDiff > 0 ? 'green' : 'red';

        return `<a href="${changedGood.good.url}">${changedGood.good.name}</a>
Before <s>${changedGood.oldPriceUah}</s> - 
After <b>${changedGood.newPriceUah} (${getColoredSpan(diffColor,valPercent,char,'percent')} / ${getColoredSpan(diffColor, valAbs, char, 'abs')}).</b>`
    })
}

const fromTextToMoney = (text) => {
    return parseFloat(text
        .replace('грн', '')
        .replace(' ', '')
        .replace('$', ''))
        .toFixed(2);
}

const getOptionsFromCategories = (categories) => {
    return {
        reply_markup: JSON.stringify({
            inline_keyboard: categories.map(category => (
                [{ text: category.name, callback_data: `${CommandName.SCAN_BY_CATEGORY}${CallbackPayloadSeparator}${category.id}`}]
            ))
        })
    }
}

const getExtraQuestion = (commandName, step = 0) => {
    return ExtraQuestions.find(eq => eq.command == commandName).questions[step];
}

const ExtraQuestions = [
    {
        command: CommandName.TRACK,
        questions: ['От скольки процентов скидки отслеживать товар?']
    }
]

const getInfoMsg = () => {
    const title = 'Привет, этот бот призван помочь тебе купить по самой низкой цене\n';
    const content = 'Для этого ты можешь воспользоваться таким функционалом как: \n' +
        BotCommand.map(bc => `- ${bc.name} - ${bc.description}`).join('\n');
    const footer = '\n === Приятного пользования! === \n Автор: https://github.com/EvgeniyRyabchuk \n';
    return `${title}${content}${footer}`;
}

module.exports = {
    StatusMessages,
    CommandName,
    BotCommand,
    currenDateTimeStamp,
    GoodsPageType,
    goodChangesMsgFormat,
    fromTextToMoney,
    CallbackPayloadSeparator,
    getOptionsFromCategories,
    stickerList,
    getDefAnswer,
    getExtraQuestion,
    getInfoMsg,
    AdminCommandName
}














/*


const test = async () => {
    await sequelize.sync();
    User.create({ name: '123'});
    const users = await User.findAll();
    console.logs(users);
    console.logs('db is ready');
}


const options = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: CommandName.INFO, callback_data: '1' }],
        [{ text: CommandName.TRACK, callback_data: '3' }],
        [{ text: CommandName.TRACK_LIST, callback_data: '4' }],
        [{ text: CommandName.DELETE_TRACK_ITEM, callback_data: '5' }]
      ]
    })
};




 # ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *



async function a(url) {
    try {
        const response = await fetch(`${url}`, {
            cache: 'no-cache',
            headers: {
                'Content-Type': "text/html",
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Cookie': 'currency=UAH; sc=D80AFC0B-6285-4664-7244-DC91A3D22691; _gcl_au=1.1.784045452.1685257063; _ms=954ebda9-c107-4e9d-b0bd-3053a907a8d1; _hjSessionUser_2828866=eyJpZCI6ImFlMjg3ZDY0LWI1ZDItNTExYS1hNzdhLTJlMzYxY2YwYTdjYSIsImNyZWF0ZWQiOjE2ODUyNTcwNjMzMjYsImV4aXN0aW5nIjp0cnVlfQ==; rcusi=1; user_store_id=8; store_id=8; PHPSESSID=2ncg5v9dpn7fb88lf9uhj5mpv3; _gid=GA1.2.636623163.1686400205; ln_or=eyIzNTMwMzQwIjoiZCJ9; language=rus; _hjSession_2828866=eyJpZCI6Ijg3NDU0ZTM4LWFjOWMtNDA5OS04M2I1LWVkOWFmMTQ4MTc0NyIsImNyZWF0ZWQiOjE2ODY0NzA4MjQ3OTcsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; _ga_6XL3GWYTYK=GS1.1.1686470824.28.1.1686471633.0.0.0; _ga=GA1.2.1180345601.1685257063; biatv-cookie={%22firstVisitAt%22:1685257062%2C%22visitsCount%22:9%2C%22campaignCount%22:1%2C%22currentVisitStartedAt%22:1686470830%2C%22currentVisitLandingPage%22:%22https://jabko.ua/zaporizhzhia/rus/iphone/%22%2C%22currentVisitOpenPages%22:8%2C%22location%22:%22https://jabko.ua/rus/iphone/apple-iphone-13/apple-iphone-13-128gb-midnight%22%2C%22locationTitle%22:%22%D0%9A%D1%83%D0%BF%D0%B8%D1%82%D1%8C%20Apple%20iPhone%2013%20128GB%20(Midnight)%20%E2%80%94%20%D1%86%D0%B5%D0%BD%D1%8B%20%E2%9A%A1%2C%20%D0%BE%D1%82%D0%B7%D1%8B%D0%B2%D1%8B%20%E2%9A%A1%2C%20%D1%85%D0%B0%D1%80%D0%B0%D0%BA%D1%82%D0%B5%D1%80%D0%B8%D1%81%D1%82%D0%B8%D0%BA%D0%B8%20%E2%80%94%20%D0%AF%D0%91%D0%9A%D0%9E%22%2C%22userAgent%22:%22Mozilla/5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit/537.36%20(KHTML%2C%20like%20Gecko)%20Chrome/114.0.0.0%20Safari/537.36%22%2C%22language%22:%22ru%22%2C%22encoding%22:%22utf-8%22%2C%22screenResolution%22:%222195x1235%22%2C%22currentVisitUpdatedAt%22:1686471640%2C%22utmDataCurrent%22:{%22utm_source%22:%22google%22%2C%22utm_medium%22:%22organic%22%2C%22utm_campaign%22:%22(not%20set)%22%2C%22utm_content%22:%22(not%20set)%22%2C%22utm_term%22:%22(not%20provided)%22%2C%22beginning_at%22:1685257062}%2C%22campaignTime%22:1685257062%2C%22utmDataFirst%22:{%22utm_source%22:%22google%22%2C%22utm_medium%22:%22organic%22%2C%22utm_campaign%22:%22(not%20set)%22%2C%22utm_content%22:%22(not%20set)%22%2C%22utm_term%22:%22(not%20provided)%22%2C%22beginning_at%22:1685257062}%2C%22geoipData%22:{%22country%22:%22Ukraine%22%2C%22region%22:%22Zaporizhzhya%20Oblast%22%2C%22city%22:%22Zaporizhzhia%22%2C%22org%22:%22%22}}; bingc-activity-data={%22numberOfImpressions%22:0%2C%22activeFormSinceLastDisplayed%22:0%2C%22pageviews%22:3%2C%22callWasMade%22:0%2C%22updatedAt%22:1686472765}'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            credentials: "include",

        })
        console.logs(123);
    } catch(ex) {
        console.error(ex);
    }
}

 */