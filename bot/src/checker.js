
const url = 'https://jabko.ua/zaporizhzhia/rus/';

const { GoodsPageType, fromTextToMoney, goodChangesMsgFormat} = require('./utills');
const axios = require('axios')
const jsdom = require("jsdom");
const {Category, Good, History, User, TrackedGood} = require("../db/models");
const path = require('path');
const fs = require("fs");
const { JSDOM } = jsdom;


const getAllCategories = async () => {
    // const limit2 = 3;
    // let document1 = (await getJsDomByUrl(`https://rock-star.com.ua/keyboards/digital-piano/?limit=${limit2}`)).window.document;
    // const containers1 = document1.querySelectorAll(".product-thumb");
    // console.logs(containers1.length, `limit = ${limit2}`);
    //
    //
    // return;

    try {
        let dom = await getJsDomByUrl(url);
        let result = [];
        let list = dom.window.document.querySelectorAll(".second-nav > .item");
        for(let item of list) {
            const li = item.querySelector(".item--link-l1");
            result.push({
                name: li.textContent.replace('\n', '').trim(),
                url: li.getAttribute('href')
            });
        }
        return result;
    }
    catch (err) {
        console.error(err);
    }
}
const saveCategoriesIfNotExist = async () => {
    const categoryList = await getAllCategories();
    console.log(categoryList);
    for (let category of categoryList) {
        const existCategory = await Category.findOne({
            where: { name: category.name }
        });
        if(!existCategory)
            await Category.create({name: category.name, url: category.url});
    }
    return Category.findAll();
}


