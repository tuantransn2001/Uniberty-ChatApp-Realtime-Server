import { Request, Response, NextFunction } from "express";
import HttpException from "../src/utils/http.exception";

function errorHandler(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = error.status || 500;
  const message = error.message || "Something in sever went wrong";
  res.status(status).send({
    status,
    message,
  });
}

export default errorHandler;
