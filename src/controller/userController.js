//===================== Importing Module and Packages =====================//
const JWT = require('jsonwebtoken')
const bcrypt = require("bcrypt")
const userModel = require('../models/userModel.js')
const validator = require('../validator/validator.js')
const saltRounds = 10



//<<<===================== This function is used for Create User =====================>>>//
const createUser = async (req, res) => {

    try {

        let data = req.body

        //===================== Destructuring User Body Data =====================//
        let { name, email, phone, password,...rest } = data

        //===================== Checking User Body Data =====================//
        if (!validator.checkInputsPresent(data)) return res.status(400).send({ status: false, message: "No data found from body! You need to put the Mandatory Fields (i.e. fname, lname, email, profileImage, phone, password & address). " });
        if (validator.checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You can input only fname, lname, email, profileImage, phone, password & address." }) }

        //===================== Validation of Data =====================//
        if (!validator.isValidBody(name)) { return res.status(400).send({ status: false, message: 'Please enter fname' }) }
        if (!validator.isValidName(name)) { return res.status(400).send({ status: false, message: 'fname should be in Alphabets' }) }

        if (!validator.isValidBody(email)) { return res.status(400).send({ status: false, message: 'Please enter the EmailId' }) }
        if (!validator.isValidEmail(email)) { return res.status(400).send({ status: false, message: 'Please enter valid emailId' }) }

        if (!validator.isValidBody(password)) { return res.status(400).send({ status: false, message: 'Please enter the password' }) }
        if (!validator.isValidpassword(password)) { return res.status(400).send({ status: false, message: "To make strong Password Should be use 8 to 15 Characters which including letters, atleast one special character and at least one Number." }) }

        //===================== Fetching data of Email from DB and Checking Duplicate Email present or not =====================//
        const isDuplicateEmail = await userModel.findOne({ email: email })
        if (isDuplicateEmail) {
            if (isDuplicateEmail.email == email) { return res.status(400).send({ status: false, message: `This EmailId: ${email} is already exist!` }) }
        }

        //===================== Encrept the password by thye help of Bcrypt =====================//
        data.password = await bcrypt.hash(password, saltRounds)

        //x===================== Final Creation of User =====================x//
        let userCreated = await userModel.create(data)

        return res.status(201).send({ status: true, message: "User created successfully", data: userCreated })

    } catch (error) {

        return res.status(500).send({ status: false, error: error.message })
    }
}



//<<<===================== This function is used for Login the User =====================>>>//
const userLogin = async function (req, res) {

    try {

        let data = req.body

        //===================== Destructuring User Body Data =====================//
        let { email, password, ...rest } = data

        //=====================Checking User input is Present or Not =====================//
        if (!validator.checkInputsPresent(data)) return res.status(400).send({ status: false, message: "You have to input email and password." });
        if (validator.checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You can enter only email and password." }) }

        //=====================Checking Format of Email & Password by the help of Regex=====================//
        if (!validator.isValidBody(email)) return res.status(400).send({ status: false, message: "EmailId required to login" })
        if (!validator.isValidEmail(email)) { return res.status(400).send({ status: false, message: "Invalid EmailID Format or Please input all letters in lowercase." }) }

        if (!validator.isValidBody(password)) return res.status(400).send({ status: false, message: "Password required to login" })
        if (!validator.isValidpassword(password)) { return res.status(400).send({ status: false, message: "Invalid Password Format! Password Should be 8 to 15 Characters and have a mixture of uppercase and lowercase letters and contain one symbol and then at least one Number." }) }

        //===================== Fetch Data from DB =====================//
        const userData = await userModel.findOne({ email: email })
        if (!userData) { return res.status(401).send({ status: false, message: "Invalid Login Credentials! You need to register first." }) }

        //===================== Decrypt the Password and Compare the password with User input =====================//
        let checkPassword = await bcrypt.compare(password, userData.password)

        if (checkPassword) {

            let payload = {
                userId: userData['_id'].toString(),
                userName: userData['name'],
                Company: 'Reunion Company',
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
            }

            const token = JWT.sign({ payload }, "Reunion-Company-Secret-Key-13579", { expiresIn: 60 * 60 * 24 });

            //=====================Create a Object for Response=====================//
            let obj = { userId: userData['_id'], token: token }

            return res.status(200).send({ status: true, message: 'User login successfull', data: obj })

        } else {

            return res.status(401).send({ status: false, message: 'Wrong Password' })
        }

    } catch (error) {

        return res.status(500).send({ status: false, error: error.message })
    }
}



//===================== Module Export =====================//
module.exports = { createUser, userLogin }