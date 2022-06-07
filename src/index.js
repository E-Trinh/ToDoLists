import { projectManage } from "./projectManage.js";
import './styles.css';

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

        for (let i = 1; i < todos.length; i++) {
            const todo = document.createElement("p");
            todo.textContent = todos[i].title;
            todo.dataset.index = i - 1;
            todo.dataset.description = todos[i].description;
            todo.dataset.priority = todos[i].priority;
            todo.dataset.date = todos[i].due;
            todo.addEventListener("click", event => {
                editTodoMenu({
                    index: todo.dataset.index,
                    title: todo.textContent,
                    description: todo.dataset.description,
                    priority: todo.dataset.priority,
                    date: todo.dataset.date
                });
            });
            container.appendChild(todo);
        }

        const newTodo = document.createElement("button");
        newTodo.textContent = "New Todo Item";
        newTodo.addEventListener("click", newTodoMenu);
        container.appendChild(newTodo);
    }

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
    }
})();

//mainController module, handles interaction between the view and model
const mainController = (function() {
    let currentProj = "default";

    //used for initial setup of the page, sends the project and todo information to displayController to display
    const initialize = () => {
        const projects = [];
        const todos = [];
        for (let i = 0; i < projectManage.projectNum(); i++) {
            projects.push(projectManage.getProject(i).name)
        }
        todos.push(projectManage.getdefaultProject().name);
        for (let i = 0; i < projectManage.getdefaultProject().length(); i++) {
            todos.push(projectManage.getdefaultProject().getTodo(i));
        }
        displayController.pageSetup(projects, todos);
    }

    initialize();

    //function for adding a new project to the model and view
    const addProject = name => {
        projectManage.newProject(name);
        const projects = [];
        for (let i = 0; i < projectManage.projectNum(); i++) {
            projects.push({
                name: projectManage.getProject(i).name,
                index: i,
            });
        }
        displayController.navSetup(projects);
    }

    //function for displaying a project, gets the project data from model and uses displayController to display it
    const selectProject = index => {
        const todos = [];
        if (index === "default") {
            currentProj = "default";
            todos.push(projectManage.getdefaultProject().name);
            for (let i = 0; i < projectManage.getdefaultProject().length(); i++) {
                todos.push(projectManage.getdefaultProject().getTodo(i));
            }
        } else {
            currentProj = index;
            todos.push(projectManage.getProject(index).name);
            for (let i = 0; i < projectManage.getProject(index).length(); i++) {
                todos.push(projectManage.getProject(index).getTodo(i));
            }
        }
        displayController.containerSetup(todos);
    }

    //accepts an object as a parameter and adds a new todo to the currently selected project
    const addTodo = obj => {
        if (currentProj === "default") {
            projectManage.getdefaultProject().addTodo(obj.title, obj.description, obj.date, obj.priority);
        } else {
            projectManage.getProject(currentProj).addTodo(obj.title, obj.description, obj.date, obj.priority);
        }
        selectProject(currentProj);
    }

    //accepts an object as parameter and modifies the todo item at the index in the obj argument
    const editTodo = obj => {
        if (currentProj === "default") {
            projectManage.getdefaultProject().editTodo(obj.index, obj);
        } else {
            projectManage.getProject(currentProj).editTodo(obj.index, obj);
        }
        selectProject(currentProj);
    }

    const deleteTodo = index => {
        if (currentProj === "default") {
            projectManage.getdefaultProject().deleteTodo(index);
        } else {
            projectManage.getProject(currentProj).deleteTodo(index);
        }
        selectProject(currentProj);
    }

    return {
        addProject,
        selectProject,
        addTodo,
        editTodo,
        deleteTodo,
    }
})();
