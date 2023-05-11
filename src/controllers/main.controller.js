import db from "../models";
import CRUDservice from "../services/CRUD.service";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/auth.utils";
import { generateTokenByEmail } from "../utils/auth.utils";
const notifier = require("node-notifier");
import { verifyAccessToken } from "../utils/auth.utils";
import transporter from "../config/mailer";
const salt = bcrypt.genSaltSync(10);

//Đây là của mongoDB
import User from "../model2/user";

module.exports.createUser = async (req, res) => {
  try {
    let data = await db.User.findAll({
      raw: true,
    });
    res.render("createUser.ejs");
  } catch (err) {
    console.log("ERROR", err);
  }
};

module.exports.postNewUser = async (req, res) => {
  try {
    let hashPassword = await bcrypt.hashSync(req.body.password, salt);
    await db.User.create({
      email: req.body.email,
      password: hashPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      gender: req.body.gender,
      phoneNumber: req.body.phoneNumber,
      role_id: req.body.role_id,
    });
    return res.redirect("/get-data-user");
  } catch (err) {
    console.log("ERROR", err);
  }
};

module.exports.displayTableUser = async (req, res) => {
  try {
    let data = await db.User.findAll({
      raw: true,
    });
    console.log(req.data);
    res.render("display-user.ejs", { dataUser: data });
  } catch (e) {
    console.log("ERROR", err);
  }
};

module.exports.editUser = async (req, res) => {
  try {
    let userId = req.query.id;
    let data = await db.User.findOne({
      where: { id: userId },
      raw: true,
    });
    res.render("edit-user.ejs", { dataUser: data });
  } catch (err) {
    console.log("ERROR", err);
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    let hashPassword = await bcrypt.hashSync(req.body.password, salt);
    await db.User.update(
      {
        email: req.body.email,
        password: hashPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        gender: req.body.gender,
        role_id: req.body.role_id,
      },
      {
        where: { id: req.body.userId },
      }
    );
    res.redirect("/get-data-user");
  } catch (err) {
    console.log("ERROR", err);
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    let userId = req.query.id;
    await db.User.destroy({
      where: { id: userId },
    });
    res.redirect("/get-data-user");
  } catch (err) {
    console.log("ERROR", err);
  }
};

exports.getLogin = (req, res) => {
  let err = [];
  res.render("login.ejs", { message: err, values: err });
};

exports.postLogin = async (req, res) => {
  try {
    let err = [];
    const { email, password } = req.body;
    if (!email || !password) {
      err.push("Email and password is require!");
      return res.render("login.ejs", { message: err, values: req.body });
    }
    let user = await db.User.findOne({
      where: { email },
      // attributes: {
      //   exclude: ["password"],
      // },
    });
    if (!user) {
      err.push("Email is incorrect!");
      return res.render("login.ejs", { message: err, values: req.body });
    }
    let checkpassword = bcrypt.compareSync(password, user.password);
    if (!checkpassword) {
      err.push("Wrong password!");
      return res.render("login.ejs", { message: err, values: req.body });
    }
    const { access_token, refresh_token } = generateToken(user);
    console.log(access_token);
    res.cookie("access_token", access_token, { maxAge: 60 * 60 * 1000 });
    // notifier.notify("Thông báo đến từ Node.js!");
    return res.redirect("/get-data-user");
  } catch (e) {
    console.log("ERROR", e);
  }
};

exports.getRegister = async (req, res) => {
  let err = [];
  res.render("register.ejs", {
    message: err,
    values: err,
  });
};

exports.postRegister = async (req, res) => {
  try {
    let err = [];
    let { firstName, lastName, email, password, cfPassword } = req.body;
    if (!firstName || !lastName || !email || !password || !cfPassword) {
      err.push("Please complete all information!");
      return res.render("register.ejs", {
        message: err,
        values: req.body,
      });
    }
    let existEmail = await db.User.findOne({
      where: { email },
    });
    if (existEmail) {
      err.push("Email is exist, please change another email!");
      return res.render("register.ejs", {
        message: err,
        values: req.body,
      });
    }
    if (password !== cfPassword) {
      err.push("Password and Confirm password is unsimilar!");
      return res.render("register.ejs", {
        message: err,
        values: req.body,
      });
    }
    let hashPassword = await bcrypt.hashSync(password, salt);
    await db.User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    return res.redirect("/login");
  } catch (e) {
    console.log("ERROR", e);
  }
};

