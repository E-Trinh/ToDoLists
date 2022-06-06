import { todo } from "./todo";

const project = (name) => {
    const list = [];

    const getTodo = index => {
        return list[index];
    };

    const addTodo = (title, description, due, priority) => {
        list.push(todo(title, description, due, priority));
    };

    const deleteTodo = index => {
        list.splice(index, 1);
    };

    const length = () => {
        return list.length;
    };

    return {
        name,
        getTodo,
        addTodo,
        deleteTodo,
        length,
        name,
    };
};

export { project }