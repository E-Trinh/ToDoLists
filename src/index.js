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

        const header = document.createElement("h1");
        header.textContent = todos[0];
        container.appendChild(header);

        for (let i = 1; i < todos.length; i++) {
            const todo = document.createElement("p");
            todo.textContent = todos[i].title;
            todo.dataset.index = i - 1;
            todo.addEventListener("click", event => {
                newTodoMenu();
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
        title.placeholder = "Title";
        title.id = "title"
        const desc = document.createElement("input");
        desc.placeholder = "Description";
        desc.id = "description"
        const priority = document.createElement("input");
        priority.placeholder = "Priority";
        priority.id = "priority"
        const date = document.createElement("input");
        date.placeholder = "Date";
        date.id = "date"
        const buttonDiv = document.createElement("div");
        buttonDiv.id = "buttons";

        sideMenu.appendChild(header);
        sideMenu.appendChild(title);
        sideMenu.appendChild(desc);
        sideMenu.appendChild(priority)
        sideMenu.appendChild(date);
        sideMenu.appendChild(buttonDiv);
    }

    //sets up the side menu with controls specific to creating a todo object
    const newTodoMenu = () => {
        const sideMenu = document.querySelector(".side-menu");

        const buttonDiv = document.getElementById("buttons");
        buttonDiv.textContent = "";

        document.querySelector(".side-header").textContent = "New Item";
        const title = document.getElementById("title");
        title.value = "";
        const desc = document.getElementById("description")
        desc.value = "";
        const priority = document.getElementById("priority")
        priority.value = "";
        const date = document.getElementById("date")
        date.value = "";

        const add = document.createElement("button");
        add.textContent = "Add";
        add.addEventListener("click", ()=> {
            mainController.addTodo({
                title: title.value,
                description: desc.value,
                priority: priority.value,
                date: date.value,
            });
            closeSideMenu();
        });
        const cancel = document.createElement("button");
        cancel.textContent = "Cancel";
        cancel.addEventListener("click", () => {
            closeSideMenu();
        });

        buttonDiv.appendChild(add);
        buttonDiv.appendChild(cancel);

        window.requestAnimationFrame(() => {
            sideMenu.style.width = "25%";
            document.querySelector(".opacity-bg").style.width = "100%";
        });
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
            projectManage.getdefaultProject().addTodo(obj.title, obj.description, obj,date, obj.priority);
            selectProject("default");
        } else {
            projectManage.getProject(currentProj).addTodo(obj.title, obj.description, obj,date, obj.priority);
            selectProject(currentProj);
        }
    }

    return {
        addProject,
        selectProject,
        addTodo,
    }
})();