exports.changePassword = async (req, res) => {
  let err = [];
  const { currentPassword, newPassword, cfNewpassword } = req.body;
  const token = req.cookies.access_token;
  if (!token) {
    return res.redirect("/login");
  }
  let data = await verifyAccessToken(token);
  let user = await db.User.findOne({
    where: { id: data.id_user },
  });
  let checkpassword = bcrypt.compareSync(currentPassword, user.password);
  if (!checkpassword) {
    err.push("Current password is incorrect!");
    return res.redirect("/login");
  }
  let hashPassword = await bcrypt.hashSync(newPassword, salt);
  await db.User.update(
    {
      password: hashPassword,
    },
    {
      where: { id: user.id },
    }
  );
  res.redirect("/get-data-user");
};

exports.getLogout = async (req, res) => {
  try {
    res.clearCookie("access_token");
    res.redirect("/login");
  } catch (e) {
    console.log("ERROR", e);
  }
};

exports.sendEmail = async (req, res) => {
  try {
    const mailOptions = {
      from: "lecthanh232002@gmail.com",
      to: "thanh232002@gmail.com",
      subject: "Yêu cầu đặt lại mật khẩu",
      text: "nhấn vào đây để đặt lại mật khẩu",
      html: `
      <p><a href="http://localhost:2601/login">Nhấn vào đây để đặt lại mật khẩu</a></p>
      <p>Chúc bạn một ngày tốt lành!</p>
    `,
    };

    // transporter.sendMail(mailOptions, (err, info) => {
    //   if (err) {
    //     console.error("Error occurred: " + err);
    //     return res.status(400).json({
    //       message: "ERROR",
    //     });
    //   }
    //   // Gửi email thành công
    //   console.log("Message sent: %s", info.messageId);
    //   console.log("Đây là data:", info);
    //   return res.status(400).json({
    //     message: "SUCCESSFULLy",
    //   });
    //});

    let data = await transporter.sendMail(mailOptions);
    console.log("Đây là data", data);
    res.status(400).json({
      message: "SUCCESSFULLy",
    });
  } catch (e) {
    console.log("ERROR-Đây", e);
    res.status(400).json({
      message: "ERROR",
    });
  }
};

exports.getforgotPassword = (req, res) => {
  let err = [];
  return res.render("resetpassword.ejs", {values: err});
}

exports.postforgotPassword = async (req, res) => {
  try {
    let email = req.body.email;
    let user = await db.User.findOne({
      attributes: {
          exclude: ["password"],
      },
      where: {email},
    });
    if(!user){
      return res.send("Email isn't exist!");
    }
    let token = generateTokenByEmail(email);
    const mailOptions = {
      from: "admin@gmail.com",
      to: email,
      subject: "Yêu cầu đặt lại mật khẩu",
      text: "nhấn vào đây để đặt lại mật khẩu",
      html: `
      <p><a href="http://localhost:2601/forgot-password?token=${token}">Nhấn vào đây để đặt lại mật khẩu</a></p>
      `,
    };
    await transporter.sendMail(mailOptions);

    return res.send("Please check the email to reset password, now you can close this page !");

  } catch(e){
    console.log("ERROR: ", e);
  }
}

// exports.postLogin = async (req, res) => {
//   try {
//     const user = await User.findOne({
//       userName: req.body.userName,
//     });
//     if (!user) {
//       return res.status(404).json("wrong username");
//     }
//     const validPassword = await bcrypt.compare(
//       req.body.password,
//       user.password
//     );
//     if (!validPassword) {
//       return res.status(404).json("wrong password");
//     }
//     if (user && validPassword) {
//       return res.status(200).json(user);
//     }
//   } catch (e) {
//     return res.status(500).json(e);
//   }
// };

// exports.postRegister = async (req, res) => {
//   try {
//     let hashPassword = await bcrypt.hashSync(req.body.password, salt);
//     const newUser = await new User({
//       userName: req.body.userName,
//       email: req.body.email,
//       password: hashPassword,
//     });
//     const user = await newUser.save();
//     return res.status(200).json(user);
//   } catch (e) {
//     return res.status(500).json(e);
//   }
// };
