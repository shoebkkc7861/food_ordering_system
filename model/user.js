let {User}=require("../schema/user")
let joi=require("joi");
let bcrypt=require("bcrypt")
let jwt= require("jsonwebtoken");
let randomstring=require("randomstring")
let {email}=require("../helper/email");
const { json } = require("sequelize");
let uploads= require("../helper/file");
const userPermission = require("../schema/userPermission");


//for registration


function checkregister(param){
    let schema = joi.object({
        name:joi.string().max(30).min(2).required(),
        username:joi.string().max(100).min(2).required(),
        password:joi.string().max(30).min(3).required(),
        mobile_no:joi.string().max(10).min(10).required()
    }).options({
        abortEarly:false
    })

    let check = schema.validate(param)
    if(check.error){
       let error= [];
       for(let err of check.error.details){
        error.push(err.message)
       }
       return {error:error}
    }
    return {data:check.value}
}

async function registerUser(param){
    let check = await  checkregister(param)
    if ( ! check || check.error){
        return {error:check.error}
    }

    let finduser=await User.findOne({where:{username:param.username}}).catch((err)=>{
        return {error:err}
    });

    if(finduser){
        return {error:"This user is already existed"}
    }
    param.password=await bcrypt.hash(param.password,10).catch((err)=>{
        return {error:err}
    })
    if(!param.password || param.password.error){
        return {error:"internal Server Error"}
    };

    let registeruser= await User.create({
        name:param.name,
        username:param.username,
        password:param.password,
        mobile_no:param.mobile_no,
        is_deleted:0,
        is_active:1
    }).catch((err)=>{
        return {error:err}
    })
    if(!registeruser || registeruser.error){
        return {error:"Internal Server Error"}
    };
    let givePermission= await userPermission.create({user_id:registeruser.id,permission_id:1}).catch((err)=>{
        return { error: err}
    });
    if(!givePermission || givePermission.error){
        return { error: " Internal Server Error"}
    }
    
    return {data:"you are registered Successfullyy"}
}



//for login


async function checkLogin(param){
    let schema= joi.object({
      username:joi.string().max(100).min(2).required(),
      password:joi.string().max(100).min(1).required()
    }).options({
        abortEarly:false
    })
    let check = schema.validate(param)
    if(check.error){
        let error=[];
        for ( let err of check.error.details){
            error.push(err.message)
        }
        return {error:error}
    }
    return {data:check.value}
}

async function loginUser(param){
    let check = await checkLogin(param)
if (check.error || !check){
    return {error:check.error} 
}
let findOne= await User.findOne({where:{username:param.username}}).catch((err)=>{
    return {error:err}
})
if (!findOne || findOne.error){
    return { error: "Username & password incorrect"}
}
let checkpass= await bcrypt.compare(param.password,findOne.password).catch((err)=>{
    return { error: err}
})
if(!checkpass || checkpass.error){
    return {error:"username and password incorrect "}
}
let key="mohif9232";
let token = jwt.sign({id:findOne.id},key,{expiresIn:"1d"})
if(!token || token.error){
    return { error: "Internal Server Error"}
}
return { data : "Login successfully", token}
}

//for forget password

async function checkForget(param){
    let schema= joi.object({
        username:joi.string().max(100).min(2).required(),
      }).options({
          abortEarly:false
      })
      let check = schema.validate(param)
      if(check.error){
          let error=[];
          for ( let err of check.error.details){
              error.push(err.message)
          }
          return {error:error}
      }
      return {data:check.value}
  }


