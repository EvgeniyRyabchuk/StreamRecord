const { Model, DataTypes} = require('sequelize');
const sequelize = require('../index');

class Good extends Model { }

Good.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true},
    url: { type: DataTypes.STRING},
    price_uah: { type: DataTypes.DECIMAL },
    price_usd: { type: DataTypes.DECIMAL },
    dollar: { type: DataTypes.DECIMAL },
    article: { type: DataTypes.INTEGER, unique: true, nullInput: true}
    // category_id: { type: DataTypes.INTEGER, }
},{
    sequelize,
    modelName: 'good'
});



module.exports = Good;