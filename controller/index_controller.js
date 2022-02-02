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
                console.log("NEtered index")
                let success = "", link
                const user = await User.findOne({ email: req.session.email })
                const USER = await User.find()
                const question = await Question.find()
                const categories = await Categories.find()
                if(!user.verified){
                    link = `${process.env.SITE_URL}/sendConfirmationMail`
                    success = "Email not verified yet"
                    console.log(success, "unverifies entered")
                    // console.log(req.flash("success").toString().length, "flash success", req.flash("success").toString().length, typeof req.flash("success").toString(), `This is flash: ${req.flash("success").toString()}` )
                    success = req.flash("success").toString()
                    if(success.length <= 0) success = "Email not verified yet"
                    console.log(success, "success sent")
                }
                res.render('index', { title: "Dashboard", user: user, USERS: USER, questions: question, categories: categories, success, link })
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

    sendConfirmationMail = async(req, res) => {
        try{
            if(req.session.email){
                const user = await User.findOne({ email: req.session.email })
                let secret = process.env.SECRET_KEY
                const token = jwt.sign({ id: user._id }, secret, { expiresIn: '60mins' });
                const link = `${process.env.SITE_URL}/verifyEmail/${token}`
                const body = `
            Dear ${user.firstName},
            <p>Welcome to Quest Land</P>
            <p>Follow this <a href=${link}> link </a> to verify your email. Link expires in 1 hour</P>
                    `
                const mailResp = await sendMail(req.session.email, "Verify Email", body)
                console.log(mailResp, "mail response")
                if(!mailResp.error) req.flash('success', "Confirmation Email sent, check your email")
                else req.flash('success', "Error occured somewhere")
                res.redirect('/')
            }else{
                res.redirect('/login')
            }
        }catch(error){
            console.log(err)
            req.flash('success', "Error occured somewhere")
            res.redirect('/')
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
                    // req.session.email = req.body.email
                    res.redirect('/signup/' + req.body.email)

                }
            } catch (errors) {

            }
        }
    ]

    getSignup = async (req, res, next) => {
        // if (req.session.email) {
            const user = await User.findOne({ email: req.session.email })
            if (user) {
                res.redirect('/')
            } else {
                res.render('signup', { title: "Sign-up" })
            }
        // } else {
        //     res.redirect('/login')
        // }
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
                // if (req.session.email) {
                    const errors = validationResult(req)
                    if (!errors.isEmpty()) {
                        //res.render('signup' , {errors : errors.array()}) 
                        res.render('signup', { title: "Create an account", error: "Details already exist." })
                        return
                    } else {
                        const { firstName, lastName, username, dob, password, mobile, gender, state } = req.body
                        const userPass = await bcrypt.hash(password, 10)

                        const user = new User({
                            email: req.params.mail,
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
                            let secret = process.env.SECRET_KEY
                            const token = jwt.sign({ id: user._id }, secret, { expiresIn: '60mins' });
                            const link = `${process.env.SITE_URL}/verifyEmail/${token}`
                            const body = `
                        Dear ${user.firstName},
                        <p>Welcome to Quest Land</P>
                        <p>Follow this <a href=${link}> link </a> to verify your email. Link expires in 1 hour</P>
                                `
                            const mailResp = await sendMail(req.params.mail, "Verify Email", body)
                            console.log(mailResp, "mail response")
                            if(!mailResp.error) req.flash('success', "Confirmation Email sent, check your email. Login to continue.")
                            else req.flash('success', "Error occured")
                            res.redirect('/login')
                        } else {
                            throw {
                                message: "Unable to save."
                            }
                        }

                    }
                // } else {
                //     res.redirect('/login')
                // }
            } catch (err) {
                console.log(err)
                req.flash('success', "Error occured")
                res.redirect('/login')
            }
        }
    ]

    verifyEmail = async (req, res) => {
        try { //get

            let { token } = req.params
            console.log(token, "token-verify")
            let secret = process.env.SECRET_KEY
            const verification = jwt.verify(token, secret)///verification
            console.log(verification, "verification")
            const id = verification.id
            const isValidId = await User.findOne({ _id: id })
            console.log(isValidId, "user found")

            if (isValidId) {
                //line missing?
                isValidId.verified = true
                await isValidId.save()
                req.flash('success', "Email verified!, login to continue.")
                res.redirect('/login')
            }
        } catch (err) {
            console.log(err, "error")
            req.flash('success', "Link Expired!!")
            res.redirect('/login')
        }
    }

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
                    res.render('login', { title: "Login to your account", error: 'Invalid Login details', success: req.flash('success') })
                }
            } catch (errors) {
                res.render('login', { title: "Login to your account", error: 'Invaid Login details', success: req.flash('success') })
            }
        }
    ]

    forgotPassword = [
        check('email').not().isEmpty().isEmail().normalizeEmail().trim()
            .withMessage('Please , provide a valid email '),
        async (req, res) => {
            try {
                const errors = validationResult(req)
                if (errors.isEmpty()) {
                    const { email } = req.body
                    const user = await User.findOne({ email: email })
                    if (user) {
                        let secret = process.env.SECRET_KEY
                        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '30mins' });
                        const link = `${process.env.SITE_URL}/resetPassword/${token}`
                        const body = `
                    Dear ${user.firstName},
                    <p>Follow this <a href=${link}> link </a> to change your password. The link would expire in 30 mins.</P>
                            `
                        const mailResp = await sendMail(email, "Reset Password", body)
                        console.log(mailResp, "mail response")
                        if(!mailResp.error) req.flash('success', "Check your email for link to reset your password!")
                        else req.flash('success', "Error occured")
                    } else {
                        req.flash('success', "Email not registered yet")
                    }
                } else {
                    req.flash('success', errors.errors.slice(-1)[0].msg)
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
            const verification = jwt.verify(token, secret)///verification
            console.log(verification, "verification")
            const id = verification.id
            const isValidId = User.findOne({ _id: id })

            if (isValidId) {
                //line missing?
                token = jwt.sign({ id: id }, secret, { expiresIn: '1d' })
                res.render("reset-password", { title: "Reset-Password", token: token, success: req.flash('success') })
            }
        } catch (err) {
            console.log(err, "error")
            req.flash('success', "Link Expired!!")
            res.redirect('/login')
        }
    }

    postResetPassword = async (req, res) => { //post
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
                        res.render("reset-password", { title: "Reset-Password", token: token, error: "Passwords don't match", success: req.flash('success') })
                        // req.flash('success', "newpassword and repeatpassword don't match")
                        // res.redirect(`/resetPassword/${token}`)
                        return;
                    }
                } else {
                    // res.render("reset-password", { title: "Reset-Password", token: token, error: "Broken link!", success: req.flash('success') })
                    req.flash('success', "Broken link!")
                    res.redirect(`/resetPassword/${token}`)
                    return;
                }
            }
            else {
                // res.render("reset-password", { title: "Reset-Password", token: token, error: "Broken link!", success: req.flash('success') })
                req.flash('success', "Broken link!")
                res.redirect(`/resetPassword/${token}`)
                return;
            }
        } catch (err) {
            // res.render("reset-password", { title: "Reset-Password", token: token, error: "Broken link!", success: req.flash('success') })
            req.flash('success', "Broken link!")
            res.redirect(`/resetPassword/${token}`)
            return;
        }
    }

}

let myApp = new App()
module.exports = myApp