import todo from "./todo";

// project object factory, contains an array of todo objects that corresponds with the project

const project = (name) => {
  const list = [];

  const getTodo = (index) => list[index];

  // creates a new todo object to the project with completion set to false
  const addTodo = (title, description, due, priority) => {
    list.push(todo(title, description, due, priority, false));
  };

  // adds a todo object to the project, used when restoring previous object data
  const addFullTodo = (obj) => {
    list.push(
      todo(obj.title, obj.description, obj.due, obj.priority, obj.completion)
    );
  };

  const deleteTodo = (index) => {
    list.splice(index, 1);
  };

  const editTodo = (index, obj) => {
    list[index].title = obj.title;
    list[index].description = obj.description;
    list[index].priority = obj.priority;
    list[index].due = obj.due;
  };

  const length = () => list.length;

  // returns an array containing all of the todos in the project
  const getAllTodos = () => {
    const todos = [];
    for (let i = 0; i < list.length; i += 1) {
      todos.push(list[i]);
    }
    return todos;
  };

  return {
    name,
    getTodo,
    addTodo,
    addFullTodo,
    deleteTodo,
    editTodo,
    length,
    getAllTodos,
  };
};

export default project;
