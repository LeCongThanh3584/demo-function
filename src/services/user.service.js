import db from "../models";
import bcrypt from "bcryptjs";

exports.handleUserLogin = async (email, password) => {
  try {
    let userData = {};
    let existEmail = await checkUserEmail(email);
    if (existEmail) {
      //nếu tồn tại email thì xử lý xem có trùng pass hay không
      let user = await db.User.findOne({
        where: { email: email },
        attributes: {
          include: ["email", "role_id"],
        },
      });
      if (user) {
        let check = bcrypt.compareSync(password, user.password);
        if (check) {
          userData.errCode = 0;
          userData.message = "Ok, user exist in database";
          userData.user = user;
        } else {
          userData.errCode = 3;
          userData.message = "wrong password";
        }
      } else {
        (user.errCode = 2), (userData.message = "User not found");
      }
    } else {
      (userData.errCode = 1),
        (userData.message = `your email incorrect, try another email`);
    }
    return userData;
  } catch (err) {
    console.log("ERROR", err);
  }
};

exports.checkUserEmail = async (userEmail) => {
  try {
    let user = await db.User.findOne({
      where: { email: userEmail },
    });
    if (user) return true;
    else return false;
  } catch (err) {
    console.log("ERROR", err);
  }
};
