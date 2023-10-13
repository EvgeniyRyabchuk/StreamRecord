const Good = require('./Good');
const Category = require('./Category');
const User = require('./User');
const History = require('./History');
const TrackedGood = require('./TrackedGood');
const Command = require('./Command');

// {as: 'categories', foreignKey: 'categoryId'}

Good.belongsTo(Category,{
    foreignKey: {
        name: 'categoryId',
        allowNull: true
    },
    onDelete: 'CASCADE'
});

Good.hasMany(TrackedGood);

Category.hasMany(Good);

History.belongsTo(Good)

TrackedGood.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    },
    onDelete: 'CASCADE'
});
TrackedGood.belongsTo(Good, {
    foreignKey: {
        name: 'goodId',
        allowNull: false
    },
    onDelete: 'CASCADE'
});

Command.belongsTo(User);
User.hasMany(TrackedGood);

module.exports = {
    Good,
    Category,
    User,
    History,
    TrackedGood
}