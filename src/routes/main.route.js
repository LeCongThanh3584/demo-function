import express from "express";
import mainController from "../controllers/main.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/login", mainController.getLogin);
router.post("/login", mainController.postLogin);
router.get("/logout", mainController.getLogout);

router.get("/register", mainController.getRegister);
router.post("/register", mainController.postRegister);

router.post("/changepassword", mainController.changePassword);
router.post("/sendEmail", mainController.sendEmail);

router.get("/create-user", authMiddleware, mainController.createUser); //hiển thị ra trang tạo user mới
router.post("/post-crud", authMiddleware, mainController.postNewUser); //Gửi data user mới lên server

router.get("/get-data-user", authMiddleware, mainController.displayTableUser); //hiển thị bảng các user

router.get("/edit-user", authMiddleware, mainController.editUser); //hiển thị trang cập nhật chỉnh sửa user
router.post("/update-user", authMiddleware, mainController.updateUser); //gửi data mới cập nhật lên server

router.get("/delete-user", authMiddleware, mainController.deleteUser); //Xóa data người dùng

module.exports = router;
