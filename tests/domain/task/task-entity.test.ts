import { TaskEntity, TaskStatusEnum } from "domain/task/task.entity";
import { faker } from "@faker-js/faker";

describe("Create task entity", () => {
  it("correctly creating a task", () => {
    jest.useFakeTimers();
    const task = new TaskEntity({ name: "Learn JS" });
    expect.assertions(4);
    expect(task.name).toEqual("Learn JS");
    expect(task.description).toBeNull();
    expect(task.status).toEqual(TaskStatusEnum.wait);
    expect(task.createdAt).toEqual(new Date());
  });
  it("correctly creating a task with a description", () => {
    const task = new TaskEntity({
      name: "Learn JS",
      description: "Every day",
    });
    expect.assertions(2);
    expect(task.name).toEqual("Learn JS");
    expect(task.description).toEqual("Every day");
  });
  it("error if the length of the task name is less than 2", () => {
    expect(
      () =>
        new TaskEntity({
          name: "a",
        })
    ).toThrow("Название задачи не может быть короче двух символов");
  });
  it("error if the length of the task name is more than 255", () => {
    expect(
      () =>
        new TaskEntity({
          name: faker.string.sample(256),
        })
    ).toThrow("Название задачи не может быть длиннее 255ти символов");
  });
});

// здесь нам не важно создание задачи
// проверяем лишь работу смены статуса класса TaskEntity
describe("Task entity workflow", () => {
  // мок задачи, везде будем использовать его
  // но перед запуском каждого теста будем создавать новый экземпляр
  let task: jest.MockedObjectDeep<TaskEntity>;

  // функция для подмены статуса задачи
  const mockStatus = (status: TaskStatusEnum) => {
    jest.replaceProperty(task as any, "data", {
      ...(task as any).data,
      status,
    });
  };

  beforeEach(() => {
    // перед началом каждого теста создаем новый мок задачи
    task = jest.mocked(new TaskEntity({ name: faker.company.name() }));
  });

  describe("start task", () => {
    it("correct status after start a task", () => {
      expect(task.start().status).toBe(TaskStatusEnum.inProgress);
    });

    it("error if start a started task", () => {
      mockStatus(TaskStatusEnum.inProgress);
      expect(task.start.bind(task)).toThrow(
        "Задача не может быть начата повторно"
      );
    });
    it("error if start a donned task", () => {
      mockStatus(TaskStatusEnum.done);
      expect(task.start.bind(task)).toThrow(
        "Задача не может быть начата повторно"
      );
    });
    it("error if start a closed task", () => {
      mockStatus(TaskStatusEnum.closed);
      expect(task.start.bind(task)).toThrow(
        "Задача не может быть начата повторно"
      );
    });
  });

  describe("done task", () => {
    it("correct status after done a task", () => {
      mockStatus(TaskStatusEnum.inProgress);
      expect(task.done().status).toBe(TaskStatusEnum.done);
    });

    it("error if done a not started task", () => {
      expect(task.done.bind(task)).toThrow(
        "Нельзя завершить не начатую задачу"
      );
    });
    it("error if done a donned task", () => {
      mockStatus(TaskStatusEnum.done);
      expect(task.done.bind(task)).toThrow(
        "Нельзя завершить не начатую задачу"
      );
    });
    it("error if done a closed task", () => {
      mockStatus(TaskStatusEnum.closed);
      expect(task.done.bind(task)).toThrow(
        "Нельзя завершить не начатую задачу"
      );
    });
  });
  describe("close task", () => {
    it("correct status after done a created task", () => {
      expect(task.close().status).toBe(TaskStatusEnum.closed);
    });
    it("correct status after done a started task", () => {
      mockStatus(TaskStatusEnum.inProgress);
      expect(task.close().status).toBe(TaskStatusEnum.closed);
    });
    it("correct status after done a donned task", () => {
      mockStatus(TaskStatusEnum.done);
      expect(task.close().status).toBe(TaskStatusEnum.closed);
    });
    it("error if close a closed task", () => {
      mockStatus(TaskStatusEnum.closed);
      expect(task.close.bind(task)).toThrow("Нельзя закрыть задачу повторно");
    });
  });
});

// здесь нам важно лишь успешное и корректное создание задачи
// проверяем работу конструктора класса TaskEntity
describe("Rename task entity", () => {
  // мок задачи, везде будем использовать его
  // но перед запуском каждого теста будем создавать новый экземпляр
  let task: jest.MockedObjectDeep<TaskEntity>;

  beforeEach(() => {
    // перед началом каждого теста создаем новый мок задачи
    task = jest.mocked(new TaskEntity({ name: faker.company.name() }));
  });
  it("correctly rename a task", () => {
    expect(task.rename("Learn JS every day").name).toEqual(
      "Learn JS every day"
    );
  });
  it("error if the length of the task name is less than 2", () => {
    expect(() => task.rename("a")).toThrow(
      "Название задачи не может быть короче двух символов"
    );
  });
  it("error if the length of the task name is more than 255", () => {
    expect(() => task.rename(faker.string.sample(256))).toThrow(
      "Название задачи не может быть длиннее 255ти символов"
    );
  });
});
