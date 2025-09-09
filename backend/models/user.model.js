import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\d{10}$/, 'Please fill a valid 10-digit phone number']
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        // select: false, // When we fetch user data, password will not be included
    },
    role: {
        type: String,
        enum: ['student', 'recruiter'],
        required: true
    },
   
    profile:{
       bio:{ type: String, trim: true, maxLength: 500 },
       skills:[ { type: String, trim: true } ],
       resume:{ type: String}, //url to resume file
       resumeOriginalName:{ type: String}, //original file name of resume
       company:{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }, //for recruiters
       profilePhoto:{
         type: String,
         default:""          
       } 

    },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);

