import { projectManage } from "./projectManage.js";
import './styles.css';

//displayController module, handles all DOM controls for the mainController module
const displayController = (function() {
    const pageSetup = projects => {
        const navBar = document.createElement("div");
        navBar.classList.toggle("nav-bar");

        const mainView = document.createElement("div");
        mainView.classList.toggle("main-container");

        document.getElementById("content").appendChild(navBar);
        document.getElementById("content").appendChild(mainView);
        navSetup(projects);
    };

    const navSetup = projects => {
        const navBar = document.querySelector(".nav-bar");
        navBar.textContent = "";

        const header = document.createElement("h1");
        header.textContent = "Todo's";
        
        const defaultProject = document.createElement("p");
        defaultProject.textContent = "Home";

        navBar.appendChild(header);
        navBar.appendChild(defaultProject);

        //adds elements for the name of each projects
        projects.forEach(name => {
            const nameTag = document.createElement("p");
            nameTag.textContent = name;
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

    const containerSetup = () => {
        const navBar = document.querySelector(".main-container");
        navBar.textContent = "";

        const header = document.createElement("h1");
        header.textContent = "";
    }

    return {
        pageSetup,
        navSetup,
    }
})();

//mainController module, handles interaction between the view and model
const mainController = (function() {
    const initialize = () => {
        const projects = [];
        for (let i = 0; i < projectManage.projectNum; i++) {
            projects.push(projectManage.getProject(i).name)
        }
        displayController.pageSetup(projects);
    }

    initialize();

    const addProject = name => {
        projectManage.newProject(name);
        const projects = [];
        for (let i = 0; i < projectManage.projectNum(); i++) {
            projects.push(projectManage.getProject(i).name);
        }
        displayController.navSetup(projects);
    }

    return {
        addProject,
    }
})();