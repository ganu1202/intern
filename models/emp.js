const mongoose=require('mongoose');
const {Schema} = mongoose;
const validator=require('validator')



const empSchema=new Schema({
    name:{
        type:String,
        required:true
    },

    email: {
        type: String,
        validate: [validator.isEmail, "Invalid Email"],
        required: true,
        unique: true,
        lowercase: true // Ensures case-insensitive comparison
    }
    

    , 
    mobileNo:{
        type:String,
        validate:[validator.isMobilePhone,"Invalid number"],
        required:true,
    }
    ,
    designation:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        required:true,
    },
    course:{
        type:[String],
        required:true,
    },
    createDate:{
        type:Date,
        default:Date.now
    }
    ,
    image:{
        url:String,
        filename:String,
    }
})

const Employee=mongoose.model("Employee",empSchema);

module.exports=Employee;



