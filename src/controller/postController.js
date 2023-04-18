//===================== Importing Module and Packages =====================//
const FollowModel = require('../models/followModel.js')
const userModel = require('../models/userModel.js')
const postModel = require('../models/postModel.js')
const validator = require('../validator/validator.js')



//<<<===================== This function is create Post =====================>>>//
const CreatePost = async (req, res) => {

    try {
        let data = req.body

        //===================== Destructuring User Body Data =====================//
        let { title, description, userId, ...rest } = data

        //===================== Checking User Body Data =====================//
        if (!validator.checkInputsPresent(data)) return res.status(400).send({ status: false, message: "No data found from body! You need to put the Mandatory Fields (i.e. title, description). " });
        if (validator.checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You can input only title, description." }) }

        //x===================== Final Creation Post =====================x//
        let postCreated = await postModel.create(data)

        return res.status(201).send({ status: true, message: "Post created successfully", data: postCreated })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}



//<<<===================== This function is create Post =====================>>>//
const DeletePost = async (req, res) => {

    try {
        let data = req.body
        let dataParams = req.params
        let ownUserId = req.token.payload.userId

        //===================== Destructuring User Body Data =====================//
        let { id } = dataParams
        let { title, description, userId, ...rest } = data

        //===================== Checking User Body Data =====================//
        if (!validator.checkInputsPresent(data)) return res.status(400).send({ status: false, message: "No data found from body! You need to put the Mandatory Fields (i.e. title, description). " });
        if (validator.checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You can input only title, description." }) }

        //x===================== Final Creation Post =====================x//
        let deletePost = await postModel.findOneAndUpdate({ _id: id, userId: ownUserId }, { isDeleted: true })
        if (!deletePost) return res.status(404).send({ status: false, message: "Post not available" })

        return res.status(200).send({ status: true, message: "Post deleted successfully" })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}



//<<<===================== This function is create Post =====================>>>//
const LikePost = async (req, res) => {

    try {
        let data = req.body
        let dataParams = req.params
        let ownUserId = req.token.payload.userId

        //===================== Destructuring User Body Data =====================//
        let { id } = dataParams
        let { userId, ...rest } = data

        //===================== Checking User Body Data =====================//
        if (!validator.checkInputsPresent(data)) return res.status(400).send({ status: false, message: "No data found from body! You need to put the Mandatory Fields (i.e. userId). " });
        if (validator.checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You can input only userId." }) }

        let postData

        //x===================== Avoid Duplicate Like =====================x//
        let checkPostLiked = await postModel.findOneAndUpdate({ _id: id, likes: { $elemMatch: { userId: ownUserId } } }, { $set: { likes: { userId: ownUserId, status: "like" } } }, { new: true })
        postData = checkPostLiked

        //x===================== Like Post =====================x//
        if (!checkPostLiked) {
            let postLiked = await postModel.findOneAndUpdate({ _id: id }, { $push: { likes: { userId: ownUserId, status: "like" } } }, { new: true })
            postData = postLiked
        }

        if (!postData) return res.status(404).send({ status: false, message: "Post not available" })

        return res.status(200).send({ status: true, message: "Liked", data: postData })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}



//<<<===================== This function is create Post =====================>>>//
const UnlikePost = async (req, res) => {

    try {
        let data = req.body
        let dataParams = req.params
        let ownUserId = req.token.payload.userId

        //===================== Destructuring User Body Data =====================//
        let { id } = dataParams
        let { userId, ...rest } = data

        //===================== Checking User Body Data =====================//
        if (!validator.checkInputsPresent(data)) return res.status(400).send({ status: false, message: "No data found from body! You need to put the Mandatory Fields (i.e. userId). " });
        if (validator.checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You can input only userId." }) }

        let postData

        //x===================== Avoid Duplicate Unlike =====================x//
        let checkPostUnLiked = await postModel.findOneAndUpdate({ _id: id, likes: { $elemMatch: { userId: ownUserId } } }, { $set: { likes: { userId: ownUserId, status: "unlike" } } }, { new: true })
        postData = checkPostUnLiked

        //x===================== Unlike Post =====================x//
        if (!checkPostUnLiked) {
            let postUnLiked = await postModel.findOneAndUpdate({ _id: id }, { $push: { likes: { userId: ownUserId, status: "unlike" } } }, { new: true })
            postData = postUnLiked
        }

        if (!postData) return res.status(404).send({ status: false, message: "Post not available" })

        return res.status(200).send({ status: true, message: "Unliked", data: postData })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}



//<<<===================== This function is create Post =====================>>>//
const CommentPost = async (req, res) => {

    try {
        let data = req.body
        let dataParams = req.params
        let ownUserId = req.token.payload.userId

        //===================== Destructuring User Body Data =====================//
        let { id } = dataParams
        let { comment, userId, ...rest } = data

        //===================== Checking User Body Data =====================//
        if (!validator.checkInputsPresent(data)) return res.status(400).send({ status: false, message: "No data found from body! You need to put the Mandatory Fields (i.e. userId). " });
        if (validator.checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You can input only userId." }) }


        //x===================== Comment in a Post =====================x//
        let postComment = await postModel.findOneAndUpdate({ _id: id }, { $push: { comments: { userId: ownUserId, comment: comment } } }, { new: true })
        if (!postComment) return res.status(404).send({ status: false, message: "Post not available" })

        return res.status(200).send({ status: true, message: "Comment post successfully", data: postComment })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}



//<<<===================== This function is create Post =====================>>>//
const GetSinglePost = async (req, res) => {

    try {
        let data = req.body
        let dataParams = req.params
        let ownUserId = req.token.payload.userId

        //===================== Destructuring User Body Data =====================//
        let { id } = dataParams
        let { title, description, userId, ...rest } = data

        //===================== Checking User Body Data =====================//
        if (!validator.checkInputsPresent(data)) return res.status(400).send({ status: false, message: "No data found from body! You need to put the Mandatory Fields (i.e. userId). " });
        if (validator.checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You can input only userId." }) }

        //x===================== Final Creation Post =====================x//
        let getSinglePost = await postModel.findOne({ _id: id, userId: ownUserId, isDeleted: false })
        if (!getSinglePost) return res.status(404).send({ status: false, message: "Post not available" })


        let getLikes = getSinglePost.likes
        let likeCounts = 0

        for (let i = 0; i < getLikes.length; i++) {
            if (getLikes[i].status == 'like') {
                likeCounts++
            }
        }

        let obj = {}
        obj.id = getSinglePost['_id']
        obj.title = getSinglePost['title']
        obj.desc = getSinglePost['description']
        obj.created_at = getSinglePost['createdAt']
        obj.comments = getSinglePost['comments']
        obj.likes = likeCounts

        return res.status(200).send({ status: true, message: "Post fetched successfully", data: obj })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}



//<<<===================== This function is create Post =====================>>>//
const GetAllPost = async (req, res) => {

    try {
        let data = req.body
        let ownUserId = req.token.payload.userId

        //===================== Destructuring User Body Data =====================//
        let { userId, ...rest } = data

        //===================== Checking User Body Data =====================//
        if (!validator.checkInputsPresent(data)) return res.status(400).send({ status: false, message: "No data found from body! You need to put the Mandatory Fields (i.e. userId). " });
        if (validator.checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You can input only userId." }) }

        //x===================== Final Creation Post =====================x//
        let getAllPost = await postModel.find({ userId: ownUserId, isDeleted: false })
        if (getAllPost.length == 0) return res.status(404).send({ status: false, message: "Post not available" })

        let arrayGetAllPost = []
        
        for (let i = 0; i < getAllPost.length; i++) {
            let likeCounts = 0, obj = {}

            obj.id = getAllPost[i]['_id']
            obj.title = getAllPost[i]['title']
            obj.desc = getAllPost[i]['description']
            obj.created_at = getAllPost[i]['createdAt']
            obj.comments = getAllPost[i]['comments']

            for (let j = 0; j < getAllPost[i].likes.length; j++) {
                if (getAllPost[i].likes[j].status == 'like') {
                    likeCounts++
                }
            }

            obj.likes = likeCounts
            arrayGetAllPost.push(obj)

        }

        return res.status(200).send({ status: true, message: "All post fetched successfully", data: arrayGetAllPost })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}



//===================== Module Export =====================//
module.exports = { CreatePost, DeletePost, LikePost, UnlikePost, CommentPost, GetSinglePost, GetAllPost }