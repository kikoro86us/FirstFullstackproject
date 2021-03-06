require('dotenv').config();

const express = require('express'),
      bodyParser = require('body-parser'),
      cors = require ('cors'),
      passport = require('passport'),
      app = express(),
      Auth0Strategy = require('passport-auth0'),
      massive = require('massive'),
      session = require('express-session'),
      path = require('path'),
      stripe = require('./server/constants/stripe');

      //test
      //-----stripe-----
      // const CORS_WHITELIST = require('./constants/frontend');
      // const corsOptions = {
      //   origin: (origin, callback) =>
      //     (CORS_WHITELIST.indexOf(origin) !== -1)
      //       ? callback(null, true)
      //       : callback(new Error('Not allowed by CORS'))
      // };
      const configureServer = app => {
        // app.use(cors());      
      //-----stripe----


app.use(bodyParser.json());
app.use(cors());
};
app.use(bodyParser.json());
//------stripe-------
module.exports = configureServer;
//------stripe-------

//massive

massive({
  connectionString:process.env.MASSIVE_URI
}).then(function(db){
  app.set('db',db)
});

//-----------------------

app.use(express.static('./build'))

app.use(session({
    secret: 'password',
    resave:false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());


passport.use(new Auth0Strategy({
    domain: process.env.AUTH_DOMAIN,
    clientID: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    callbackURL: process.env.AUTH_CALLBACK
  }, function(accessToken, refreshToken, extraParams, profile, done) {

    console.log(profile);
    //--------------------------//
    //to store in my db madke db.get//
    done(null, profile);

}));

app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: '/',
    failureRedirect: '/auth'
  }))


passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(obj, done){
    done(null, obj);
});

app.get('/auth/me', (req, res, next) => {
    if (!req.user) {
      return res.status(403).send('User not found');
    } else {
      return res.status(200).send(req.user);
    }
  })

  app.get('/auth/logout', (req, res) => {
    req.logOut();
    return res.redirect(302, '/');
  })

//==============Endpoints====================//

//get all users
app.get('/api/customers',function(req,res){
  app.get('db').getAllCustomers().then((customer)=>{
    res.status(200).send(customer)
  })
});

//get all email
app.get('/api/customeremails',function(req,res){
  app.get('db').getAllEmail().then((customer)=>{
    res.status(200).send(customer)
  })
})


//=========Check for admin========================//
app.get('/auth/admin', (req, res, next) => {
  console.log('are you an admin?')
  if (!req.user) {
    console.log('nope')
    res.redirect(302, '/');
  } else {console.log('yes')
    res.status(200).send(req.user);
  }
})



// ================================================//
// ================= STRIPE PAYMENTS ==============//
app.post('/api/test',(req,res,next)=>{
  console.log('test',req.body)
  const amountArray = req.body.amount.toString().split('');
  const pennies = [];
  for (var i = 0; i < amountArray.length; i++) {
    if(amountArray[i] === ".") {
      if (typeof amountArray[i + 1] === "string") {
        pennies.push(amountArray[i + 1]);
      } else {
        pennies.push("0");
      }
      if (typeof amountArray[i + 2] === "string") {
        pennies.push(amountArray[i + 2]);
      } else {
        pennies.push("0");
      }
        break;
    } else {
        pennies.push(amountArray[i])
    }
  }
  const convertedAmt = parseInt(pennies.join(''));

 const charge = stripe.charges.create({
  amount: convertedAmt, // amount in cents, again
  currency: 'usd',
  source: req.body.source,
  description: 'Charge from emospacezim'
}, function(err, charge) {
    if (err) return res.sendStatus(500)
    return res.sendStatus(200);
  // if (err && err.type === 'StripeCardError') {
  //   // The card has been declined
  // }
});
})


//=========Use this when you use browser router=======//
app.get('/*',(req,res) => {
  console.log('testadmin');
  res.sendFile(path.join(__dirname, './build/index.html'))
  });
//====================================================//



const port = process.env.PORT;
app.listen(port, () =>{
    console.log(`Listening on port😳 😳 😳 😳 : ${port}`);
})
