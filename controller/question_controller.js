const Question = require('../model/question')
const User = require('../model/user')
const Categories = require('../model/categories')
//let categories = ["Technology" , "Science" , "Health" , "Education" , "Entertainment" , "Investing" , "Others"]

const {check ,query , sanitizeParams , sanitizeQuery ,  validationResult } = require('express-validator') 
const {sanitizeBody }  = require('express-validator')
const bcrypt           = require('bcryptjs')

class App {

    getQuestions = async(req, res, next) => {
        try{
            if(req.session.email){
                const user = await User.findOne({email : req.session.email})
                const question = await Question.find({user : user.email})
                const questions = await Question.find()
                const categories = await Categories.find()
                res.render('myQuestions', {title : "my Questions", userQuestions : question , questions : questions , categories : categories , user : user})
            }else{
                res.redirect('/login')  
            }
        }catch(err){
            res.send(err)
        }
    }

    categoryQuestions = async(req, res, next) => {
        try{
            if(req.session.email){
                const user = await User.findOne({email : req.session.email})
                const USER = await User.find()
                const questions = await Question.find()
                const categoryQuestions = await Question.find({category : req.params.categoryName})
                const categories = await Categories.find()
                res.render('category', {title : req.params.categoryName, user : user , USERS : USER , questions : questions , categoryQuestions : categoryQuestions , categories : categories , name : req.params.categoryName})
            }else{
                const USER = await User.find()
                const questions = await Question.find()
                const categoryQuestions = await Question.find({category : req.params.categoryName})
                const categories = await Categories.find()
                res.render('category', {title : req.params.categoryName , USERS : USER , questions : questions , categoryQuestions : categoryQuestions , categories : categories , name : req.params.categoryName})
            }

        }catch(err){
            res.send(err)
        }
    }

    getQuestion_form = async(req, res, next) => {
        try{
            if(req.session.email){
                const user = await User.findOne({email : req.session.email})
                const categories = await Categories.find()
                res.render('question-form' , {title : 'Create a Question' , user : user , categories : categories})
            }else{
                res.redirect('/login')  
            }
        }catch(err){
            res.send(err)
        }
    }

    getSingleQuestion = async(req, res, next) => {
        try{
            if(req.session.email){
                const user = await User.findOne({email : req.session.email})
                const use = await User.findOne({username : req.params.userName})
                const USER = await User.find()
                const question = await Question.findOne({_id : req.params.questionID})
                const questions = await Question.find()
                const categories = await Categories.find()
                console.log(use)
                res.render('single-question', {title : question.title, question : question ,questions : questions, categories : categories , user : user , USERS : USER , use : use})
            }else{
                const use = await User.findOne({username : req.params.userName})
                const USER = await User.find()
                const question = await Question.findOne({_id : req.params.questionID})
                const questions = await Question.find()
                const categories = await Categories.find()
                res.render('single-question', {title : question.title, question : question ,questions : questions, categories : categories , use : use , USERS : USER  , success : req.flash('success')})
            }

        }catch(err){
            res.send(err)
        }
    }

    postSingleQuestion = [
        check('email').not().isEmpty().isEmail().trim()
        .withMessage('Please , provide a valid email ')
        .custom(value => {
            return User.findOne({'email' : value}).then(user => {
                if (user ) {
                    return Promise.reject(`User already exists`)	
                }
            })
        }),
        async (req, res, next) => {
            console.log(req.body)
            try{
                if(req.body.details){
                    if(req.session.email){
                        const user = await User.findOne({email : req.session.email})
                        const use = await User.findOne({username : req.params.userName})
                        
                            let mapIt =  {user : user.email, comment : req.body.details}
                            
                            Question.findByIdAndUpdate(req.params.questionID, {
                                $addToSet : {answers : mapIt}
                            }, {new : true, useFindAndModify : false}, (err, item) => {
                                if(err){
                                    console.log(err)
                                }else{
                                    let url = '/' + req.params.userName + '/' + req.params.questionID
                                    res.redirect(url)
                                }
                            })
                       
                    }else{
                        let url = '/' + req.params.userName + '/' + req.params.questionID
                        req.flash('success', "__")
                        res.redirect(url)
                    }
                }else{
                    const errors = validationResult(req)
                    if(!errors.isEmpty()) {
                        console.log(errors.errors)
                        req.flash('success', errors.errors[0].msg)
                        if(req.params.userName){
                            let url = '/' + req.params.userName + '/' + req.params.questionID
                            res.redirect(url)
                        }else{
                            res.redirect('/')
                        }
                    }else{ 
                            req.session.email = req.body.email
                            res.redirect('/signup/' + req.body.email)
                        
                    }
                }
            }catch(err){
                res.send(err)
            }
        }
    ]

