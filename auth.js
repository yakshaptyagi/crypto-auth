const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('./Models/UserModel');
const SECRET_KEY = 'secret';

function PassportAuth(){
    return new LocalStrategy({ usernameField:'email', passwordField:'password'}, function(username, password,done){
        UserModel.findOne({email: username}, (err, user)=>{
            if(err){
                return done(err);
            }
            if(!user){
                return done(null, false, {message:'Incorrect email'});
            }
            if(!bcrypt.compareSync(password,user.password)){
                return done(null, false, {message:'Incorrect Password'});
            }
            return done(null, user);
        });
    } );
}

function GenerateToken(user){
    return jwt.sign(user, SECRET_KEY, { expiresIn: 30000 })
}

function VerifyToken(token){
    let res = jwt.verify(token, SECRET_KEY, (err, decode)=> decode!== undefined?decode:err);
    console.log(res);
    if(res instanceof Error){
        return false;
    }
    else{
        return res;
    }
}

module.exports ={ GenerateToken, PassportAuth, VerifyToken };