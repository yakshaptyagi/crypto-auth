const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require('passport');
const logger = require('morgan');
const cors = require('cors');
const Routes = require('./Routes/UserRoutes');
const UserModel = require('./Models/UserModel');
const { PassportAuth } = require('./auth');
const app = express();

// const dbUri = 'mongodb://localhost:27017/CryptoUserDB';
const dbUri = 'mongodb+srv://mongoadmin:kjG9RtvrrgNWx49E@contact-cluster.ntxhw.mongodb.net/CryptoUserDB';

const store = new MongoDBStore({
    uri: dbUri,
    collection: 'app_session'
})


mongoose.connect(dbUri)
mongoose.connection.once('open',(err)=>{
    if(!err){
        console.log("connecred to db");
    }else{
        console.log(err);
    }
})



app.use(cors({origin: true, credentials: true, }));
app.use(bodyparser.json());
app.use(logger('dev'));





app.use(session({
    secret:'1234567890',
    saveUninitialized:false,
    cookie:{
        maxAge: 120000
    },
    store: store,
    resave: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done){
    done(null, user._id);
})
passport.deserializeUser(function(id, done){
    UserModel.findById(id, function(err, user){
        done(err, user);
    })
})

passport.use(PassportAuth());

app.use('/api/v1', Routes);



const port = process.env.PORT || 9000;
app.listen(port, ()=>{
    console.log("server is running on port 9000");
})