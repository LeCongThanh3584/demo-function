import db from "../models";
import { verifyAccessToken } from "../utils/auth.utils";

const auth = async (req, res, next) => {
  try {
    //   const access_token = req.header("Authorization").split(" ")[1];
    const token = req.cookies.access_token;
    if (!token) {
      return res.redirect("/login");
    }
    const data = await verifyAccessToken(token);
    if (!data) {
      return res.redirect("/login");
    }
    const user = db.User.findOne({
      where: { id: data.id_user },
    });
    if (!user) {
      return res.redirect("/login");
    }
    req.data = user;
    next();
  } catch (e) {
    console.log("ERROR", e);
  }
};

module.exports = auth;
