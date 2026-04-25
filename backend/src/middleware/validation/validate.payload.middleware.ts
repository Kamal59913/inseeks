import { Request, Response, NextFunction } from "express";
import Joi, { ObjectSchema } from "joi";
const validatePayload = (payload: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = payload.validate(req.body);
      if (error) {
        throw new Error(error.details[0].message);
      }
      next();
    } catch (err) {
      console.error(err);
      res.status(400).json({
        success: false,
        error: "Something went wrong during payload validation",
      });
    }
  };
};

export default validatePayload;
