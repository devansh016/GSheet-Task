const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.get('/login', loginUser)
router.get('/googleauth', googleauth)

function loginUser(req, res, next){
    res.redirect(authController.getauthorizationUrl())
}

async function googleauth(req, res, next){
    if(req.query.error=="access_denied") {
        res.status(403).send({ message:"Access Denied."} )
    } else {
        const token = await authController.getaccesstoken(req.query.code)
        res.status(200).send({ message: "Login Success." })
    }
}
module.exports = router