import { NextFunction, Response, Request } from 'express';
import User from '../schemas/User';
import ValidationService from '../services/ValidationService';
import Controller from './Controller';
import ServerErrorException from '../errors/ServerErrorException';
import NoContentException from '../errors/NoContentException';
import ResponseCreate from '../responses/ResponseCreate';
import ResponseOk from '../responses/ResponseOk';
import ResponseNotFound from '../responses/ResponseNotFound';
import UserService from '../services/UserService';

class UserController extends Controller {
  constructor() {
    super('/user');
  }

  protected initRoutes(): void {
    this.router.get(this.path, this.list);
    this.router.get(`${this.path}/:id`, this.findById);
    this.router.post(this.path, this.create);
    this.router.put(`${this.path}/:id`, this.edit);
    this.router.delete(`${this.path}/:id`, this.findById);
  }

  private async list(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const users = await User.find();

      if (users.length) return ResponseOk(res, users);
      next(new NoContentException());
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }

  private async findById(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { id } = req.params;
      if (ValidationService.validateId(id, next)) return;

      const user = await User.findById(id);
      if (user) return ResponseOk(res, user);
      next(new NoContentException());
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }

  private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const user = await User.create(req.body);

      return ResponseCreate(res, user);
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }

  private async edit(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { id } = req.params;
      if (ValidationService.validateId(id, next)) return;

      const user = await User.findByIdAndUpdate(id, req.body);

      if (user) return ResponseOk(res, user);
      next(new NoContentException());
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }

  private async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { id } = req.params;
      if (ValidationService.validateId(id, next)) return;
      if (await UserService.validateExistAnyTask(id, next)) return;
      const user = await User.findById(id);

      if (user) {
        user.deleteOne();
        return ResponseOk(res, user);
      }
      next(new NoContentException());
    } catch (error) {
      next(new NoContentException());
    }
  }
}

export default UserController;
