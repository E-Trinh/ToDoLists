import { mainController } from "./index.js";

//displayController module, handles all DOM controls for the mainController module
const displayController = (function() {

    //used for initial set up of HTML document, adds the main containers and calls functions to add default items to them
    const pageSetup = (projects, todos) => {
        const navBar = document.createElement("div");
        navBar.classList.toggle("nav-bar");

        const mainView = document.createElement("div");
        mainView.classList.toggle("main-container");

        const menuDiv = document.createElement("div");
        menuDiv.classList.toggle("side-menu");

        const opacityDiv = document.createElement("div");
        opacityDiv.classList.toggle("opacity-bg");
        opacityDiv.addEventListener("click", event => {
            window.requestAnimationFrame(() => {
                closeSideMenu();
            });
        });

        const content = document.getElementById("content");
        content.appendChild(navBar);
        content.appendChild(mainView);
        content.appendChild(menuDiv);
        content.appendChild(opacityDiv);
        navSetup(projects);
        containerSetup(todos);
        todoMenuSetup();
    };

    //adds elements to the navigation bar
    const navSetup = projects => {
        const navBar = document.querySelector(".nav-bar");
        navBar.textContent = "";

        const header = document.createElement("h1");
        header.textContent = "Todo's";
        navBar.appendChild(header);
        
        const collaspe = document.createElement("span");
        collaspe.textContent = "x";
        collaspe.addEventListener("click", closeNavBar);
        navBar.appendChild(collaspe);

        //default project, Home
        const defaultProject = document.createElement("p");
        defaultProject.textContent = "Home";
        defaultProject.addEventListener("click", event => {
            mainController.selectProject("default");
        });
        navBar.appendChild(defaultProject);

        const projectsTag = document.createElement("p");
        projectsTag.textContent = "Projects";
        projectsTag.addEventListener("click", () => {
            mainController.showProjects();
        });
        navBar.appendChild(projectsTag);

        //adds elements for the name of each projects
        projects.forEach(proj => {
            const nameTag = document.createElement("p");
            nameTag.dataset.index = proj.index;
            nameTag.textContent = proj.name;
            nameTag.addEventListener("click", event => {
               mainController.selectProject(event.target.dataset.index); 
            });
            navBar.appendChild(nameTag);
        });

        //element used for creating new project from the navigation bar
        const newProject = document.createElement("p");
        newProject.textContent = "+ New Project";
        newProject.contentEditable = true;
        newProject.addEventListener("click", event => {
            event.target.textContent = "";
        });
        newProject.addEventListener("keyup", event => {
            if (event.code === "Enter") {
                newProjectEventListener(event);
            }
        });
        newProject.addEventListener("blur", newProjectEventListener);
        navBar.appendChild(newProject);
    }

    //function is called whenever the user tries to make an new project user document elements
    const newProjectEventListener = event => {
        const name = event.target.textContent;
        if (name != "+ New Project" && name != "") {
            mainController.addProject(name);
        }
        event.target.textContent = "+ New Project";
        event.target.blur();
    };

    //function is used for displaying the contents of the main container
    const containerSetup = todos => {
        const container = document.querySelector(".main-container");
        container.textContent = "";

        const openNav = document.createElement("span");
        openNav.textContent = "☰";
        openNav.addEventListener("click", openNavBar);
        container.appendChild(openNav);

        const header = document.createElement("h1");
        header.textContent = todos[0];
        container.appendChild(header);

        const allTodoContainer = document.createElement("div");
        allTodoContainer.classList.toggle("all-todo-container");

        const todoContainer = document.createElement("div");
        todoContainer.classList.toggle("key-container");
        const complete = document.createElement("p");
        complete.textContent = "Complete";
        complete.classList.toggle("priority");
        const priority = document.createElement("p");
        priority.textContent = "Priority";
        priority.classList.toggle("priority");
        const todo = document.createElement("p");
        todo.textContent = "Title";
        todo.classList.toggle("todo-title");
        const due = document.createElement("p");
        due.textContent = "Due";
        due.classList.toggle("due");
        todoContainer.appendChild(complete);
        todoContainer.appendChild(priority);
        todoContainer.appendChild(todo);
        todoContainer.appendChild(due);
        allTodoContainer.appendChild(todoContainer);

        for (let i = 1; i < todos.length; i++) {
            const todoContainer = document.createElement("div");
            todoContainer.classList.toggle("todo-container");
            todoContainer.dataset.index = i - 1;
            todoContainer.dataset.description = todos[i].description;

            const complete = document.createElement("input");
            complete.type = "checkbox";
            complete.classList.toggle("complete");
            complete.dataset.index = i - 1;
            complete.checked = todos[i].complete;
            complete.addEventListener("change", event => {
                event.stopPropagation();
                if (event.target.checked) {
                    mainController.setComplete(event.target.dataset.index, true);
                } else {
                    mainController.setComplete(event.target.dataset.index, false);
                }
            });

            const priority = document.createElement("p");
            priority.dataset.priority = todos[i].priority;
            if (todos[i].priority == 1) {
                priority.textContent = "High"
            } else if (todos[i].priority == 2) {
                priority.textContent = "Medium"
            } else {
                priority.textContent = "Low"
            }
            priority.classList.toggle("priority");

            const todo = document.createElement("p");
            todo.textContent = todos[i].title;
            todo.classList.toggle("todo-title");

            const due = document.createElement("p");
            due.textContent = todos[i].due;
            due.classList.toggle("due");

            todoContainer.addEventListener("click", event => {
                if (!event.target.classList.contains("complete")) {
                    editTodoMenu({
                        index: todoContainer.dataset.index,
                        title: todo.textContent,
                        description: todoContainer.dataset.description,
                        priority: priority.dataset.priority,
                        date: due.textContent
                    });
                }
            });
            todoContainer.appendChild(complete)
            todoContainer.appendChild(priority);
            todoContainer.appendChild(todo);
            todoContainer.appendChild(due);
            allTodoContainer.appendChild(todoContainer);
        }

        container.appendChild(allTodoContainer);

        const newTodo = document.createElement("button");
        newTodo.classList.toggle("new-todo-button");
        newTodo.textContent = "New Todo Item";
        newTodo.addEventListener("click", newTodoMenu);
        allTodoContainer.appendChild(newTodo);
    }

    //shows a list of all the user projects
    const projectTabSetup = projects => {
        const container = document.querySelector(".main-container");
        container.textContent = "";

        const openNav = document.createElement("span");
        openNav.textContent = "☰";
        openNav.addEventListener("click", openNavBar);
        container.appendChild(openNav);

        for (let i = 0; i < projects.length; i++) {
            const projectName = document.createElement("p");
            const projectCount = document.createElement("p");
            projectName.textContent = projects[i].name;
            projectName.dataset.index = i;
            projectCount.textContent = projects[i].count;
            projectName.contentEditable = true;
            projectName.addEventListener("keyup", event => {
                if (event.code === "Enter") {
                    renameProjectEventListener(event);
                }
            });
            projectName.addEventListener("blur", renameProjectEventListener);
            container.appendChild(projectName);
            container.appendChild(projectCount);
        }
    };

    const renameProjectEventListener = event => {
        mainController.renameProject(event.target.dataset.index, event.target.textContent);
    };

    //function for setting up the layout of the side menu
    const todoMenuSetup = () => {
        const sideMenu = document.querySelector(".side-menu");
        const header = document.createElement("h1");
        header.classList.toggle("side-header");
        header.textContent = "";
        const title = document.createElement("input");
        title.type = "text";
        title.placeholder = "Title";
        title.id = "title"

        const desc = document.createElement("textarea");
        desc.rows = "4";
        desc.placeholder = "Description";
        desc.id = "description"

        const priorityLabel = document.createElement("label");
        priorityLabel.for = "priority";
        priorityLabel.textContent = "Priority";

        const priority = document.createElement("select");
        priority.id = "priority"

        const low = document.createElement("option");
        low.textContent = "Low";
        low.value = "3";
        low.selected = true;

        const medium = document.createElement("option");
        medium.textContent = "Medium"
        medium.value = "2";

        const high = document.createElement("option");
        high.textContent = "High"
        high.value = "1";

        const dateLabel = document.createElement("label");
        dateLabel.for = "date";
        dateLabel.textContent = "Date";

        const date = document.createElement("input");
        date.type = "date";
        date.id = "date"

        const buttonDiv = document.createElement("div");
        buttonDiv.classList.toggle("button-div")
        buttonDiv.id = "buttons";

        priority.appendChild(high);
        priority.appendChild(medium);
        priority.appendChild(low);

        sideMenu.appendChild(header);
        sideMenu.appendChild(title);
        sideMenu.appendChild(desc);
        sideMenu.appendChild(priorityLabel);
        sideMenu.appendChild(priority)
        sideMenu.appendChild(dateLabel);
        sideMenu.appendChild(date);
        sideMenu.appendChild(buttonDiv);
    }

    //sets up the side menu with controls specific to creating a todo object
    const newTodoMenu = () => {
        clearsideMenu();
        const sideMenu = document.querySelector(".side-menu");
        const sideHeader = document.querySelector(".side-header");
        const buttonDiv = document.getElementById("buttons");
        const title = document.getElementById("title");
        const desc = document.getElementById("description");
        const priority = document.getElementById("priority");
        const date = document.getElementById("date");

        const add = document.createElement("button");
        add.textContent = "Add";
        add.addEventListener("click", ()=> {
            mainController.addTodo({
                title: title.value,
                description: desc.value,
                priority: priority.value,
                date: date.value
            });
            closeSideMenu();
        });
        const cancel = document.createElement("button");
        cancel.textContent = "Cancel";
        cancel.addEventListener("click", () => {
            closeSideMenu();
        });

        document.querySelector(".side-header").textContent = "New Item";

        buttonDiv.appendChild(add);
        buttonDiv.appendChild(cancel);

        window.requestAnimationFrame(() => {
            sideMenu.style.width = "25%";
            document.querySelector(".opacity-bg").style.width = "100%";
        });
    }

    const editTodoMenu = todo => {
        clearsideMenu();
        const sideMenu = document.querySelector(".side-menu");
        const buttonDiv = document.getElementById("buttons");
        const sideHeader = document.querySelector(".side-header");
        const title = document.getElementById("title");
        title.value = todo.title;
        const desc = document.getElementById("description");
        description.value = todo.description;
        const priority = document.getElementById("priority");
        priority.value = todo.priority;
        const date = document.getElementById("date");
        date.value = todo.date;

        const save = document.createElement("button");
        save.textContent = "Save";
        save.addEventListener("click", ()=> {
            mainController.editTodo({
                index: todo.index,
                title: title.value,
                description: desc.value,
                priority: priority.value,
                date: date.value
            });
            closeSideMenu();
        });
        const cancel = document.createElement("button");
        cancel.textContent = "Cancel";
        cancel.addEventListener("click", () => {
            closeSideMenu();
        });
        const deleteTodo = document.createElement("button");
        deleteTodo.textContent = "Delete";
        deleteTodo.addEventListener("click", () => {
            mainController.deleteTodo(todo.index);
            closeSideMenu();
        });


        document.querySelector(".side-header").textContent = "View/Edit Item";

        buttonDiv.appendChild(save);
        buttonDiv.appendChild(cancel);
        buttonDiv.appendChild(deleteTodo);

        window.requestAnimationFrame(() => {
            sideMenu.style.width = "25%";
            document.querySelector(".opacity-bg").style.width = "100%";
        });
    }

    const openNavBar = () => {
        document.querySelector(".nav-bar").style.width = "20%";
    }

    const closeNavBar = () => {
        document.querySelector(".nav-bar").style.width = "0";
    }

    //resets the contents of the side menu
    const clearsideMenu = () => {
        const buttonDiv = document.getElementById("buttons");
        buttonDiv.textContent = "";
        document.querySelector(".side-header").textContent = "";
        const title = document.getElementById("title");
        title.value = "";
        const desc = document.getElementById("description")
        desc.value = "";
        const priority = document.getElementById("priority")
        priority.value = "3";
        const date = document.getElementById("date")
        date.value = "";
    }

    //close this side menu
    const closeSideMenu = () => {
        document.querySelector(".side-menu").style.width = "0";
        document.querySelector(".opacity-bg").style.width = "0";
    }

    return {
        pageSetup,
        navSetup,
        containerSetup,
        projectTabSetup,
    }
})();

export { displayController }