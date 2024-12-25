const mongoose=require('mongoose');

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Username cannot be Blanked']
    },
    password:{
        type:String,
        required:[true,'Password cannot be Blanked']

    }



});

module.exports=mongoose.model('User', userSchema);