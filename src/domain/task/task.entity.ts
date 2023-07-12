enum TaskStatusEnum {
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

class TaskEntity {
  private data: ITaskData;
  constructor(params: ITaskCreate) {
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
      throw new Error("Нельзя завешить не начатую задачу");
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
}
