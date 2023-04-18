//=====================Importing Module and Packages=====================//
const JWT = require('jsonwebtoken')
const userModel = require("../models/userModel")
const validator = require('../validator/validator.js')



//<<<===================== This function used for Authentication =====================>>>//
const Authentication = async (req, res, next) => {
    try {

        //===================== Check Presence of Key with Value in Header =====================//
        let token = req.headers['x-api-key']
        if (!token) { return res.status(400).send({ status: false, message: "Token must be Present." }) }

        //===================== Verify token & asigning it's value in request body =====================//
        JWT.verify(token, "Reunion-Company-Secret-Key-13579", function (error, decodedToken) {
            if (error) {
                return res.status(401).send({ status: false, message: "Invalid Token." })
            } else {
                req.token = decodedToken
                next()
            }
        })

    } catch (error) {

        res.status(500).send({ status: false, error: error.message })
    }
}



//<<<=====================This function used for Authorisation(Phase II)=====================>>>//
const Authorization = async (req, res, next) => {

    try {

        //<<<===================== Authorising with UserId form Body =====================>>>//
        let data = req.body
        let { userId } = data

        //===================== Checking the userId is Valid or Not by Mongoose =====================//
        if (!validator.isValidObjectId(userId)) return res.status(400).send({ status: false, message: `This userId: ${userId} is not valid or not exist inside body!` })

        //===================== Fetching All User Data from DB =====================//
        let UserData = await userModel.findById(userId)
        if (!UserData) return res.status(404).send({ status: false, message: "User Does Not Exist" })

        //x===================== Checking the userId is Authorized Person or Not =====================x//
        if (UserData['_id'].toString() !== req.token.payload.userId) {
            return res.status(403).send({ status: false, message: "Unauthorized User Access!" })
        }

        next()

    } catch (error) {

        res.status(500).send({ status: false, error: error.message })
    }
}



//================================= Module Export ==============================================//
module.exports = { Authentication, Authorization }