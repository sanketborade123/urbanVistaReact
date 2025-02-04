import mongoose from "mongoose";
import { CgPassword } from "react-icons/cg";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default:"https://www.pngall.com/wp-content/uploads/5/Profile.png",
    },
},{timestamp:true});


const User =mongoose.model('User',userSchema);

export default User;