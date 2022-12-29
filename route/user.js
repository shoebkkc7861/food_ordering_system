let { register_me, login_me, update_me,forget_me,reset_me,get_me,add_profile,update_profile } = require("../controller/user")
let auth=require("../middleware.js/auth")
let express = require("express");
let app = express();

app.post("/forget_password",forget_me);
app.post("/reset_password",reset_me);

app.post("/register", register_me)
app.post("/login",login_me)

app.put("/update_me",auth,update_me);
app.get("/about_me",auth,get_me)

app.post("/upload_profile_pic",auth,add_profile);
app.post("update_profile_pic",auth,update_profile)




module.exports = app