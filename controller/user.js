const uploads = require("../helper/file")
let {request,response}=require("express")
let { registerUser, loginUser, forgetUser, resetPassword, getMe, updateMe, addprofile, updateProfile, } = require("../model/user")

async function register_me(request, response) {
    let reg = await registerUser(request.body).catch((err) => {
        return { error: err }
    })
    console.log(reg)
    if (!reg || reg.error) {
        return response.status(401).send({ error: reg.error })
    }
    return response.status(200).send({ data: reg })
}

async function login_me(request, response) {
    let login = await loginUser(request.body).catch((err) => {
        return { error: err }
    })
    if (!login || login.error) {
        return response.status(401).send({ error: login.error })
    }
    return response.send({ data: login })
}

async function forget_me(request, response) {
    let reg = await forgetUser(request.body).catch((err) => {
        return { error: err }
    })
    if (!reg || reg.error) {
        return response.status(401).send({ error: reg.error })
    }
    return response.send({ data: reg })
}

async function reset_me(request, response) {
    let reg = await resetPassword(request.body).catch((err) => {
        return { error: err }
    })
    if (!reg || reg.error) {
        return response.status(401).send({ error: reg.error })
    }
    return response.send({ data: reg })
}

async function get_me(request, response) {
    let reg = await getMe(request.userData).catch((err) => {
        return { error: err }
    })
    if (!reg || reg.error) {
        return response.status(401).send({ error: reg.error })
    }
    return response.send({ data: reg })
}

async function update_me(request, response) {
    let reg = await updateMe(request.body, request.userData).catch((err) => {
        return { error: err }
    })
    if (!reg || reg.error) {
        return response.status(401).send({ error: reg.error })
    }
    return response.send({ data: reg })
}
async function add_profile(request, response) {
    let file = await uploads(request, response, "upload_pic", { fileSize: 3 * 3000 * 300 }).catch((err) => {
        return { error: err }
    });
    if (!file || file.error) {
        return response.status(401).send({ error: "internal server error" })
    }
    let reg = await addprofile(file.path, request.userData).catch((err) => {
        return { error: err }
    })
    if (!reg || reg.error) {
        return response.status(401).send({ error: reg.error })
    }
    return response.send({ data: reg })
}

async function update_profile(request, response) {
    let file = await uploads(request, response, "update_pic", { fileSize: 3 * 3000 * 300 }).catch((err) => {
        return { error: err }
    });
    if (!file || file.error) {
        return response.status(401).send({ error: "internal server error" })
    }
    let reg = await updateProfile(request.userData, file.path).catch((err) => {
        return { error: err }
    })
    if (!reg || reg.error) {
        return response.status(401).send({ error: reg.error })
    }
    return response.send({ data: reg })
}



module.exports = {
    register_me,
    login_me,
    update_me,
    forget_me,
    reset_me,
    get_me,
    add_profile,
    update_profile
}