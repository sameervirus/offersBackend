/** src/routes/offers.ts */
import express from "express";
import controller from "../controllers/offers";
const offersRouter = express.Router();

offersRouter.get("/offers", controller.index);
offersRouter.post("/offers", controller.create);
offersRouter.get("/offers/:id", controller.show);

export = offersRouter;
