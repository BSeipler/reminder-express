const express = require("express");
const reminderController = require("./../controllers/reminderController");

const router = express.Router();

const {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  getCompletedReminders,
} = reminderController;

router
  .route("/")
  .get(getReminders)
  .post(createReminder)
  .patch(updateReminder)
  .delete(deleteReminder);

router.route("/completedReminders").get(getCompletedReminders);

//localhost:5000/users

module.exports = router;
