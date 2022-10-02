import { NextFunction, Request, Response } from 'express';
import HttpException from '../errors/HttpException';
import HttpStatusCode from '../responses/HttpStatusCode';
import ResponseRunTimeError from '../responses/ResponseRunTimeError';

function RunTimeErrorMiddleware(error: HttpException, req: Request, res: Response, next: NextFunction) {
  const status = error.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
  const message = error.message || 'erro não identificado';

  ResponseRunTimeError(res, status, message);
}

export default RunTimeErrorMiddleware;
