# Создание менеджера для управления задачами

## TaskManager - Позволяет создавать, просматривать, удалять задачи

### Пред реализацией необходимо обновить ITask
```typescript
interface ITask {
  id:string
  // ...
}
```
id - уникальный идентификатор, который автоматически генерируется при создании задачи. Для генерации использовать функцию `randomUUID` из библиотеки `crypto`

### Интерфейс
```typescript
interface ITasksFilter {
  statuses?: TaskStatus[], // массив статусов
}

interface ITaskManager {
  addTask(task:ITask): this,
  getTask(taskId:string): ITask | null,
  getTasks(): Map<string,ITask>,
  getTasks(ids: string[]): Map<string,ITask>,
  getTasks(filter: ITaskFilter): Map<string,ITask>,
  search(query: string, filter?:ITaskFilter): Map<string,ITask>,
  deleteTask(taskId:string): boolean,
}
```

|Свойство/метод|Описание
|-|--|
|`addTask`|Добавить новую задачу|
|`getTask`|Получить задачу по ее идентификатору|
|`getTasks`|Получить словарь задач (всех \| по массиву идентификаторов \| согласно фильтру)|
|`search`|Поиск задач по названию с опциональной фильтрацией|
|`deleteTask`|Удалить задачу. Возвращает флаг (не)успешного удаления|

> Множество (Set) и Словарь (Map) в JS -> https://learn.javascript.ru/map-set

### При реализации предусмотреть:
* проверку на дублирование задачи при добавлении
* поиск должен учитывать как слова целиком, так и части слов без учета регистра. `Кот -> "Сходить с котом в больницу"`
* выбрасывание исключений при необходимости