const saveHtmlDoc = (html) => {
    var fs = require('fs');
    fs.appendFile('123.html', html.toString("utf-8"), function (err) {
        if (err) throw err;
        console.log('Saved!');
    })
}
const getJsDomByUrl = async (url, isSave = false) => {
    const response = await axios.get(`${url}`, {
        responseType: 'document',
        headers: {
            // cacheControl: 'no-cache',
            // pragma: 'no-cache',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Cookie': 'currency=UAH; sc=D80AFC0B-6285-4664-7244-DC91A3D22691; _gcl_au=1.1.784045452.1685257063; _ms=954ebda9-c107-4e9d-b0bd-3053a907a8d1; _hjSessionUser_2828866=eyJpZCI6ImFlMjg3ZDY0LWI1ZDItNTExYS1hNzdhLTJlMzYxY2YwYTdjYSIsImNyZWF0ZWQiOjE2ODUyNTcwNjMzMjYsImV4aXN0aW5nIjp0cnVlfQ==; rcusi=1; user_store_id=8; store_id=8; PHPSESSID=2ncg5v9dpn7fb88lf9uhj5mpv3; _gid=GA1.2.636623163.1686400205; ln_or=eyIzNTMwMzQwIjoiZCJ9; language=rus; _hjSession_2828866=eyJpZCI6Ijg3NDU0ZTM4LWFjOWMtNDA5OS04M2I1LWVkOWFmMTQ4MTc0NyIsImNyZWF0ZWQiOjE2ODY0NzA4MjQ3OTcsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; _ga_6XL3GWYTYK=GS1.1.1686470824.28.1.1686471633.0.0.0; _ga=GA1.2.1180345601.1685257063; biatv-cookie={%22firstVisitAt%22:1685257062%2C%22visitsCount%22:9%2C%22campaignCount%22:1%2C%22currentVisitStartedAt%22:1686470830%2C%22currentVisitLandingPage%22:%22https://jabko.ua/zaporizhzhia/rus/iphone/%22%2C%22currentVisitOpenPages%22:8%2C%22location%22:%22https://jabko.ua/rus/iphone/apple-iphone-13/apple-iphone-13-128gb-midnight%22%2C%22locationTitle%22:%22%D0%9A%D1%83%D0%BF%D0%B8%D1%82%D1%8C%20Apple%20iPhone%2013%20128GB%20(Midnight)%20%E2%80%94%20%D1%86%D0%B5%D0%BD%D1%8B%20%E2%9A%A1%2C%20%D0%BE%D1%82%D0%B7%D1%8B%D0%B2%D1%8B%20%E2%9A%A1%2C%20%D1%85%D0%B0%D1%80%D0%B0%D0%BA%D1%82%D0%B5%D1%80%D0%B8%D1%81%D1%82%D0%B8%D0%BA%D0%B8%20%E2%80%94%20%D0%AF%D0%91%D0%9A%D0%9E%22%2C%22userAgent%22:%22Mozilla/5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit/537.36%20(KHTML%2C%20like%20Gecko)%20Chrome/114.0.0.0%20Safari/537.36%22%2C%22language%22:%22ru%22%2C%22encoding%22:%22utf-8%22%2C%22screenResolution%22:%222195x1235%22%2C%22currentVisitUpdatedAt%22:1686471640%2C%22utmDataCurrent%22:{%22utm_source%22:%22google%22%2C%22utm_medium%22:%22organic%22%2C%22utm_campaign%22:%22(not%20set)%22%2C%22utm_content%22:%22(not%20set)%22%2C%22utm_term%22:%22(not%20provided)%22%2C%22beginning_at%22:1685257062}%2C%22campaignTime%22:1685257062%2C%22utmDataFirst%22:{%22utm_source%22:%22google%22%2C%22utm_medium%22:%22organic%22%2C%22utm_campaign%22:%22(not%20set)%22%2C%22utm_content%22:%22(not%20set)%22%2C%22utm_term%22:%22(not%20provided)%22%2C%22beginning_at%22:1685257062}%2C%22geoipData%22:{%22country%22:%22Ukraine%22%2C%22region%22:%22Zaporizhzhya%20Oblast%22%2C%22city%22:%22Zaporizhzhia%22%2C%22org%22:%22%22}}; bingc-activity-data={%22numberOfImpressions%22:0%2C%22activeFormSinceLastDisplayed%22:0%2C%22pageviews%22:3%2C%22callWasMade%22:0%2C%22updatedAt%22:1686472765}'
        },
        withCredentials: true
    });
    const html = response.data;

    // const response = await fetch(`${url}`, {
    //     cache: 'no-cache',
    //     headers: {
    //         'Content-Type': "text/html",
    //         'Cache-Control': 'no-cache',
    //         'Pragma': 'no-cache',
    //         'Cookie': 'currency=UAH; sc=D80AFC0B-6285-4664-7244-DC91A3D22691; _gcl_au=1.1.784045452.1685257063; _ms=954ebda9-c107-4e9d-b0bd-3053a907a8d1; _hjSessionUser_2828866=eyJpZCI6ImFlMjg3ZDY0LWI1ZDItNTExYS1hNzdhLTJlMzYxY2YwYTdjYSIsImNyZWF0ZWQiOjE2ODUyNTcwNjMzMjYsImV4aXN0aW5nIjp0cnVlfQ==; rcusi=1; user_store_id=8; store_id=8; PHPSESSID=2ncg5v9dpn7fb88lf9uhj5mpv3; _gid=GA1.2.636623163.1686400205; ln_or=eyIzNTMwMzQwIjoiZCJ9; language=rus; _hjSession_2828866=eyJpZCI6Ijg3NDU0ZTM4LWFjOWMtNDA5OS04M2I1LWVkOWFmMTQ4MTc0NyIsImNyZWF0ZWQiOjE2ODY0NzA4MjQ3OTcsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; _ga_6XL3GWYTYK=GS1.1.1686470824.28.1.1686471633.0.0.0; _ga=GA1.2.1180345601.1685257063; biatv-cookie={%22firstVisitAt%22:1685257062%2C%22visitsCount%22:9%2C%22campaignCount%22:1%2C%22currentVisitStartedAt%22:1686470830%2C%22currentVisitLandingPage%22:%22https://jabko.ua/zaporizhzhia/rus/iphone/%22%2C%22currentVisitOpenPages%22:8%2C%22location%22:%22https://jabko.ua/rus/iphone/apple-iphone-13/apple-iphone-13-128gb-midnight%22%2C%22locationTitle%22:%22%D0%9A%D1%83%D0%BF%D0%B8%D1%82%D1%8C%20Apple%20iPhone%2013%20128GB%20(Midnight)%20%E2%80%94%20%D1%86%D0%B5%D0%BD%D1%8B%20%E2%9A%A1%2C%20%D0%BE%D1%82%D0%B7%D1%8B%D0%B2%D1%8B%20%E2%9A%A1%2C%20%D1%85%D0%B0%D1%80%D0%B0%D0%BA%D1%82%D0%B5%D1%80%D0%B8%D1%81%D1%82%D0%B8%D0%BA%D0%B8%20%E2%80%94%20%D0%AF%D0%91%D0%9A%D0%9E%22%2C%22userAgent%22:%22Mozilla/5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit/537.36%20(KHTML%2C%20like%20Gecko)%20Chrome/114.0.0.0%20Safari/537.36%22%2C%22language%22:%22ru%22%2C%22encoding%22:%22utf-8%22%2C%22screenResolution%22:%222195x1235%22%2C%22currentVisitUpdatedAt%22:1686471640%2C%22utmDataCurrent%22:{%22utm_source%22:%22google%22%2C%22utm_medium%22:%22organic%22%2C%22utm_campaign%22:%22(not%20set)%22%2C%22utm_content%22:%22(not%20set)%22%2C%22utm_term%22:%22(not%20provided)%22%2C%22beginning_at%22:1685257062}%2C%22campaignTime%22:1685257062%2C%22utmDataFirst%22:{%22utm_source%22:%22google%22%2C%22utm_medium%22:%22organic%22%2C%22utm_campaign%22:%22(not%20set)%22%2C%22utm_content%22:%22(not%20set)%22%2C%22utm_term%22:%22(not%20provided)%22%2C%22beginning_at%22:1685257062}%2C%22geoipData%22:{%22country%22:%22Ukraine%22%2C%22region%22:%22Zaporizhzhya%20Oblast%22%2C%22city%22:%22Zaporizhzhia%22%2C%22org%22:%22%22}}; bingc-activity-data={%22numberOfImpressions%22:0%2C%22activeFormSinceLastDisplayed%22:0%2C%22pageviews%22:3%2C%22callWasMade%22:0%2C%22updatedAt%22:1686472765}'
    //
    //         // 'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //     credentials: "include"
    // })
    // const html = await response.text();

    if(isSave)
        saveHtmlDoc(html);

    return new JSDOM(`${html}`);
}

