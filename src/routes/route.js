//---------------------- Importing Module and Packages ----------------------//
const express = require('express')
const router = express.Router()
const { Authentication, Authorization } = require('../middleware/auth.js')
const { createUser, userLogin } = require('../controller/userController.js')
const { follow, unfollow, getFollowersAndFollowing } = require('../controller/followController.js')
const { CreatePost, DeletePost, LikePost, UnlikePost, CommentPost, GetSinglePost, GetAllPost } = require('../controller/postController.js')
//<<<------------------------------------------------------------------->>>//



//---------------------- User's APIs ----------------------//
//---------------------- User Registration(Post API) ----------------------//
router.post("/register", createUser)
//---------------------- User Login(Post API) ----------------------//
router.post("/authenticate", userLogin)
//<<<------------------------------------------------------------------->>>//



//---------------------- Follow and Unfollow's APIs ----------------------//
//---------------------- Follow (Post API) ----------------------//
router.post("/follow/:id", Authentication, Authorization, follow)
//---------------------- Unfollow (Post API) ----------------------//
router.post("/unfollow/:id", Authentication, Authorization, unfollow)
//---------------------- Unfollow (Post API) ----------------------//
router.get("/user", Authentication, Authorization, getFollowersAndFollowing)
//<<<------------------------------------------------------------------->>>//



//---------------------- Post's APIs ----------------------//
//---------------------- Create Post (Post API) ----------------------//
router.post("/posts", Authentication, Authorization, CreatePost)
//---------------------- Delete Post (Delete API) ----------------------//
router.delete("/posts/:id", Authentication, Authorization, DeletePost)
//---------------------- Like Post (Get API) ----------------------//
router.post("/like/:id", Authentication, Authorization, LikePost)
//---------------------- Unlike Post (Get API) ----------------------//
router.post("/unlike/:id", Authentication, Authorization, UnlikePost)
//---------------------- Get Single Post (Get API) ----------------------//
router.post("/comment/:id", Authentication, Authorization, CommentPost)
//---------------------- Get Single Post (Get API) ----------------------//
router.get("/posts/:id", Authentication, Authorization, GetSinglePost)
//---------------------- Get All Post (Get API) ----------------------//
router.get("/all_posts", Authentication, Authorization, GetAllPost)
//<<<------------------------------------------------------------------->>>//



//---------------------- It will Handle error When You input Wrong Route =====================>>>//
router.all("/**", (req, res) => { return res.status(404).send({ status: false, msg: "This API request is not available!" }) })
//<<<------------------------------------------------------------------->>>//



//----------------------Module Export----------------------//
module.exports = router;
//<<<------------------------------------------------------------------->>>//