    deleteAnswer = async (req, res, next) => {
        if(req.session.email){
            try{
                const user1 = await User.findOne({username : req.params.userName})
                console.log(user1)
                if(user1.email === req.session.email){
                    const question = await Question.findOne({_id : req.params.questionID})
                    if(question){
                        let answer = question.answers
                        let mapIt = answer.find( elem => elem._id == req.params.answerID)
                        const user = await User.findOne({email : question.user})
                        Question.findByIdAndUpdate(question._id, {
                            $pullAll : {
                                answers : [mapIt] }
                        }, {new : true, useAndModify : false}, (err , item) => {
                            if(err){
                                res.status(500)
                                return
                            }else {
                                
                                let url = '/' + user.username + '/' + req.params.questionID
                                res.redirect(url)
                            }
                        })
                    }
                }else{
                    const question = await Question.findOne({_id : req.params.questionID})
                    const user = await User.findOne({email : question.user})
                    let url = '/' + user.username + '/' + req.params.questionID
                    req.flash('success', "Sign in to make a contribution or signup if not registered  yet")
                    res.redirect(url)
                } 
                
            }catch(err){
                res.send(err)
            }
        }else{
            res.redirect(303, '/login')
        }
    }

    postQuestion_form = async(req , res , next) => {
        try{
            const user = await User.findOne({email : req.session.email})
            const categories = await Categories.find()
            let cat = req.body.category
            let entry
            if(cat !== 'Others'){
                const category = await Categories.findOne({name : req.body.category})
                if(!category){
                    let catgEntry = new Categories ({
                        name : req.body.category
                    })
                    catgEntry.save()
                }
                entry = new Question ({
                    title : req.body.title,
                    category : req.body.category,
                    details : req.body.details,
                    user : user.email
                })
            }else{
                //categories[categories.length - 2] = req.body.category2
                const category = await Categories.findOne({name : req.body.category2})
                if(!category){
                    let catgEntry = new Categories ({
                        name : req.body.category2
                    })
                    catgEntry.save()
                }
                entry = new Question ({
                    title : req.body.title,
                    category : req.body.category2,
                    details : req.body.details,
                    user : user.email
                })
                console.log(categories)
            }
            let saveDiary = entry.save()
            if(saveDiary){
                res.redirect('/')
            }else{
                res.render('question-form' , {message : "Unable to save" , title : 'Create a Question' , user : user , categories : categories})
            }
        }catch(err){
            res.send(err)
        }
    }

    deleteQuestion = (req , res, next) => {

        Question.findByIdAndDelete(req.params.questionID, err => {
            if(err){
                res.send(err)
            }else{
                res.redirect('/my-questions')
            }
        })
    }

    editRecord = async (req , res , next) => {
        let entry = await Record.findOne({_id : req.params.recordID})
        let user = await User.findOne({email : req.session.email})
        res.render('editRecord_form' , {title : 'edit record' , record : entry , user : user})
    }

    postRecord = async (req , res , next) => {
        let ent = await Record.findOne({_id : req.params.recordID})
        let user = await User.findOne({email : req.session.email})
        Record.findByIdAndUpdate(req.params.recordID, {
            details : req.body.details,
            updateDate : Date.now()
        }, {new : true, useAndModify : false}, (err, item) => {
            if(err){
                res.send(err)
            }else{
                res.redirect('/diary')
            }
        })
    }
}


let myApp = new App()
module.exports = myApp