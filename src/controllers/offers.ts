import { Request, Response, NextFunction, request } from "express";
import { createConnection, getRepository, Like } from "typeorm";
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

// Update offer
const update = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  // Get id from prama
  const id = req.params.id;
  const offer = await getRepository(Offer).findOne(id);
  // Check if offer exist
  if (!offer)
    return res.status(404).send({ message: `offer not found for id ${id}` });
  // update the instance
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

  if (rec_date) offer.rec_date = rec_date;
  if (client) offer.client = client;
  if (project_name) offer.project_name = project_name;
  if (description) offer.description = description;
  if (work_type) offer.work_type = work_type;
  if (quo_date) offer.quo_date = quo_date;
  if (quo_values) offer.quo_values = quo_values;
  if (quo_no) offer.quo_no = quo_no;
  if (status) offer.status = status;

  // Save offer
  await getRepository(Offer).save(offer);

  // in case of save creation user data
  console.log(req.user);

  return res.status(201).send(offer);

  // Return responce
};

// Delete offer
const remove = async (req: Request, res: Response, next: NextFunction) => {
  // Get id from prama
  const id = req.params.id;
  // Query for the data
  const offer = await getRepository(Offer).findOne(id);
  // Check if offer found
  if (!offer)
    return res.status(404).send({ message: `offer not found for id ${id}` });
  // Delete offer
  await getRepository(Offer).delete(offer);
  //return the response
  return res.status(200).send({ message: "deleted" });
};

const lastNo = async (req: Request, res: Response, next: NextFunction) => {
  // Get code from paramter
  const { code, id } = req.body;
  // Check if code exist
  if (!(code && id))
    return res.status(400).send({ message: "All input is required" });
  // Get last no
  const lastNo = await getRepository(Offer).find({
    quo_no: Like("" + code + "%"),
  });

  // Pre last no with default no
  let last = 1;
  // If last number exist
  if (lastNo && lastNo.length > 0) {
    let numbers = [0];
    for (let index = 0; index < lastNo.length; index++) {
      const element = lastNo[index];
      if (!element.quo_no.includes("2019")) {
        // get array of numbers to select the max
        numbers.push(parseInt(element.quo_no.split("-")[1]));
      }
    }
    // Select the max number
    last = Math.max(...numbers) + 1;
  }
  // Get string of the new quo_no
  const today = new Date();
  const year = today.getFullYear();
  const last_no = `${code}-${last}-${year}-Rev.0`;

  // Select the offer what to assaign quo_no
  const offer = await getRepository(Offer).findOne(id);
  // check id exist
  if (!offer)
    return res.status(404).send({ message: `offer not found for id ${id}` });
  // Assign the new number
  offer.quo_no = last_no;
  // Save offer
  await getRepository(Offer).save(offer);
  return res.status(201).send(last_no);
};

export default { index, create, show, update, remove, lastNo };
