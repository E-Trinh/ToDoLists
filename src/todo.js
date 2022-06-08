//todo object factory

const todo = (title, description, due, priority, complete) => {
    let completion = false;

    return {
        title,
        description,
        due,
        priority,
        completion,
    };
};

export { todo }