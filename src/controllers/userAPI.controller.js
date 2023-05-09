import userService from "../services/user.service";
import { handleUserLogin } from "../services/user.service";
import db from "../models";
import { checkUserEmail } from "../services/user.service";
import {successsHandler} from "../utils/responseHandle";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

exports.handleLogin = async (req, res) => {
  let { email, password } = req?.body;
  if ((!email, !password)) {
    return res.status(400).json({
      errCode: 1,
      message: "Please enter your email and password",
    });
  }
  // let userData = await userService.handleUserLogin(email, password);
  let userData = await handleUserLogin(email, password);
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.message,
    user: userData.user,
  });
};

exports.handleGetAllUser = async (req, res) => {
  let userId = req?.query?.id;
  if (!userId) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing input parameter",
      data: [],
    });
  }
  let allUsers = [];
  if (userId === "ALL" || userId === "All") {
    allUsers = await db.User.findAll({
      attributes: {
        exclude: ["password"],
      },
      raw: true,
    });
  }
  if (userId && userId !== "All") {
    allUsers = await db.User.findOne({
      attributes: {
        exclude: ["password"],
      },
      where: { id: userId },
      raw: true,
    });
  }
  return res.status(200).json({
    errCode: 0,
    message: "ok",
    data: allUsers,
  });
};

exports.handleCreateNewUser = async (req, res) => {
  let ExistEmail = await checkUserEmail(req?.body?.email);
  if (ExistEmail) {
    return res.status(200).json({
      errCode: 1,
      message: "Email is already exist, try another email!",
    });
  }
  let hashPassword = await bcrypt.hashSync(req?.body?.password, salt);
  await db.User.create({
    email: req?.body?.email,
    password: hashPassword,
    firstName: req?.body?.firstName,
    lastName: req?.body?.lastName,
    address: req?.body?.address,
    gender: req?.body?.gender,
    phoneNumber: req?.body?.phoneNumber,
    role_id: req?.body?.role_id,
  });
  return res.status(200).json({
    errCode: 0,
    message: "Ok, Create successfully!",
  });
};

exports.handleEditUser = async (req, res) => {
  try {
    let userId = req?.body?.id;
    if (!userId) {
      return res.status(400).json({
        errCode: 1,
        message: "Missing parameter!",
      });
    }
    let existUser = await db.User.findOne({
      where: { id: userId },
    });
    if (!existUser) {
      return res.status(400).json({
        errCode: 2,
        message: "User not found",
      });
    }
    await db.User.update(
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        address: req?.body?.address,
        gender: req?.body?.gender,
        phoneNumber: req?.body?.phoneNumber,
        role_id: req?.body?.role_id,
      },
      {
        where: { id: userId },
      }
    );
    return res.status(200).json({
      errCode: 0,
      message: "Update Successfully!",
    });
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};

exports.handleDeleteUser = async (req, res) => {
  try {
    let userId = req?.body?.id;
    if (!userId) {
      return res.status(400).json({
        errCode: 2,
        message: "Missing input parameter!",
      });
    }
    let isUser = await db.User.findOne({
      where: { id: userId },
    });
    if (!isUser) {
      return res.status(400).json({
        errCode: 1,
        message: "User not found!",
      });
    }
    await db.User.destroy({
      where: { id: userId },
    });
    return successsHandler(res, 0, null, 200, "Delete successfully!")
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};

exports.getAllcode = async (req, res) => {
  try {
    if (!req.query.type) {
      return successsHandler(res, 1,null, 200, "Missing input parameter");
    }
    let data = await db.Allcode.findAll({
      where: { type: req.query.type },
    });
    return successsHandler(res, 0, data, 200, "Successfully");
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};
