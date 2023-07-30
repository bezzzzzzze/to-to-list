# Создание сущности для работы с задачей

## TaskEntity - Позволяет создавать задачу, изменять статусы согласно workflow, переименовывать

### Интерфейс
```typescript
interface ITask {
  get name(): string,
  get description(): string | null,
  get status(): TaskStatus,
  get createdAt(): Date,
  start(): this,
  done(): this,
  close(): this,
  rename(newName:string): this
}
```
|Свойство/метод|Описание
|-|--|
|`name`|Название задачи|
|`description`|Описание задачи|
|`status`|Статус задачи `<wait/inProgress/done/closed>`|
|`createdAt`|Название задачи|
|`start()`|Начать выполнение задачи. Статус задачи переходит в `inProgress`|
|`done()`|Завершить задачу. Статус задачи переходит в `done`|
|`close()`|Закрыть задачу. Статус задачи переходит в `close`|
|`rename(newName)`|Переименовать задачу

### Workflow для статуса
* default `wait`
* `wait` -> `inProgress/closed`
* `inProgress` -> `done/closed`
* `done` -> `closed`

### При реализации предусмотреть:
* валидацию данных при создании/изменении объекта
* корректное поведение при смене статуса
* выбрасывание исключений при необходимости

### Сущность должна успешно проходить тест 
> Для тестирования использовать библиотеку `jest`. Для генеарции данных использовать библиотеку `@faker-js/faker`
```typescript
// здесь нам важно лишь успешное и корректное создание задачи
// проверяем работу конструктора класса TaskEntity
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
```