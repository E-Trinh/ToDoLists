import { projectManage } from "./projectManage.js";
import { displayController } from "./displayController.js";
import './styles.css';

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

export { mainController }