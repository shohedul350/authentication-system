const User = require('../models/User');
const bcrypt = require('bcrypt');
const {validationResult}=require('express-validator');
const Flash = require('../utils/Flash')
const errorFormator= require('../utils/validationErrorFormator');



exports.signupGetController = (req, res, next) => {
res.render('pages/auth/signup',
{
     tittle:'Create a new account',
      error:{},
      value:{},
      flashMessage: Flash.getMessage(req)
    });
}

exports.signupPostController =async (req, res, next)  => {
    const {
        username,
         email,
          password
        } = req.body

    let errors = validationResult(req).formatWith(errorFormator)
   
    if(!errors.isEmpty()){
        req.flash('fail','please Check your Form')
       return res.render('pages/auth/signup',
       {
           tittle:'Create a new account',
           error:errors.mapped(),
          value:{
            username,
            email,
            password
          },
          flashMessage: Flash.getMessage(req)
       })
    }



    
   
try {
    let hashedpassword = await bcrypt.hash(password,11)
    let user = new User({
        username,
        email,
        password:hashedpassword
    });
   await user.save()
   req.flash('success','user create successfully')
    res.redirect('/auth/login')
} catch (error) {
console.log(error)
next(error)
    
}
}

exports.loginGetController = (req, res, next) => {

    res.render('pages/auth/login',
    {
        tittle:'Login to your account',
        error:{},
        flashMessage: Flash.getMessage(req)
    });
}

exports.loginPostController =async (req, res, next) => {
    
    let {email, password } = req.body
    let errors = validationResult(req).formatWith(errorFormator)
    
    if(!errors.isEmpty()){
        req.flash('fail','please Check your Form')
       return res.render('pages/auth/login',
       {tittle:'Login your account',
       error:errors.mapped(),
       flashMessage: Flash.getMessage(req)
    })
    }
    try {
       let user = await User.findOne({email})
       if (!user){
        req.flash('fail','User not Found')
        return res.render('pages/auth/login',
        {title:'Login your account',
        error:{},
        flashMessage: Flash.getMessage(req)
     })
       } 
       let match =await bcrypt.compare(password, user.password)
       if (!match) {
        req.flash('fail','Password not match')
        return res.render('pages/auth/login',
        {title:'Login your account',
        error:{},
        flashMessage: Flash.getMessage(req)
     })
       }

       req.session.isLogedIn = true
       req.session.user = user
       req.session.save(err=>{
           if(err){
               console.log(err)
               return next(err)
           }
       })
       req.flash('success','Successfully Logged In')
       res.redirect('/dashboard')
     

    } catch (error) {
        console.log(error);
next(error)
    }

   
}

exports.logoutController = (req, res, next) => {
    req.session.destroy(err=>{
        if(err){
        console.log(err)
        return next(err)
    }
    return res.redirect('/auth/login')
})
}