import express from "express";
import userController from "../controllers/userAPI.controller";
const router = express.Router();

router.post("/login", userController.handleLogin);
router.get("/get-all-user", userController.handleGetAllUser);
router.post("/create-new-user", userController.handleCreateNewUser);
router.put("/update-user", userController.handleEditUser);
router.delete("/delete-user", userController.handleDeleteUser);

router.get("/allcodes", userController.getAllcode);

module.exports = router;
