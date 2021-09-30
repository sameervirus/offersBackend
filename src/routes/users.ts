/** source/routes/posts.ts */
import express from "express";
import controller from "../controllers/users";
const router = express.Router();

router.post("/login", controller.login);
router.post("/register", controller.register);

export = router;
