import { Response } from 'express';
import HttpStatusCode from './HttpStatusCode';

function ResponseRunTimeError(res: Response, status: HttpStatusCode, message: string) {
  const error = false;
  const body = {};
  return res.status(status).send({
    status, message, error, body,
  });
}

export default ResponseRunTimeError;
