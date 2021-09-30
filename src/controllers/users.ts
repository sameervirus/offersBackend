import { Request, Response, NextFunction } from "express";
import { createConnection, getRepository } from "typeorm";
import { User } from "../entity/User";
import bcrypt = require("bcrypt");
import jwt = require("jsonwebtoken");
import auth = require("../middleware/auth");

createConnection();
const login = async (req: Request, res: Response, next: NextFunction) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await getRepository(User).findOne({ email: email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign({ user_id: user.id, email }, "zAqWsXcDeRfvBGT", {
        expiresIn: "30d",
      });

      // save user token
      user.token = token;
      await getRepository(User).save(user);

      // user
      return res.status(200).json(user);
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  // Our register logic starts here
  try {
    // Get user input
    const { name, email, password } = req.body;

    // Validate user input
    if (!(email && password && name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await getRepository(User).findOne({ email: email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    let encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = new User();
    user.name = name;
    user.email = email.toLowerCase();
    user.password = encryptedPassword;

    await getRepository(User).save(user);

    // Create token
    const token = jwt.sign({ user_id: user.id, email }, "zAqWsXcDeRfvBGT", {
      expiresIn: "2h",
    });
    // save user token
    user.token = token;
    await getRepository(User).save(user);
    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
};
export default { login, register };
