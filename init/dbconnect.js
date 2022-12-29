let { Sequelize, Model, DataTypes, QueryTypes, Op } = require("sequelize");

let sequelize = new Sequelize("mysql://root:MyStrongPassword1234$@localhost/food_delivery_system") //"mysql://root:@localhost/e_commerce"

sequelize.authenticate().then(() => {
    console.log("Connected To Database")
}).catch(() => {
    console.log("Not connected To Database")
})

module.exports = {
    sequelize,
    Model,
    DataTypes,
    QueryTypes,
    Op
}