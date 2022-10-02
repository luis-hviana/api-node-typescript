import HttpStatusCode from '../responses/HttpStatusCode';
import HttpException from './HttpException';

class UserContainTaskException extends HttpException {
  constructor() {
    super(HttpStatusCode.CONFLICT, 'Impossivel excluir, pois o usuario possui relacionamento com outras tarefas.');
  }
}

export default UserContainTaskException;
