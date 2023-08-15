export enum TaskStatusEnum {
  wait = "wait",
  inProgress = "inProgress",
  done = "done",
  closed = "closed",
}

interface ITaskCreate {
  name: string;
  description?: string;
}
interface ITaskData {
  name: string;
  description?: string;
  status: TaskStatusEnum;
  createdAt: Date;
}
interface ITask {
  get name(): string;
  get description(): string | null;
  get status(): TaskStatusEnum;
  get createdAt(): Date;
  start(): this;
  done(): this;
  close(): this;
  rename(newName: string): this;
}

export class TaskEntity implements ITask {
  private data: ITaskData;
  constructor(params: ITaskCreate) {
    this.validateName(params.name);
    this.data = {
      name: params.name,
      description: params.description,
      status: TaskStatusEnum.wait,
      createdAt: new Date(),
    };
  }

  public get name(): string {
    return this.data.name;
  }

  public get description(): string | null {
    return this.data.description || null;
  }

  public get status(): TaskStatusEnum {
    return this.data.status;
  }

  public get createdAt(): Date {
    return this.data.createdAt;
  }

  public start(): this {
    if (this.status !== TaskStatusEnum.wait) {
      throw new Error("Задача не может быть начата повторно");
    }
    this.data.status = TaskStatusEnum.inProgress;
    return this;
  }
  public done(): this {
    if (this.data.status !== TaskStatusEnum.inProgress) {
      throw new Error("Нельзя завершить не начатую задачу");
    }
    this.data.status = TaskStatusEnum.done;
    return this;
  }
  public close(): this {
    if (this.data.status === TaskStatusEnum.closed) {
      throw new Error("Нельзя закрыть задачу повторно");
    }
    this.data.status = TaskStatusEnum.closed;
    return this;
  }
  public rename(newName: string): this {
    this.validateName(newName);
    this.data.name = newName;
    return this;
  }
  private validateName(name: string) {
    if (name.length <= 2) {
      throw new Error("Название задачи не может быть короче двух символов");
    } else if (name.length >= 255) {
      throw new Error("Название задачи не может быть длиннее 255ти символов");
    }
    return this;
  }
}
