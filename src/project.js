import { todo } from "./todo";

const project = (name) => {
    const list = [];

    const addTodo = (title, description, due, priority) => {
        list.push(title, description, due, priority)
    }
    
    return {
        addTodo,
        name,
    };
};

export { project }