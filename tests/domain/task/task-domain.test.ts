import { TaskEntity } from "domain/task";

describe("Task entity", () => {
  it("create task entity", () => {
    const task = new TaskEntity({ name: "Learn JS" });
    expect(task.name).toEqual("Learn JS");
  });
});
