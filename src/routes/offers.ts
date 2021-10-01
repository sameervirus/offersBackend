/** src/routes/offers.ts */
import express from "express";
import controller from "../controllers/offers";
const offersRouter = express.Router();

offersRouter.get("/offers", controller.index);
offersRouter.post("/offers", controller.create);
offersRouter.get("/offers/:id", controller.show);
offersRouter.put("/offers/:id", controller.update);
offersRouter.delete("/offers/:id", controller.remove);
offersRouter.post("/offers/update-last", controller.lastNo);

export = offersRouter;
