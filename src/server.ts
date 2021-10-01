/** src/server.ts */
import http from "http";
import express, { Express } from "express";
import "reflect-metadata";
import { usersRouter, offersRouter } from "./routes/";
import auth from "./middleware/auth";

const router: Express = express();

/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

/** Routes */
/** Apply middleware */
router.use("/offers", auth, function (req, res, next) {
  next();
});
router.use("/", usersRouter);
router.use("/", offersRouter);

/** Error handling */
router.use((req, res, next) => {
  const error = new Error("not found");
  return res.status(404).json({
    message: error.message,
  });
});

/** Server */
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 3000;
httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);