const parseGood = async (container,
                         PageType = GoodsPageType.LIST,
                         currencyBuy = null,
                         categoryId = null,
                         GoodUrl = null
) => {
    const name = container.querySelector(PageType.NameSelector).textContent.replace(/\s\s+/g, ' ');
    const url = container.querySelector(PageType.UrlSelector).getAttribute('href');
    const price_uah = fromTextToMoney(container.querySelector(PageType.PriceUah).textContent);

    let price_usd = 0;
    let article = null;
    if(PageType == GoodsPageType.LIST) {
        price_usd = (price_uah / currencyBuy).toFixed(2);
    }
    else if(PageType == GoodsPageType.SHOW) {
        article = container.querySelector('.product-info__flex-vendor').textContent;
        price_usd = fromTextToMoney(container.querySelector(PageType.PriceUsd).textContent);
    }

    const [good, created] = await Good.findOrCreate({
        where: { name },
        defaults: {
            name,
            url: PageType == GoodsPageType.LIST ? url : GoodUrl,
            price_uah,
            price_usd,
            dollar: currencyBuy,
            categoryId: categoryId,
            article
        }
    });
    return {good, newPrice: {uah: price_uah, usd: price_usd}};
}

const commitPriceChange = async (good, newPrice, changedGoods, minPercent = 0) => {
    if(good.price_uah != newPrice.uah) {
        const absoluteDiff = Math.round(newPrice.uah - good.price_uah);
        const percentDiff = Math.round((absoluteDiff * 100) / good.price_uah);
        const char = absoluteDiff > 0 ? "+" : '-';


        if(Math.abs(percentDiff) >= minPercent || minPercent === 0) {
            changedGoods.push({
                good,
                oldPriceUah: good.price_uah,
                newPriceUah: newPrice.uah,
                diff: { absoluteDiff, percentDiff, char }
            });

            await Good.update({ price_uah: newPrice.uah, price_usd: newPrice.uah }, {
                where: { id: good.id }
            });

            await History.create({
                new_price_uah: newPrice.uah,
                old_price_uah: good.price_uah,
                new_price_usd: newPrice.usd,
                old_price_usd: good.price_usd,
                goodId: good.id
            })
        }
        return {
            absoluteDiff,
            percentDiff
        }
    }
}

