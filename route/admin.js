let {adminLogin,findUser, assignPermission,getAllPer,userPermission,updateUser,deleteUser, unDeleteUser, activeUser,unActiveUser}=require("../controller/admin")
let {addCategory,updateCategory,categoryView,deleteCategory,UndeleteCategory,activeCategory,unactiveCategory}=require("../controller/category")
let{addDish,updateDish,viewDish,deleteDish,undeleteDish,blockDish,unblockDish}=require("../controller/product")
let express=require("express");
let app= express();
let auth= require("../middleware.js/auth")

app.post("/login",adminLogin);
app.get("/view_user",auth("getUser"),findUser);

app.post("/assign_permission",auth("assignPermission"),assignPermission);
app.get("/view_permission",auth("getPermission"),getAllPer);
app.get("/view_userPermission",auth("getPermission"),userPermission);

app.put("/updateUser",auth("updateUser"),updateUser)
app.delete("/deleteUser",auth("deleteUser"),deleteUser)
app.delete("unDeleteUser",auth("deleteUser"),unDeleteUser)

app.put("/unblockUser",auth("blockUser"),activeUser);
app.put("/unblockUser",auth("blockUser")),unActiveUser;

app.post("/add_category",auth("addCategory"),addCategory);
app.put("/update_category",auth("updateCategory"),updateCategory);
app.get("/view_category",categoryView);

app.delete("/delete_category",auth("deleteCategory"),deleteCategory);
app.delete("/undelete_category",auth("deleteCategory"),UndeleteCategory);

app.put("/available_category",auth("blockCategory"),activeCategory);
app.put("/unavailable_category",auth("blockCategory"),unactiveCategory)

app.post("/add_dish",auth("addDish"),addDish);
app.put("/update_dish",auth("updateDish"),updateDish);
app.get("/view_dish",viewDish);

app.delete("/delete_dish",auth("deleteDish"),deleteDish);
app.delete("/undelete_dish",auth("deleteDish"),undeleteDish);

app.put("/block_dish",auth("blockDish"),blockDish);
app.put("/unblock_dish",auth("blockDish"),unblockDish);






module.exports= app