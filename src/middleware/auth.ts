import { NextFunction, Response, Request } from "express";
import { IGetUserAuthInfoRequest } from "./requestInterface";
import jwt = require("jsonwebtoken");

const verifyToken = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY!);
    req.user = <any>decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

export default verifyToken;
