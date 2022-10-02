import { Response } from 'express';
import HttpStatusCode from './HttpStatusCode';

function ResponseOk(res: Response, body:any) {
  const status = HttpStatusCode.OK;
  const message = 'OK';
  const error = false;
  return res.status(status).send({
    status, message, error, body,
  });
}

export default ResponseOk;
