const todo = (title, content, due, priority) => {
    let completion = false;

    return {
        getTitle,
        title,
        content,
        due,
        priority,
        completion
    };
};

export { todo }