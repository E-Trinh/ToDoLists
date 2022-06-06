//todo object factory

const todo = (title, content, due, priority) => {
    let completion = false;

    return {
        title,
        content,
        due,
        priority,
        completion,
    };
};

export { todo }