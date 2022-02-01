var express = require('express');
var router = express.Router();

const FileUpload = require('../controller/file_upload');
const IndexController = require('../controller/index_controller');
const UserController = require('../controller/user_controller');
const QuestionController = require('../controller/question_controller');


/* GET home page. */
router.get('/', IndexController.getIndex);
router.get('/login', IndexController.getLogin);
router.post('/login', IndexController.postLogin);
router.post('/login-signUp' , IndexController.postMailConfirmation)
router.get('/confirm-email', IndexController.getMailConfirmation);
router.post('/forgot-password', IndexController.forgotPassword)
router.get('/resetPassword/:token', IndexController.getResetPassword)
router.post('/resetPassword/:token', IndexController.postResetPassword)
router.post('/', IndexController.postMailConfirmation);
router.get('/signup/:mail', IndexController.getSignup);
router.post('/signup/:mail', IndexController.postSignup);
router.get('/upload-picture', UserController.getUploadPic);
router.post('/upload-picture',FileUpload.single('picture'), UserController.postUploadPic);
router.get('/questions/:categoryName', QuestionController.categoryQuestions);
router.get('/dashboard', UserController.getDashboard);
router.get('/profile/:userID', UserController.getOfflineProfile);
router.post('/profile/:userID', IndexController.postMailConfirmation);
router.get('/profile', UserController.getProfile);
router.post('/profile', FileUpload.single('picture'), UserController.updateProfile);
router.get('/logout', UserController.getLogout);
router.get('/create-question', QuestionController.getQuestion_form);
router.post('/create-question', QuestionController.postQuestion_form);
router.get('/my-questions', QuestionController.getQuestions);
router.get('/my-questions/:questionID/delete', QuestionController.deleteQuestion);
router.get('/:userName/:questionID', QuestionController.getSingleQuestion);
router.post('/:userName/:questionID', QuestionController.postSingleQuestion);
router.get('/:userName/:questionID/:answerID/delete', QuestionController.deleteAnswer);
router.get('/settings', UserController.getSettings)
// router.get()

module.exports = router;
