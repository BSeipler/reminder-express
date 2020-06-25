const User = require("./../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authController = require("./authController");
const { decode } = authController;
const nodemailer = require("nodemailer");

// This is an added comment

/*******************************************
 Get All Users
 *******************************************/

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.log(error.message);
  }
};

/*******************************************
 Register New User
 *******************************************/

exports.createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    // check if user is in the database
    const doesExist = await User.exists({ email: email });
    // if already exists, send back "Email already exists" : else add them to the database
    if (doesExist) {
      res.send("Email already exists");
    } else {
      // encrypting the password
      const hash = await bcrypt.hash(password, 10);
      // creating a new user in the database
      const newUser = await User.create({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hash,
      });

      // create "payload"
      const payload = {
        email: email,
      };
      // sign the token (create)
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      // // SEND THE WELCOME EMAIL
      // // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.webfaction.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      //
      // // send mail with defined transport object
      let info = await transporter.sendMail({
        from: `"Welcome Team" <blake@jaxcode.com>`, // sender address
        to: `${email}`, // list of receivers
        subject: "Welcome to Reminders!", // Subject line
        text: "This is your welcome email!", // plain text body
        html: "<p>Thank you for signing up at Reminders.com!</p>", // html body
      });
      // send the token back to the client (browser)
      res.status(200).send({
        success: true,
        message: "New User Created",
        data: {
          token,
        },
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

/*******************************************
 Login User
 *******************************************/
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    // check if user exists in the database
    const doesExist = await User.exists({ email: email });
    // if they do exist
    if (doesExist) {
      // grab them from the database
      const user = await User.find({ email: email });
      //compare the passwords
      const match = await bcrypt.compare(password, user[0].password);
      // if the passwords match, send back "Logged In" : else send back "Credentials do not match"
      if (match) {
        // create "payload"
        const payload = {
          email: email,
        };
        // sign the token (create)
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        // send the token to the client
        res.status(200).send({
          success: true,
          login: true,
          data: {
            token: token,
          },
        });
      } else {
        res.status(200).send({
          success: true,
          login: false,
          message: "Credentials do not match",
        });
      }
    } else {
      // if the user does not exist, prompt them to create an account
      res.status(200).send({
        success: true,
        message: "Please create an account",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

/*******************************************
 Update User
 *******************************************/
exports.updateUser = async (req, res) => {
  try {
    // the email from the token
    const email = await decode(req.headers);
    const { firstname, lastname } = req.body;
    const user = await User.updateOne(
      { email: email },
      { firstname: firstname, lastname: lastname }
    );
    res.status(200).send({
      success: true,
      message: "User has been updated",
    });
  } catch (error) {
    console.log(error.message);
  }
};

/*******************************************
 Delete User
 *******************************************/
exports.deleteUser = async (req, res) => {
  try {
    // the email from the token
    const email = await decode(req.headers);
    const user = await User.deleteOne({ email: email });
    res.status(200).send({
      success: true,
    });
  } catch (error) {
    console.log(error.message);
  }
};

/*******************************************
 Get One User
 *******************************************/
exports.oneUser = async (req, res) => {
  try {
    // the email from the token
    const email = await decode(req.headers);
    // find the user based on the email inside of the token
    const user = await User.find({ email: email });
    // send that user back to the client
    res.status(200).send({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error.message);
  }
};
