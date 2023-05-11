import express from "express";
import mainController from "../controllers/main.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/login", mainController.getLogin);   //Lấy trang đăng nhập
router.post("/login", mainController.postLogin);   //Gửi thông tin đăng nhập
router.get("/logout", mainController.getLogout);   //Đăng xuất

router.get("/register", mainController.getRegister);  //Lấy trang đăng kí
router.post("/register", mainController.postRegister); //Gửi thông tin đăng kí

router.post("/changepassword", mainController.changePassword);  //Gửi thông tin thay đổi mật khẩu
router.get("/forgot-password", mainController.getforgotPassword); //Lấy trang quên mật khẩu
router.post("/forgot-password", mainController.postforgotPassword);  //Gửi thông tin quên mật khẩu

router.post("/sendEmail", mainController.sendEmail);

router.get("/create-user", authMiddleware,mainController.createUser); //hiển thị ra trang tạo user mới
router.post("/post-crud",authMiddleware, mainController.postNewUser); //Gửi data user mới lên server

router.get("/get-data-user", authMiddleware,mainController.displayTableUser); //hiển thị bảng các user

router.get("/edit-user", authMiddleware, mainController.editUser); //hiển thị trang cập nhật chỉnh sửa user
router.post("/update-user", authMiddleware, mainController.updateUser); //gửi data mới cập nhật lên server

router.get("/delete-user", authMiddleware, mainController.deleteUser); //Xóa data người dùng

module.exports = router;
