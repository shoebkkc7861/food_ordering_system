let express= require("express");
let app= express();
let route=require("./route/user")
let route2=require("./route/admin")

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/v1/admin",route2)
app.use("/api/v1/user",route)

app.listen(3001,()=>{
    console.log("Connected To Server on 3001")
})