const User = require('../model/user')
const Question = require('../model/question')
const Categories = require('../model/categories')
//let categories = ["Technology" , "Science" , "Health" , "Education" , "Entertainment" , "Investing" , "Others"]

const { check, query, sanitizeParams, sanitizeQuery, validationResult } = require('express-validator')
const { sanitizeBody } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const sendMail = require('../utils/nodemailer')

class App {

    getIndex = async (req, res, next) => {
        try {
            if (req.session.email) {
                const user = await User.findOne({ email: req.session.email })
                const USER = await User.find()
                const question = await Question.find()
                const categories = await Categories.find()
                res.render('index', { title: "Dashboard", user: user, USERS: USER, questions: question, categories: categories })
            } else {
                const USER = await User.find()
                const question = await Question.find()
                const categories = await Categories.find()
                res.render('index', { title: "Quest-land", success: req.flash('success'), USERS: USER, questions: question, categories: categories })
            }

        } catch (err) {
            res.send(err)
        }
    }

    getMailConfirmation = async (req, res, next) => {
        const user = await User.findOne({ email: req.session.email })
        const USER = await User.find()
        const question = await Question.find()
        res.render('email-confirm', { title: "Confirm your email", success: req.flash('success'), user: user, USERS: USER, questions: question, categories: categories })
    }

    postMailConfirmation = [
        check('email').not().isEmpty().isEmail().normalizeEmail().trim()
            .withMessage('Please , provide a valid email ')
            .custom(value => {
                return User.findOne({ 'email': value }).then(user => {
                    if (user) {
                        return Promise.reject(`You've applied before.`)
                    }
                })
            }),
        async (req, res, next) => {
            try {
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    console.log(errors.errors)
                    req.flash('success', errors.errors.slice(-1)[0].msg)
                    if (req.params.userID) {
                        let url = '/profile/' + req.params.userID
                        res.redirect(url)
                    } else {
                        res.redirect('/')
                    }
                } else {
                    req.session.email = req.body.email
                    res.redirect('/signup/' + req.body.email)

                }
            } catch (errors) {

            }
        }
    ]

    getSignup = async (req, res, next) => {
        if (req.session.email) {
            const user = await User.findOne({ email: req.session.email })
            if (user) {
                res.redirect('/')
            } else {
                res.render('signup', { title: "Sign-up" })
            }
        } else {
            res.redirect('/login')
        }
    }

    postSignup = [
        // Backend Validations......

        //check('first_name').isLength({min : 3}).trim().withMessage('Name must be 3 characters and above'),
        //check('last_name').isLength({min : 3}).trim().withMessage('Name must be 3 characters and above'), 
        check('username').trim()
            .custom(value => {
                return User.findOne({ 'username': value }).then(user => {
                    if (user) {
                        return Promise.reject(`You've applied before.`)
                    }
                })
            }),
        async (req, res, next) => {
            try {
                if (req.session.email) {
                    const errors = validationResult(req)
                    if (!errors.isEmpty()) {
                        //res.render('signup' , {errors : errors.array()}) 
                        res.render('signup', { title: "Create an account", error: "Details already exist." })
                        return
                    } else {
                        const { firstName, lastName, username, dob, password, mobile, gender, state } = req.body
                        const userPass = await bcrypt.hash(password, 10)

                        const user = new User({
                            email: req.session.email,
                            firstName: firstName,
                            lastName: lastName,
                            username: username,
                            dateOfBirth: dob,
                            password: userPass,
                            mobile: mobile,
                            gender: gender,
                            state: state
                        })

                        let saveUser = user.save()
                        if (saveUser) {
                            res.redirect('/upload-picture')
                        } else {
                            throw {
                                message: "Unable to save."
                            }
                        }

                    }
                } else {
                    res.redirect('/login')
                }
            } catch (err) {
                res.send(err.message)
            }
        }
    ]

    getLogin = (req, res, next) => {
        try {
            if (req.session.email) {
                delete req.session.email
                res.render('login', { title: 'Login to your account' })
            } else {
                res.render('login', { title: "Login to your account", success: req.flash('success') })
            }
        } catch (err) {
            res.send(err)
        }
    }

    postLogin = [
        sanitizeBody('*').escape(),
        async (req, res, next) => {
            try {
                let user = await User.findOne({ email: req.body.email })
                let validUser = await bcrypt.compare(req.body.password, user.password)
                if (validUser) {
                    req.session.email = user.email
                    res.redirect(303, '/')
                } else {
                    res.render('login', { title: "Login to your account", error: 'Invalid Login details' })
                }
            } catch (errors) {
                res.render('login', { title: "Login to your account", error: 'Invaid Login details' })
            }
        }
    ]

    forgotPassword = [
        check('email').not().isEmpty().isEmail().normalizeEmail().trim()
            .withMessage('Please , provide a valid email '),
        async (req, res) => {
            try {
                const { email } = req.body
                const user = await User.findOne({ email: email })
                if (user) {
                    let secret = process.env.SECRET_KEY
                    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '30mins' });
                    const link = `${process.env.SITE_URL}/resetPassword/${token}`
                    const body = `
                  Dear ${user.fullname},
                  <p>Follow this <a href=${link}> link </a> to change your password. The link would expire in 30 mins.</P>
                        `
                    const mailResp = await sendMail(email, "Reset Password", body)
                    console.log(mailResp, "mail response")
                    req.flash('success', "Check your email for link to reset your password!")
                } else {
                    req.flash('success', "Please provide a valid email")
                }
                res.redirect('/login')
            } catch (error) {
                console.log(error)
                req.flash('success', "Error occured")
                res.redirect('/login')
            }
        }
    ]

    getResetPassword = async (req, res) => {
        try { //get

            let { token } = req.params
            console.log(token, "token-verify")
            let secret = process.env.SECRET_KEY
            const verification = await jwt.verify(token, secret)///verification
            console.log(verification, "verification")
            const id = verification.id
            const isValidId = User.findOne({ _id: id })
        
            if (isValidId) {
                //line missing?
                token = jwt.sign({ id: id }, secret, { expiresIn: '1d' })
                res.render("reset-password", {
                    title: "Reset-Password",
                    token: token, success: req.flash('success')
                })
            }
        } catch (err) {
            console.log(err, "error")
                req.flash('success', "Link Expired!!")
                res.redirect('/login')
        }
    }

    postResetPassword = async(req, res) => { //post
        const { token } = req.params
        console.log(token, "token-reset")
        try {
          // res.json(req.params)
          let secret = process.env.SECRET_KEY
          const verification = jwt.verify(token, secret)
          const id = verification.id
          if (verification) {
            const user = await User.findOne({ _id: id })
            if (user) {
              let { newPassword, repeatPassword } = req.body
              if (newPassword === repeatPassword) {
                newPassword = await bcrypt.hash(newPassword, 10);
                const updatedUser = await User.findOneAndUpdate({ _id: id }, { password: newPassword }, { new: true })
                req.flash('success', "Password resetted, login with new password")
                res.redirect('/login')
                return;
              } else {
                res.status(400).json({
                  message: "newpassword and repeatpassword don't match"
                })
                return;
              }
            } else {
              res.status(400).json({
                message: "user does not exist"
              })
              return;
            }
          }
          else {
            res.status(400).json({
              message: "verification error"
            })
            return;
          }
        } catch (err) {
          res.status(400).json({
            message: "This is the catch block message",
            // message: "Catch block",
            error: err.message
          })
          return;
        }
      }

}

let myApp = new App()
module.exports = myApp