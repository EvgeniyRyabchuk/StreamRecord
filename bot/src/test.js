const { Category, Good, TrackedGood, History, User, Command, sequelize}  = require('../db/models');
const a = require('../db/models');



async function start() {
    // await sequelize.authenticate();
    await sequelize.sync();
    // await Category.create({ name: 'sdfhgsfdh', url: 'sdfghsfdh'});
    // await Scan.create({ firstName: '123', lastName: '123', emai: '123', categoryId: 1});
    // await Good.create({ name: '123', url: '123', price_uah: 123, price_usd: 123, dollar: 123, categoryId: 1 })
    await TrackedGood.create({ GoodId: 1, UserId: 473591842, min_percent: 1 });
}


start();









