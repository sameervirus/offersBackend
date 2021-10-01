import { Request, Response, NextFunction } from "express";
import { createConnection, getRepository } from "typeorm";
import { Offer } from "../entity/Offer";
import { IGetUserAuthInfoRequest } from "../middleware/requestInterface";

createConnection();

// Get All offers
const index = async (req: Request, res: Response, next: NextFunction) => {
  const offers = await getRepository(Offer).find();
  return res.status(200).send(offers);
};

// Create Offer
const create = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const {
    rec_date,
    client,
    project_name,
    description,
    work_type,
    quo_date,
    quo_values,
    quo_no,
    status,
  } = req.body;

  // Check required Data
  if (!(rec_date && client && project_name)) {
    return res.status(400).send("All input is required");
  }

  // Create instance for new offer
  const offer = new Offer();
  offer.rec_date = rec_date;
  offer.client = client;
  offer.project_name = project_name;
  if (description) offer.description = description;
  if (work_type) offer.work_type = work_type;
  if (quo_date) offer.quo_date = quo_date;
  if (quo_values) offer.quo_values = quo_values;
  if (quo_no) offer.quo_no = quo_no;
  if (status) offer.status = status;

  // save to data base
  await getRepository(Offer).save(offer);

  // in case of save creation user data
  console.log(req.user);

  return res.status(201).send(offer);
};

// Get Offer by Id
const show = async (req: Request, res: Response, next: NextFunction) => {
  // Get id from prama
  const id = req.params.id;
  // Query for the data
  const offer = await getRepository(Offer).findOne(id);
  // Check if offer found
  if (!offer)
    return res.status(404).send({ message: `offer not found for id ${id}` });
  //return the founded offer
  return res.status(200).send(offer);
};

export default { index, create, show };
