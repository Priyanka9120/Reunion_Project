//===================== Importing Module and Packages =====================//
const FollowModel = require('../models/followModel.js')
const userModel = require('../models/userModel.js')
const validator = require('../validator/validator.js')



//<<<===================== This function is used for Create Follow =====================>>>//
const follow = async (req, res) => {

    try {
        let data = req.params
        let ownUserId = req.token.payload.userId
        //===================== Destructuring User Body Data =====================//
        let { id } = data

        //===================== Checking UsedId exist or not =====================//
        let userCheckExist = userModel.findById(id)
        if (!userCheckExist) return res.status(404).send({ status: false, message: `This UserId: ${id} is not exist!` })

        //===================== Checking the userId is Valid or Not by Mongoose =====================//
        if (!validator.isValidObjectId(id)) return res.status(400).send({ status: false, message: `This follow UserId: ${id} is not valid!` })

        //===================== Fetching data of Follow Data from DB and then update the field again for avoid duplicate follow =====================//
        const isDuplicateFollow = await FollowModel.findOneAndUpdate({ userID: ownUserId, followUserId: id }, { status: "follow" }, { new: true })
        if (isDuplicateFollow) {
            if (isDuplicateFollow.userID == ownUserId) { return res.status(200).send({ status: true, message: "Followed successfully", data: isDuplicateFollow }) }
        }

        //===================== Make a Object for create document =====================//
        let obj = {}
        obj.userID = ownUserId
        obj.followUserId = id
        obj.status = "follow"

        //x===================== Final Creation =====================x//
        let followCreate = await FollowModel.create(obj)

        return res.status(201).send({ status: true, message: "Followed successfully", data: followCreate })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}



//<<<===================== This function is used for Create Unfollow =====================>>>//
const unfollow = async (req, res) => {

    try {
        let data = req.params
        let ownUserId = req.token.payload.userId

        //===================== Destructuring User Body Data =====================//
        let { id } = data

        //===================== Checking UsedId exist or not =====================//
        let userCheckExist = userModel.findById(id)
        if (!userCheckExist) return res.status(404).send({ status: false, message: `This UserId: ${id} is not exist!` })

        //===================== Checking the userId is Valid or Not by Mongoose =====================//
        if (!validator.isValidObjectId(id)) return res.status(400).send({ status: false, message: `This unfollow UserId: ${id} is not valid!` })

        //===================== Fetching data of Follow Data from DB and then update the field again for avoid duplicate follow =====================//
        const isDuplicateUnFollow = await FollowModel.findOneAndUpdate({ userID: ownUserId, followUserId: id }, { status: "unfollow" }, { new: true })
        if (isDuplicateUnFollow) {
            if (isDuplicateUnFollow.userID == ownUserId) { return res.status(200).send({ status: true, message: "Unfollowed successfully", data: isDuplicateUnFollow }) }
        }

        //===================== Make a Object for create document =====================//
        let obj = {}
        obj.userID = ownUserId
        obj.followUserId = id
        obj.status = "unfollow"

        //x===================== Final Creation =====================x//
        let unFollowCreate = await FollowModel.create(obj)

        return res.status(201).send({ status: true, message: "Unfollowed successfully", data: unFollowCreate })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}



//<<<===================== This function is Get Followers and Followings =====================>>>//
const getFollowersAndFollowing = async (req, res) => {

    try {
        let ownUserId = req.token.payload.userId
        let userName = req.token.payload.userName

        let followers = await FollowModel.find({followUserId: ownUserId, status:"follow"}).count()
        let following = await FollowModel.find({userID: ownUserId, status:"follow"}).count()

        let obj = {}
        obj.userName = userName
        obj.followers  = followers
        obj.followings = following

        return res.status(200).send({ status: true, message: "Data fetch successfully", data: obj })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}



//===================== Module Export =====================//
module.exports = { follow, unfollow , getFollowersAndFollowing}