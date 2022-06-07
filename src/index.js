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
                document.querySelector(".side-menu").style.width = "0";
                document.querySelector(".opacity-bg").style.width = "0";
            });
        });

        document.getElementById("content").appendChild(navBar);
        document.getElementById("content").appendChild(mainView);
        document.getElementById("content").appendChild(menuDiv);
        document.getElementById("content").appendChild(opacityDiv);
        navSetup(projects);
        containerSetup(todos);
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
            container.appendChild(todo);
        }

        const newTodo = document.createElement("button");
        newTodo.textContent = "New Todo Item";
        newTodo.addEventListener("click", newTodoMenu);
        container.appendChild(newTodo);
    }

    const newTodoMenu = () => {
        window.requestAnimationFrame(() => {
            document.querySelector(".side-menu").style.width = "25%";
            document.querySelector(".opacity-bg").style.width = "100%";
        });
    }

    return {
        pageSetup,
        navSetup,
        containerSetup,
    }
})();

//mainController module, handles interaction between the view and model
const mainController = (function() {
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
            todos.push(projectManage.getdefaultProject().name);
            for (let i = 0; i < projectManage.getdefaultProject().length(); i++) {
                todos.push(projectManage.getdefaultProject().getTodo(i));
            }
        } else {
            todos.push(projectManage.getProject(index).name);
            for (let i = 0; i < projectManage.getProject(index).length(); i++) {
                todos.push(projectManage.getProject(index).getTodo(i));
            }
        }
        displayController.containerSetup(todos);
    }

    return {
        addProject,
        selectProject,
    }
})();
