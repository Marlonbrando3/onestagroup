const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({

    firstname:{
        type:String,
    },
    lastname:{
        type:String,
    },
    email:{
        type:String,
    },
    phone:{
        type:Number,
    },
    pass:{
        type:String,
    },
})

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;