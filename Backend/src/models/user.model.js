import mongoose  from "mongoose";
import bcrypt from "bcryptjs";
import { compare } from './../../../node_modules/bcryptjs/index';

// Idhar hamae model aisa bana na hai so that we can do role base acess 

// role hame model me field bana nai padegi 


const userSchema = new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    contact:{type:String,required: true},
    password:{type:String,required:true},
    fullname:{type:String,required:true},
    role:{type:String,enum:["buyer","seller","admin"],default:"buyer"} 



})

userSchema.pre("save",async function ()
{
    if(!this.isModified("password"))
        return

    const hash = await bcrypt.hash(this.password,10)

    this.password = hash

})


userSchema.methods.comparePassword = async function (password)
{
    return await bcrypt.compare(password,this.password)
    
}


const userModel = mongoose.model("user",userSchema)

export default  userModel


// Now After that to ensure data is correct we  use express validator to validate data 

