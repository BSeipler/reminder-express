const express = require('express')
const userController = require('./../controllers/userController')

const app = express()

const {
  getUsers,
  createUser,
  userLogin,
  updateUser,
  deleteUser,
  oneUser
} = userController

const router = express.Router()

router
  .route('/')
  .get(getUsers)
  .post(createUser)
  .patch(updateUser)
  .delete(deleteUser)

router.route('/login').post(userLogin)

router.route('/oneUser').get(oneUser)

module.exports = router