async function forgetUser(param){
    let check = await checkForget(param)
    if ( check .error || !check){
        return { error : check.error}
    }
    let findUser= await User.findOne({where:{username:param.username}}).catch((err)=>{
        return {error: err}
    })
    if(!findUser || findUser){
        return {error: "user name not found"}
    }
    let token=  randomstring.generate(10)
    let add=await User.update({token:token},{where:{id:findUser.id}}).catch((err)=>{
        return {error:err}
    })
    if(!add || add.error){
        return { error: " Internal Server Error"}
    }
    let mailoption={
        from:"mohif.waghu@somaiya.edu",
        to:findUser.username,
        subject:"forget password token",
        text: "for reset your password please use this token:" + token
    };

    let sendmail= await email(mailoption).catch((err)=>{
        return {error:err}
    })
    if(!sendmail || sendmail.error){
        return {error:sendmail.error}
    }
    return {data:sendmail}
    }

    //for reset password
    async function checkReset(param){
        let schema= joi.object({
            token:joi.string().max(100).min(2).required(),
            newpassword:joi.string().max(100).min(3).required()
          }).options({
              abortEarly:false
          })
          let check = schema.validate(param)
          if(check.error){
              let error=[];
              for ( let err of check.error.details){
                  error.push(err.message)
              }
              return {error:error}
          }
          return {data:check.value}
      }

    async function resetPassword(param){
        let check= await checkReset(param)
        if(!check || check.error){
            return {error:check.error}
        }
        let checktoken= await User.findOne({where:{token:param.token}}).catch((err)=>{
            return {error:err}
        })
        if(!checktoken || checktoken.error){
            return {error:"Your Token is not valid"}
        }
        let resetpass= await User.update({password:await bcrypt.hash(param.newpassword,10)},{where:{id:checktoken.id}}).catch((err)=>{
            return {error:err}
        })
        if(!resetpass || resetpass.error){
            return {error:"Internal Server Error"}
        }
        let emptyToken= await User.update({token:""},{where:{id:resetpass.id}}).catch((err)=>{
            return {error:err}
        })
        if(!emptyToken || emptyToken.error){
            return {error:"internal server error"}
        }
        return {data:"password reset successfully you can login again"}
    }


    //for password change

    async function checkPass(param){
        let schema= joi.object({
            oldpassword:joi.string().max(100).min(2).required(),
            newpassword:joi.string().max(100).min(3).required()
          }).options({
              abortEarly:false
          })
          let check = schema.validate(param)
          if(check.error){
              let error=[];
              for ( let err of check.error.details){
                  error.push(err.message)
              }
              return {error:error}
          }
          return {data:check.value}
      }

      async function changePass(param,userData){
        let check= await checkPass(param)
        if(!check || check.error){
            return {error:check.error}
        }
        let checkpass= await User.findOne({where:{id:userData.id}}).catch((err)=>{
            return {error:err}
        })
        if(!checkpass || checkpass.error){
            return {error:"something went wrong"}
        }
        let comparepass= await bcrypt.compare(param.oldpassword,checkpass.password).catch((err)=>{
            return {error:err}
        });
        if(!comparepass || comparepass.error){
            return {error:"Your password is not correct"}
        }
        let updatepassword= await User.update({password:await bcrypt.hash(param.newpassword,10)}).catch((err)=>{
            return {error:err}
        });
        if(!updatepassword || updatepassword.error){
            return {error:"internal server error"}
        }
        return  {data:"password changed successfullyyy...."}
      }

      //about me

      async function getMe(userData){
        let get= await User.findOne({attributes:["name","username","mobile_no","profile_pic_path"],where:{id:userData.id}}).catch((err)=>{
            return {error:err}
        });
        if(!get || get.error){
            return {error:"internal server error"}
        }
        return {data:get}
      }


//update profile

async function checkUpdate(param){
    let schema= joi.object({
        name:joi.string().max(100).min(2),
        username:joi.string().max(100).min(3),
        mobile_no:joi.string().max(10).min(3)
      }).options({
          abortEarly:false
      })
      let check = schema.validate(param)
      if(check.error){
          let error=[];
          for ( let err of check.error.details){
              error.push(err.message)
          }
          return {error:error}
      }
      return {data:check.value}
  }

  async function updateMe(param,userData){
    let check = await checkUpdate(param)
    if(!check || check.error){
        return {error:check.error}
    }
    let find=await User.findOne({where:{id:userData.id}}).catch((err)=>{
        return {error:err}
    });
    if(!find || find.error){
        return {error:"internal server error"}
    }
    let updateuser= await User.update(param,{where:{id:find.id}}).catch((err)=>{
        return {error:err}
    })
    if(!updateuser || updateuser.error){
        return {error:"something went wrong"}
    }
    return {data:"hurrayyyy updated successfullyyy"}
  }

  async function addprofile(imagePath, loginUser) {
    let finduser = await User.findOne({ where: { id: loginUser.id } }).catch((err) => {
        return { error: err }
    });
    if (!finduser || finduser.error) {
        return { error: "Something Went Wrong" }
    }
    let addImage = await User.update({ profile_pic_path: imagePath }, { where: { id: finduser.id } }).catch((err) => {
        return { error: err }
    });
    if (!addImage || addImage.error) {
        return { error: "something went wrong" }
    }
    return { data: "profile pic uploaded successfullyy" }
}

//for updating profile pic

async function updateProfile(imagePath, loginUser){
    let find = await User.findOne({ where: { id: loginUser.id } }).catch((err) => {
    return { error: err }
    });
    if (!find || find.error) {
    return { error: "Something is not correct" }
    };
    let updatepic = await User.update({ profile_pic_path: imagePath },{where:{id:find.id}}).catch((err) => {
    return { error: err }
    });
    if (!updatepic || updatepic.error) {
    return { error: "Internal Server Error" }
    }
   return { data: "Your Profile pic updated successfully...." }
}

async function deactivate(param,userData) {
    let finduser = await User.findOne({ where: { id: userData.id } }).catch((err) => {   //id ke jagah token baadme
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Invalid Token" }
    }
    let update = await User.update({ is_deleted: 1 }, { where: { id: finduser.id } }).catch((err) => {
        return { error: err }
    });
    console.log(update)
    if (!update || update.error) {
        return { error: "Internal Server Error" }
    }
    return { data: "You are deactivate successfully for activation again please login again" }

}

module.exports={
    registerUser,
    loginUser,
    forgetUser,
    resetPassword,
    getMe,
    updateMe,
    addprofile,
    updateProfile,
    deactivate
}