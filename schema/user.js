const { type } = require("os")
let {sequelize,Model,DataTypes}=require("../init/dbconnect")

class User extends Model{}

User.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    username:{
        type:DataTypes.INTEGER,
        unique:true,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    mobile_no:{
        type:DataTypes.STRING,
        allowNull:false
    },
    token:{
        type:DataTypes.STRING,
        allowNull:true
    },
    is_deleted:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    is_active:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    updatedBy:{
        tyep:DataTypes.INTEGER,
        allowNull:true
    }
},{
    modelName:"User",
    tableName:"user",
    sequelize,
    
})

module.exports={User}