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
            projects.push({
                name: projectManage.getProject(i).name,
                index: i,
            });
        }
        todos.push(projectManage.getdefaultProject().name);
        for (let i = 0; i < projectManage.getdefaultProject().length(); i++) {
            todos.push(projectManage.getdefaultProject().getTodo(i));
        }
        displayController.pageSetup(projects, todos);
    }

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

    //removes the todo object at the index for the selected project
    const deleteTodo = index => {
        if (currentProj === "default") {
            projectManage.getdefaultProject().deleteTodo(index);
        } else {
            projectManage.getProject(currentProj).deleteTodo(index);
        }
        selectProject(currentProj);
    }

    const setComplete = (index, status) => {
        if (currentProj === "default") {
            projectManage.getdefaultProject().getTodo(index).complete = status;
        } else {
            projectManage.getProject(currentProj).getTodo(index).complete = status;
        }
    }

    //gets the name and index for all projects and sends to displayController to display
    const showProjects = () => {
        const userProjects = [];
        for (let i = 0; i < projectManage.projectNum(); i++) {
            userProjects.push({
                name: projectManage.getProject(i).name,
                count: projectManage.getProject(i).length(),
            });
        }
        displayController.projectTabSetup(userProjects);
    }

    //renames the project at the index with the new name passed as an argument
    const renameProject = (index, name) => {
        projectManage.getProject(index).name = name;
        const projects = [];
        for (let i = 0; i < projectManage.projectNum(); i++) {
            projects.push({
                name: projectManage.getProject(i).name,
                index: i,
            });
        }
        displayController.navSetup(projects);
    }

    //deletes project and sends user project object data to displayController to update HTML document
    const deleteProject = index => {
        projectManage.deleteProject(index);
        const projects = [];
        for (let i = 0; i < projectManage.projectNum(); i++) {
            projects.push({
                name: projectManage.getProject(i).name,
                count: projectManage.getProject(i).length(),
                index: i,
            });
        }
        displayController.navSetup(projects);
        displayController.projectTabSetup(projects);
    }

    //stores projects and todos in local storage
    const save = () => {
        localStorage.clear();
        //saves the default project
        localStorage.setItem("count", projectManage.projectNum());
        const defaultProj = [];
        defaultProj.push(projectManage.getdefaultProject().name);
        for (let i = 0; i < projectManage.getdefaultProject().length(); i++) {
            const todo = projectManage.getdefaultProject().getTodo(i);
            defaultProj.push(JSON.stringify({
                title: todo.title,
                description: todo.description,
                due: todo.due,
                priority: todo.priority,
                completion: todo.completion
            }));
        }
        //saves the user created projects
        localStorage.setItem(0, JSON.stringify(defaultProj));
        for (let i = 0; i < projectManage.projectNum(); i++) {
            const proj = [];
            proj.push(projectManage.getProject(i).name);
            for (let j = 0; j < projectManage.getProject(i).length(); j++) {
                const todo = projectManage.getProject(i).getTodo(j);
                proj.push(JSON.stringify({
                    title: todo.title,
                    description: todo.description,
                    due: todo.due,
                    priority: todo.priority,
                    completion: todo.completion
                }));
            }
            localStorage.setItem(i + 1, JSON.stringify(proj));
        }
    };

    //checks if there is any previous data in local storage and retrieves it
    const restore = () => {
        //retrieves any todo objects for the default proejct
        const defaultProj = JSON.parse(localStorage.getItem(0));
        if (defaultProj) {
            projectManage.getdefaultProject().name = defaultProj[0];
            for (let i = 1; i < defaultProj.length; i++) {
                projectManage.getdefaultProject().addFullTodo(JSON.parse(defaultProj[i]));
            }
        }
        //retrieves any user projects and todo objects in local storage 
        const count = localStorage.getItem("count");
        if (count) {
            for (let i = 1; i < parseInt(count) + 1; i++) {
                const proj = JSON.parse(localStorage[i]);
                projectManage.newProject(proj[0]);
                for (let j = 1; j < proj.length; j++) {
                    projectManage.getProject(i - 1).addFullTodo(JSON.parse(proj[j]));
                }
            }
        }
        initialize();
    }

    return {
        addProject,
        selectProject,
        addTodo,
        editTodo,
        deleteTodo,
        setComplete,
        showProjects,
        renameProject,
        deleteProject,
        save,
        restore
    }
})();

mainController.restore();
window.onbeforeunload = mainController.save;

export { mainController }