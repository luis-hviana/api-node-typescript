import { Request, Response } from 'express';
import ResponseNotFound from '../responses/ResponseNotFound';

function NotFoundErrorMiddleware(req: Request, res: Response) {
  return ResponseNotFound(res);
}

export default NotFoundErrorMiddleware;
