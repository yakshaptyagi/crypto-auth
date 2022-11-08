const UserModel = require('../Models/UserModel');
const bcrypt = require('bcryptjs');
const { GenerateToken, VerifyToken} = require('../auth');
const {v4: uuidv4} = require('uuid');


function RegisterUser(req, res){
    const Userinfo = req.body;
    // console.log(Userinfo);
    UserModel.findOne({email:Userinfo.email}, (err, user)=>{
        if(user){
            res.status(400).send({message:'user already exists'});
        }
        else if(!user){
            let user = new UserModel();
                user._id = uuidv4(),
                user.firstname = Userinfo.firstname,
                user.lastname= Userinfo.lastname,
                user.email = Userinfo.email,
                user.phone = Userinfo.phone,
                user.password = bcrypt.hashSync(Userinfo.password, 10)
            user.save((err)=>{
                if(!err){
                    res.status(200).send({message:'user added successfully', user: user});
                }
                else{
                    throw err;
                }
            })

        }
        else{
            res.send(err);
        }
    })
}

function LoginUser(req, res){
    const jwt_token = GenerateToken(req.session.passport);
    // res.cookie("token", jwt_token, ({httpOnly:false}));
    // localStorage.setItem({token: jwt_token})
    res.send({token: jwt_token })
}

function isAuthenticated(req, res){
    res.send({isAuthenticated: VerifyToken(req.headers.authorization)});
}

function Profile(req, res){
    console.log(req.user);
    UserModel.findOne({_id: req.user.user}, (err, data)=>{
        if(!err){
            // console.log(data);
            res.status(200).send(data);
        }
        else{
            res.status(400).send(err);
        }
    })
}

function VerifyTokenMiddleware(req, res, next) {
    if (VerifyToken(req.headers.authorization)) {
        req.user = VerifyToken(req.headers.authorization);
        next();
    } else {
        res.status(401).send({ status: 401, message: "You are not authorized" });
    }
}
module.exports = { RegisterUser, LoginUser, isAuthenticated, Profile, VerifyTokenMiddleware};