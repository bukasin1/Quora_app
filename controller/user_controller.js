
const User = require('../model/user')
const Question = require('../model/question')
let categories = ["Technology" , "Science" , "Health" , "Education" , "Entertainment" , "Investing" , "Others"]

const {sanitizeBody }  = require('express-validator')
const bcrypt           = require('bcryptjs')

class App {

    getUploadPic = async (req, res, next) => {
        try{
            if(req.session.email){
                const user = await User.findOne({email : req.session.email})
                console.log(user)
                res.render('upload-profile-pic', {title : "Picture upload", user : user})
            }else{
                res.redirect('/login')  
            }
        }catch(err){
            res.send(err)
        }
    }

    postUploadPic =  async (req , res , next) => {
        try{
            if(req.session.email){
                let user = await User.findOne({email : req.session.email})
                const {firstName , lastName, username, mobile, gender, state, picture}  = req.body
                    User.findOneAndUpdate({email : req.session.email}, {
                        profilePhoto : req.session.email + "-" + req.file.originalname
                    }, {new : true, useAndModify : false}, (err, item) => {
                        if(err){
                            throw{
                                message : 'Error updating files'
                            }
                        }else{
                            res.redirect('/')
                        }
                    })
            }else{
                res.redirect('/login')
            }
        }catch(err){
            res.send(err)
        }
    }

    getDashboard = async (req, res, next) => {
        try{
            if(req.session.email){
                const user = await User.findOne({email : req.session.email})
                const USER = await User.find()
                const question = await Question.find()
                res.render('dashboard', {title : "Dashboard", user : user , USERS : USER , questions : question , categories : categories})
            }else{
                res.redirect('/login')  
            }
        }catch(err){
            res.send(err)
        }
    }

    getOfflineProfile = async (req, res, next) => {
        try{
            if(req.session.email){
                const user = await User.findOne({_id : req.params.userID})
                if(user.email === req.session.email){
                    const user = await User.findOne({email : req.session.email})
                    res.render('userProfile', {title : user.username, user : user})
                }else{
                    const user1 = await User.findOne({_id : req.params.userID})
                    const user = await User.findOne({email : req.session.email})
                    res.render('userOfflineProfile', {title : user1.username, user1 : user1, user : user})
                }
            }else{
                const user = await User.findOne({_id : req.params.userID})
                res.render('offlineProfile', {title : user.username, success : req.flash('success'), user : user})  
            }
        }catch(err){
            res.send(err)
        }
    }

    getProfile = async (req, res, next) => {
        try{
            if(req.session.email){
                const user = await User.findOne({email : req.session.email})
                res.render('profile', {title : "Profile", user : user})
            }else{
                res.redirect('/login')  
            }
        }catch(err){
            res.send(err)
        }
    }

    updateProfile = [
        sanitizeBody('*').escape() , 
        async (req , res , next) => {
            try{
                if(req.session.email){
                    let user = await User.findOne({email : req.session.email})
                    const {firstName , lastName, username, mobile, gender, state}  = req.body
                    if(req.file){
                        console.log(user)
                        User.findByIdAndUpdate(user._id, {
                            firstName : firstName,
                            lastName : lastName,
                            username : username,
                            mobile : mobile,
                            gender : gender,
                            state : state,
                            profilePhoto : req.session.email + "-" + req.file.originalname
                        }, {new : true, useAndModify : false}, (err, item) => {
                            if(err){
                                throw{
                                    message : 'Error updating files'
                                }
                            }else{
                                res.redirect('/profile')
                            }
                        })
                    }else{
                        User.findOneAndUpdate({email : req.session.email}, {
                            firstName : firstName,
                            lastName : lastName,
                            username : username,
                            mobile : mobile,
                            gender : gender,
                            state : state
                        }, {new : true, useAndModify : false}, (err, item) => {
                            if(err){
                                throw{
                                    message : 'Error updating files'
                                }
                            }else{
                                res.redirect('/profile')
                            }
                        })
                    }
                    
                }else{
                    res.redirect('/login')
                }
            }catch(err){
                res.send(err)
            }
        }
    ]

    getLogout = (req , res , next ) => {
        try {
            if (req.session.email) {
                delete req.session.email
                res.redirect(303 , '/')
            }else {
                throw new Error("Problem signing out. We will handle this shortly")
            }
        }catch(error) {
            console.log(error, 'error logging out')
            res.redirect(303 , '/')
        }
    }

    getSettings = async(req , res , next) => {
        let user =  await User.findOne({email : req.session.email})
        try{
            if(req.session.email) {
                res.render('settings' , {title : 'settings', user : user})
            }else {
                res.redirect('/login')
            }
        }catch(err){
            res.send(err)
        }
    }

    getPass_change = async(req , res , next) => {
        try{
            if(req.session.email) {
                let user =  await User.findOne({email : req.session.email})
                res.render('pass_edit_form' , {title : 'password settings', user : user})
            }else {
                res.redirect('/login')
            }
        }catch(err){
            res.send(err)
        }
    }

    postPass_change = [
        sanitizeBody('*').escape() ,
        async (req, res, next) => {
            try{
                let user = await User.findOne({email : req.session.email})
                let validUser = await bcrypt.compare(req.body.oldPassword , user.password)
                if (validUser) {
                    const userPass = await bcrypt.hash(req.body.newPassword , 10)
                    User.findOneAndUpdate({email : req.session.email}, {
                        password : userPass
                    }, {new : true, useAndModify : false}, (err, item) => {
                        if(err){
                            throw{
                                message : 'Error updating files'
                            }
                        }else{
                            res.render('pass_edit_form' , {title : 'password settings', user : user , mess : 'Password successfully changed !'})
                        }
                    })
                }else {
                    res.render('pass_edit_form' , {title : 'password settings', user : user , mess : 'The old password you entered is wrong'})
                }
            }catch(err){
                res.send(err)
            }
        }
    ]

}

let myApp = new App()
module.exports = myApp