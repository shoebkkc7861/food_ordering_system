const joi = require("joi");

const { sequelize, QueryTypes } = require("../init/dbconnect");
const { User } = require("../schema/user");
let userPermission=require("../schema/userPermission")
let {Permission,Op} = require("../schema/permission")

//admin login
async function checklogin(param) {
    let schema = joi.object({
        username: joi.string().max(30).min(3).email().required(),
        password: joi.string().max(200).min(3).required(),
    }).options({
        abortEarly: false
    });

    let check = schema.validate(param)
    if (check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        };
        return { error: error }
    }
    return { data: check.value }
}

async function loginAdmin(param) {
    let check = await checklogin(param).catch((err) => {
        return { error: err }
    });
    if (!check || check.error) {
        return { error: check.error }
    }
    let checkuser = await User.findOne({ where: { username: param.username } }).catch((err) => {
        return { error: err }
    })
    if (!checkuser || checkuser.error) {
        return { error: "Username Not Found" }
    }

    let checkpass = await bcrypt.compare(param.password, checkuser.password).catch((err) => {
        return { error: err }
    });
    if (!checkpass || checkpass.error) {
        return { error: "Username & password Invalid" }
    }
    let key = "Mohif9232";
    let token = jwt.sign({ id: checkuser.id }, key, { expiresIn: "1d" })
    if (!token || token.error) {
        return { error: "Internal Server Error" }
    }
    return { data: "Login succeefully", token }
}

////get all user
async function checkbody(param) {
    let schema = joi.object({
        user_id: joi.number().max(300).min(0),
        name: joi.string().max(30).min(1),
        username: joi.string().max(30).min(3),
    }).options({
        abortEarly: false
    });
    console.log(param)
    let check = schema.validate(param)
    if (check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        };
        return { error: error }
    }
    return { data: check.value }
}
async function findAll(param) {
    let check = await checkbody(param).catch((err) => {
        return { error: err }
    });
    if (!check || check.error) {
        return { error: check.error }
    }
    let query = {};
    if (param.user_id) {
        query = { where: { id: param.id } }
    }
    if (param.name) {
        query = { where: { name: param.name } }
    }
    if (param.username) {
        query = { where: { username: param.username } }
    }

    let alluser = await User.findAll(query).catch((err) => {
        return { error: err }
    })
    console.log(alluser)
    if (!alluser || (alluser && alluser.error) || alluser.length==0) {
        return { error: "Cant find user" }
    }
    return { data: alluser }
};


//assign permission

async function checkassign(param){
    let schema=joi.object({
        user_id: joi.number().required(),
        permissionId:joi.array.items(joi.number().min(0)).required()
    }).options({
        abortEarly:false
    })
    let check = schema.validate(param)
    if(check.error){
        let error=[];
        for (let err of check.error.details){
            error.push(err.message)
        }
        return {error:error}
    }
    return {data:check.value}
}

async function assignPer(param,userData){
    let check=await  checkassign(param).catch((err)=>{
        return {error:err}
    })
    if(!check || check.error){
        return {error:check.error}
    }
let finduser= await User.findOne({where:{id:user_id}}).catch((err)=>{
    return {error:err}
})
if(!finduser || finduser.error){
    return {error:"USer not found"}
}

let checkper=await Permission.findAll({where:{id:{[Op.in]:param.permissionId}}}).catch((err)=>{
    return { error: err}
});
if(!checkper || checkper.error){
    return { error:checkper.error}
}
if(checkper.length != param.permissionId.length){
    return { error: "Invalid Permissionss"}
}

let permission=[];
for(let data of param.permissionId){
    permission.push({user_id:finduser.id, permission_id:data, createdBy:userData.id})
}

let addpermission= await userPermission.bulkCreate(permission).catch((err)=>{
    return {error:err}
});
if(!addpermission || addpermission.error){
    return {error:"internal server errorr"}
}
return { data : "Permissions added successfullyyy"}

}

//get the permission of the user

async function checkuserper(param){
    let schema=joi.object({
        user_id: joi.number().required(),
        name:joi.string().min(2)
    }).options({
        abortEarly:false
    })
    let check = schema.validate(param)
    if(check.error){
        let error=[];
        for (let err of check.error.details){
            error.push(err.message)
        }
        return {error:error}
    }
    return {data:check.value}
}

async function getpermission(param){
    let check = await checkuserper(param).catch((err)=>{
        return { error : err}
    })
    if(!check || check.error){
        return { error: check.error}
    }
    let find= await User.findOne({where:{id:user_id}}).catch((err)=>{
        return { error: err}
    })
    if ( ! find || find.error){
        return { error:"User not found"}
    }
    let getpermissions=await sequelize.query("SELECT user.id, user.name, GROUP_CONCAT(permission.permission) as permission  FROM user LEFT JOIN user_permission ON user.id=user_permission.user_id  LEFT JOIN permission ON permission.id = user_permission.permission_id = permission.id WHERE=:key GROUP BY user.id",{
        replacements:{key:find.id},
        QueryTypes:SELECT
    }).catch((err)=>{
        return { error: err}
    })

    if ( ! getpermissions || getpermissions.error){
        return {error: "Internal Server Error"}
    }
    return { data: getpermissions}
}

//get all the permission

async function getallpermission(){
    let getpermission= await sequelize.query("SELECT * FROM permission").catch((err)=>{
        return { error: err}
    })
    if( ! getpermission || getpermission.error){
        return { error: "Internal server error"}
    }
    return {data: getpermission}
}

