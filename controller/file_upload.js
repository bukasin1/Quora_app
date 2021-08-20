
const multer = require('multer')

let fileStorage = multer.diskStorage({
	destination : function(req , file , cb) {
		cb(null , './public/profile')
	} , 
	filename : function(req , file , cb) { 
	    let fileName =  req.session.email + "-" + file.originalname 
		cb(null , fileName) 
	}
})

let fileUpload = multer({storage : fileStorage})
module.exports = fileUpload 