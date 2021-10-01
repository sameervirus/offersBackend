/** source/routes/posts.ts */
import express from "express";
import controller from "../controllers/users";
const usersRouter = express.Router();

usersRouter.post("/login", controller.login);
usersRouter.post("/register", controller.register);

export = usersRouter;