//for update user

async function checkupdate(param) {
    let schema = joi.object({
        user_id: joi.number().max(300).min(0).required(),
        name: joi.string().max(30).min(1),
        username: joi.string().max(30).min(3),
        mobile_no: joi.string().max(10).min(4)
    }).options({
        abortEarly: false
    });

    let check = schema.validate(param)
    if (check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        };
        return { error: error }
    }
    return { data: check.value }
}

async function update(param,userData) {
    let check = await checkupdate(param).catch((err) => {
        return { error: err }
    });
    if (!check || check.error) {
        return { error: check.error }
    }
    let finduser = await User.findOne({ where: { id: param.user_id } }).catch((err) => {
        return { error: err }
    })
    if (!finduser || finduser.error) {
        return { error: "Id not found" }
    }
    let updateuser = await User.update({
        name: param.name,
        username: param.username,
        mobile_no: param.mobile_no,
        updatedBy:userData.id
    }, { where: { id: finduser.id } }).catch((err) => {
        return { error: err }
    });
    if (!updateuser || updateuser.error) {
        return { error: " Internal Server Error" }
    }
    return { data: " User Updated Successfully" }
}

//for soft delete the user


async function checkDelete(param) {
    let schema = joi.object({
        user_id: joi.number().max(100).min(0).required(),
        name: joi.string().max(30).min(1).required(),
    }).options({ abortEarly: false })

    let check = schema.validate(param);
    if (!check || check.error) {
        let error = [];
        for (let a of check.error.details) {
            error.push(a.message)
        }
        return { error: error };
    }
    return { data: check.value }
}




async function softDelete(param,userData) {
    let check = await checkDelete(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    };

    let finduser = await User.findOne({
        where: {
            id: param.user_id,
            name:param.name
        }
    }).catch((err) => {
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Id and Name not matched" }
    }
    let update = await User.update({ is_deleted: true ,is_active:false, updatedBy:userData.id}, {
        where: {
            id: finduser.id
        }
    }).catch((err) => {
        return { error: err }
    });

    if (!update || update.error) {
        return { error: " Internal Server Error" }
    }

    return { data: "Successfully deleted the user" }
}


//for undo the soft delete

async function checkUndelete(param) {
    let schema = joi.object({
        user_id: joi.number().max(100).min(0).required(),
        name: joi.string().max(30).min(1).required(),
    }).options({ abortEarly: false })

    let check = schema.validate(param);
    if (!check || check.error) {
        let error = [];
        for (let a of check.error.details) {
            error.push(a.message)
        }
        return { error: error };
    }
    return { data: check.value }
}


async function softUndelete(param,userData) {
    let check = await checkUndelete(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    };

    let finduser = await User.findOne({
        where: {
            id: param.user_id,
            name:param.name
        }
    }).catch((err) => {
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Id and Name not matched" }
    }
    let update = await User.update({ is_deleted: false, is_active:true ,updatedBy:userData.id }, {
        where: {
            id: finduser.id
        }
    }).catch((err) => {
        return { error: err }
    });

    if (!update || update.error) {
        return { error: " Internal Server Error" }
    }

    return { data: "Successfully undeleted user" }
}


//for block the user

async function checkUnactive(param) {
    let schema = joi.object({
        user_id: joi.number().max(100).min(0).required(),
        name: joi.string().max(30).min(1).required()
    }).options({ abortEarly: false })

    let check = schema.validate(param);
    if (!check || check.error) {
        let error = [];
        for (let a of check.error.details) {
            error.push(a.message)
        }
        return { error: error };
    }
    return { data: check.value }
}


async function unActive(param,userData) {
    let check = await checkUnactive(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    };

    let finduser = await User.findOne({
        where: {
            id: param.user_id,
            name:param.name
        }
    }).catch((err) => {
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Id and Name not matched" }
    }
    let update = await User.update({ is_active: false ,updatedBy:userData.id}, {
        where: {
            id: finduser.id,
        }
    }).catch((err) => {
        return { error: err }
    });

    if (!update || update.error) {
        return { error: " Internal Server Error" }
    }

    return { data: "sucessfully block the user" }
}

//for unblock the block user

async function checkActive(param) {
    let schema = joi.object({
        user_id: joi.number().max(100).min(0).required(),
        name: joi.string().max(30).min(1).required()
    }).options({ abortEarly: false })

    let check = schema.validate(param);
    if (!check || check.error) {
        let error = [];
        for (let a of check.error.details) {
            error.push(a.message)
        }
        return { error: error };
    }
    return { data: check.value }
}


async function active(param,userData) {
    let check = await checkActive(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    };

    let finduser = await User.findOne({
        where: {
            id: param.user_id,
            name:param.name
        }
    }).catch((err) => {
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Id and Name not matched" }
    }
    let update = await User.update({ is_active: true , updatedBy:userData.id}, {
        where: {
            id: finduser.id,
        }
    }).catch((err) => {
        return { error: err }
    });

    if (!update || update.error) {
        return { error: " Internal Server Error" }
    }

    return { data: "Successfully unblock the user" }
}


module.exports= {
     loginAdmin,
     findAll,
     assignPer,
     getpermission,
     getallpermission,
     update,
     softDelete,
     softUndelete,
     active,
     unActive   
}