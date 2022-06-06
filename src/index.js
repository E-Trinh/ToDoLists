import { projectManage } from "./projectManage.js";
import './styles.css';

//displayController module, handles all DOM controls for the mainController module
const displayController = (function() {
    const pageSetup = () => {
        const navBar = document.createElement("div");
        navBar.classList.toggle("nav-bar");

        const mainView = document.createElement("div");
        mainView.classList.toggle("main-container");

        document.getElementById("content").appendChild(navBar);
        document.getElementById("content").appendChild(mainView);
        navSetup();
    };

    const navSetup = () => {
        const navBar = document.querySelector(".nav-bar");
        navBar.textContent = "";

        const header = document.createElement("h1");
        header.textContent = "Todo's";
        
        const defaultProject = document.createElement("p");
        defaultProject.textContent = "Home";

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

        navBar.appendChild(header);
        navBar.appendChild(defaultProject);
        navBar.appendChild(newProject);
    }

    //function is called whenever the user tries to make an new project user document elements
    const newProjectEventListener = event => {
        const name = event.target.textContent;
        if (name != "+ New Project" && name != "") {
            console.log(name);
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
        displayController.pageSetup();
    }

    initialize();

    const addProject = name => {
        projectManage.newProject(name);
        displayController.navSetup();
    }

    return {
        addProject,
    }
})();