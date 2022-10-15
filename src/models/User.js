const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', function(next){
    const user = this;
    console.log("user",user);
    if (!user.isModified('password')){
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        console.log("salt",salt);
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next();
            user.password = hash;
            next();
        })
    })
});

userSchema.methods.comparePassword = function(candidatePassword){
    const user = this;

    return new Promise((resolve, reject)=>{
        bcrypt.compare(candidatePassword,user.password, (err, isMatch) => {
            if (err) return reject(err);

            if (!isMatch) return reject(false);
            resolve(true);
        })
    });
}

mongoose.model('User', userSchema);
