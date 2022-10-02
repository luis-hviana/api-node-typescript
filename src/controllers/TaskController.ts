import { NextFunction, Response, Request } from 'express';
import ValidationService from '../services/ValidationService';
import Controller from './Controller';
import ServerErrorException from '../errors/ServerErrorException';
import NoContentException from '../errors/NoContentException';
import ResponseCreate from '../responses/ResponseCreate';
import ResponseOk from '../responses/ResponseOk';

import Task, { TaskInterface } from '../schemas/Task';
import TaskServices from '../services/TaskServices';

class TaskController extends Controller {
  constructor() {
    super('/task');
  }

  protected initRoutes(): void {
    this.router.get(`${this.path}/:filter/:_id`, this.list);
    this.router.get(`${this.path}/:id`, this.findById);
    this.router.post(this.path, this.create);
    this.router.put(`${this.path}/:id`, this.edit);
    this.router.delete(`${this.path}/:id`, this.findById);
  }

  private async list(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const tasks = await Task.find(TaskServices.getParamsList(req)).populate('responsible');

      if (tasks.length) return ResponseOk(res, tasks);
      next(new NoContentException());
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }

  private async findById(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { id } = req.params;
      if (ValidationService.validateId(id, next)) return;

      const task = await Task.findById(id);
      if (task) return ResponseOk(res, task);
      next(new NoContentException());
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }

  private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      let task: TaskInterface = req.body;

      TaskServices.checkStatusFinished(task);
      task = await Task.create(task);
      task = await Task.findById(task.id).populate('responsible');

      return ResponseCreate(res, task);
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }

  private async edit(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { id } = req.params;
      if (ValidationService.validateId(id, next)) return;

      let task: TaskInterface = req.body;
      TaskServices.checkStatusFinished(task);

      task = await Task.findByIdAndUpdate(id, req.body);
      if (task) {
        task = await Task.findById(task.id).populate('responsible');
        return ResponseOk(res, task);
      }
      next(new NoContentException());
    } catch (error) {
      next(new ServerErrorException(error));
    }
  }

  private async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { id } = req.params;
      if (ValidationService.validateId(id, next)) return;

      let task: TaskInterface = req.body;
      TaskServices.checkStatusFinished(task);

      task = await Task.findByIdAndUpdate(id, task);
      if (task) {
        task.deleteOne();
        return ResponseOk(res, task);
      }

      next(new NoContentException());
    } catch (error) {
      next(new NoContentException());
    }
  }
}

export default TaskController;
