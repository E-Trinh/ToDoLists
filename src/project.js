import { todo } from "./todo";

const project = (name) => {
    const list = [];

    const get = index => {
        return list[index];
    };

    const addTodo = (title, description, due, priority) => {
        list.push(todo(title, description, due, priority));
    };

    const deleteTodo = index => {
        list.splice(index, -1);
    }

    const length = () => {
        list.length();
    }

    return {
        get,
        addTodo,
        deleteTodo,
        length,
        name,
    };
};

export { project }