const getGoods = async (totalPage, currentPage, category, currencyBuy, changedGoods) => {
    const document = (await getJsDomByUrl(`${category.url}?page=${currentPage}`, false)).window.document;
    const containers = document.querySelectorAll(".prod-item");

    // console.logs(containers.length, `totalPage = ${totalPage}`, `limit = ${limit}`);
    console.log(containers.length, `totalPage = ${totalPage}`);

    for (let container of containers) {
        const {good, newPrice} = await parseGood(container, GoodsPageType.LIST, currencyBuy, category.id);
        await commitPriceChange(good, newPrice, changedGoods)
    }
    return changedGoods;
}

// get all the goods by category
//TODO: make only one requst for get pagination btn
const getAllGoodsByCategory = async (category) => {
    console.log(' ================================= start scan =================================');

    let document = (await getJsDomByUrl(`${category.url}`)).window.document;
    const paginateBtn = document.querySelector(".pagination > .pag-item:nth-last-child(2)");
    let totalPage = 0;
    if(paginateBtn)
        totalPage = paginateBtn.textContent;

    const perPage = 24;
    let currentPage = 1;
    // const limit = totalPage * perPage;
    // const limit = 10;
    // let urlWithLimit = `${category.url}?limit=${limit}`;

    const response = await axios.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
    const currencyBuy = response.data[1].buy;

    let changedGoods = [];

    if(totalPage == 0) {
        changedGoods = await getGoods(
            totalPage,
            currentPage,
            category,
            currencyBuy,
            changedGoods
        );
    } else {
        while (currentPage <= totalPage) {
            // try {
            //     const path1 = `C:/Users/jekar/Desktop/telegram_bot_jabko/123.html`;
            //     document = fs.readFileSync(path1, {encoding: 'utf-8'});
            //     document = new JSDOM(`${document}`).window.document;
            // } catch (ex) {
            //     console.error(ex)
            // }
            changedGoods = await getGoods(
                totalPage,
                currentPage,
                category,
                currencyBuy,
                changedGoods
            );
            currentPage++;
            console.log(`current page = ${currentPage}`);
        }
    }
    // const limit2 = 3;
    // document = (await getJsDomByUrl(`https://rock-star.com.ua/keyboards/digital-piano/?limit=${limit2}`)).window.document;
    // const containers1 = document.querySelectorAll(".product-thumb");
    // console.logs(containers1.length, `limit = ${limit2}`);
    console.log(' ================================= scan is end =================================');
    return changedGoods;
}

const checkTrackedGoodPrice = async (bot) => {
    const users = await User.findAll({
        include: [{ model: TrackedGood, include: Good}]
    })
    console.log("users: "+users.length);

    for (let user of users) {
        const trackedGoods = user.TrackedGoods;
        console.log("tracked: "+trackedGoods.length);
        const changes = [];
        for (let trackedGood of trackedGoods) {
            const document = (await getJsDomByUrl(`${trackedGood.Good.url}`, false)).window.document;
            const {good, newPrice} = await parseGood(document, GoodsPageType.SHOW, null, trackedGood.Good.categoryId, trackedGood.Good.url);
            await commitPriceChange(good, newPrice, changes, trackedGood.min_percent);
        }
        console.log("changes: "+changes.length);
        if(changes.length > 0) {
            const msg = goodChangesMsgFormat(changes);
            msg.forEach((item) => {
                bot.sendMessage(user.chatId, item, {parse_mode: 'HTML'});
            });
        }
    }
}

module.exports = {
    saveCategoriesIfNotExist,
    getAllGoodsByCategory,
    parseGood,
    getJsDomByUrl,
    commitPriceChange,
    checkTrackedGoodPrice
}
