var express = require('express')
const User = require('../model/user')
const Question = require('../model/question')
const Categories = require('../model/categories')
//let categories = ["Technology" , "Science" , "Health" , "Education" , "Entertainment" , "Investing" , "Others"]

const {check ,query , sanitizeParams , sanitizeQuery ,  validationResult } = require('express-validator') 
const {sanitizeBody }  = require('express-validator')
const bcrypt           = require('bcryptjs')

class App {

    getIndex = async(req, res, next) => {
        try{
            if(req.session.email){
              console.log("session.email exists!!!!!")
                const user = await User.findOne({email : req.session.email})
                const USER = await User.find()
                const question = await Question.find()
                const categories = await Categories.find()
                res.render('index', {title : "Dashboard", user : user , USERS : USER , questions : question , categories : categories})
            }else{
              console.log("\n\nelse doesn't exit...")
                const USER = await User.find()
                console.log("USER: ",USER);
                const question = await Question.find()
                console.log("QUESTION: ", question)
                const categories = await Categories.find()
                console.log("CATEGORIES: ", categories);
                
                   res.render('scape');
                // res.render('index', {title : "Quest-land", success : req.flash('success') , USERS : USER , questions : question , categories : categories})
            }

        }catch(err){
            res.send(err)
        }
        // res.json({
        //   "info":"Successfull!"
        // })
    }

    getMailConfirmation = async(req, res, next) => {
        const user = await User.findOne({email : req.session.email})
        const USER = await User.find()
        const question = await Question.find()
        res.render('email-confirm', {title : "Confirm your email", success : req.flash('success'), user : user , USERS : USER , questions : question , categories : categories})
    }

    postMailConfirmation = [
        check('email').not().isEmpty().isEmail().normalizeEmail().trim()
            .withMessage('Please , provide a valid email ')
            .custom(value => {
                return User.findOne({'email' : value}).then(user => {
                    if (user ) {
                        return Promise.reject(`You've applied before.`)	
                    }
                })
            }),
        async(req, res, next) => {
            try {
                const errors = validationResult(req)
                if(!errors.isEmpty()) {
                    console.log(errors.errors)
                    req.flash('success', errors.errors[0].msg)
                    if(req.params.userID){
                        let url = '/profile/' + req.params.userID
                        res.redirect(url)
                    }else{
                        res.redirect('/')
                    }
                }else{ 
                        req.session.email = req.body.email
                        res.redirect('/signup/' + req.body.email)
                    
                }
            }catch(errors) {

            }
        }
    ]

    getSignup = async(req,res, next) => {
        if(req.session.email){
            const user = await User.findOne({email : req.session.email})
            if(user){
                res.redirect('/')  
            }else{
                res.render('signup', {title : "Sign-up"})
            }  
        }else{
            res.redirect('/login')
        }
    }

    postSignup =  [
        // Backend Validations......

		//check('first_name').isLength({min : 3}).trim().withMessage('Name must be 3 characters and above'),
		//check('last_name').isLength({min : 3}).trim().withMessage('Name must be 3 characters and above'), 
        check('username').trim()
        .custom(value => {
            return User.findOne({'username' : value}).then(user => {
                if (user ) {
                    return Promise.reject(`You've applied before.`)	
			    }
            })
	    }), 
        async (req, res, next) => {
            try{
               if(req.session.email){
                    const errors = validationResult(req)
                    if (!errors.isEmpty()) { 
                        //res.render('signup' , {errors : errors.array()}) 
                        res.render('signup', {title : "Create an account", error : "Details already exist."})
                        return
                    }else{
                        const {firstName , lastName, username, dob, password, mobile, gender, state}  = req.body
                        const userPass = await bcrypt.hash(password , 10)
                        
                        const user = new User({
                            email : req.session.email,
                            firstName : firstName,
                            lastName : lastName,
                            username : username,
                            dateOfBirth : dob,
                            password : userPass,
                            mobile : mobile,
                            gender : gender,
                            state : state
                          })
                          
                          let saveUser = user.save()
                          if(saveUser){
                              res.redirect('/upload-picture')
                          }else{
                              throw{
                                  message : "Unable to save."
                              }
                          }

                    }
               }else{
                    res.redirect('/login')
               }
            }catch(err){
                res.send(err.message)
            }
        }
    ]

    getLogin = (req, res, next) => {
        try{
            if (req.session.email) {
                delete req.session.email
                res.render('login' , {title: 'Login to your account'})
            }else{
                res.render('login', {title : "Login to your account"})
            }
        }catch(err){
            res.send(err)
        }
    }

    postLogin = [
        sanitizeBody('*').escape() , 
        async (req , res , next) => {
            try { 
                let user = await User.findOne({email : req.body.email})
                let validUser = await bcrypt.compare(req.body.password , user.password)
                if (validUser) {
                    req.session.email = user.email 
                    res.redirect(303 , '/')
                }else {
                    res.render('login' , {title : "Login to your account", error : 'Invalid Login details'})
                }
            }catch(errors) {
                res.render('login' , {title : "Login to your account", error : 'Invaid Login details'})
            }
        }
    ]

}

let myApp = new App()
module.exports = myApp