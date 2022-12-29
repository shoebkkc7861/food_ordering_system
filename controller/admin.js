let { loginAdmin, findAll, assignPer, getpermission, getallpermission, update, softDelete, softUndelete, active, unActive } = require("../model/admin");


async function adminLogin( response,request){
    let login= await loginAdmin(request.body).catch((err)=>{
        return { error: err}
    });
    if ( ! login || login.error){
        return response.status(401).send({error: login.error})
    }   
    return response.send({data:login})
} 

async function findUser( response,request){
    let find= await findAll(request.body).catch((err)=>{
        return { error: err}
    });
    if ( ! find || find.error){
        return response.status(401).send({error: find.error})
    }   
    return response.send({data:find})
} 

async function assignPermission( response,request){
    let assign= await assignPer(request.body,request.userData).catch((err)=>{
        return { error: err}
    });
    if ( ! assign || assign.error){
        return response.status(401).send({error: assign.error})
    }   
    return response.send({data:assign})
} 

async function getAllPer( response,request){
    let all= await getallpermission(request.body).catch((err)=>{
        return { error: err}
    });
    if ( ! all || all.error){
        return response.status(401).send({error: all.error})
    }   
    return response.send({data:all})
} 

async function userPermission( response,request){
    let per= await getpermission(request.body).catch((err)=>{
        return { error: err}
    });
    if ( ! per || per.error){
        return response.status(401).send({error: per.error})
    }   
    return response.send({data:per})
} 

async function updateUser( response,request){
    let up= await update(request.body,request.userData).catch((err)=>{
        return { error: err}
    });
    if ( ! up || up.error){
        return response.status(401).send({error: up.error})
    }   
    return response.send({data:up})
} 

async function deleteUser( response,request){
    let deleteU= await softDelete(request.body,request.userData).catch((err)=>{
        return { error: err}
    });
    if ( ! deleteU || deleteU.error){
        return response.status(401).send({error: deleteU.error})
    }   
    return response.send({data:deleteU})
} 

async function unDeleteUser( response,request){
    let UndeleteU= await softUndelete(request.body,request.userData).catch((err)=>{
        return { error: err}
    });
    if ( ! UndeleteU || UndeleteU.error){
        return response.status(401).send({error: UndeleteU.error})
    }   
    return response.send({data:UndeleteU})
} 

async function activeUser( response,request){
    let act= await active(request.body,request.userData).catch((err)=>{
        return { error: err}
    });
    if ( ! act || act.error){
        return response.status(401).send({error: act.error})
    }   
    return response.send({data:act})
} 

async function unActiveUser( response,request){
    let unAct= await unActive(request.body,request.userData).catch((err)=>{
        return { error: err}
    });
    if ( ! unAct || unAct.error){
        return response.status(401).send({error: unAct.error})
    }   
    return response.send({data:unAct})
} 

module.exports={
    adminLogin,
    findUser,
    assignPermission,
    getAllPer,
    userPermission,
    updateUser,
    deleteUser,
    unDeleteUser,
    activeUser,
    unActiveUser
}