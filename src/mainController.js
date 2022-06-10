import projectManage from "./projectManage";
import "./styles.css";

// mainController module, handles interaction between the view and model
const mainController = (() => {
  let currentProj = "default";

  const getProjectData = (index) => {
    let todos = [];
    if (index === "default") {
      currentProj = "default";
      todos = [projectManage.getdefaultProject().name].concat(
        projectManage.getdefaultProject().getAllTodos()
      );
    } else {
      currentProj = index;
      todos = [projectManage.getProject(index).name].concat(
        projectManage.getProject(index).getAllTodos()
      );
    }
    return todos;
  };

  const getCurrentProjectData = () => {
    let todos = [];
    if (currentProj === "default") {
      todos = [projectManage.getdefaultProject().name].concat(
        projectManage.getdefaultProject().getAllTodos()
      );
    } else {
      todos = [projectManage.getProject(parseInt(currentProj, 10)).name].concat(
        projectManage.getProject(parseInt(currentProj, 10)).getAllTodos()
      );
    }
    return todos;
  };

  // function for adding a new project to the model and view
  const addProject = (name) => {
    projectManage.newProject(name);
    return getProjectData(projectManage.projectNum() - 1);
  };

  // accepts an object as a parameter and adds a new todo to the currently selected project
  const addTodo = (obj) => {
    if (currentProj === "default") {
      projectManage
        .getdefaultProject()
        .addTodo(obj.title, obj.description, obj.date, obj.priority);
    } else {
      projectManage
        .getProject(currentProj)
        .addTodo(obj.title, obj.description, obj.date, obj.priority);
    }
  };

  // removes the todo object at the index for the selected project
  const deleteTodo = (index) => {
    if (currentProj === "default") {
      projectManage.getdefaultProject().deleteTodo(index);
    } else {
      projectManage.getProject(currentProj).deleteTodo(index);
    }
  };

  const setComplete = (index, status) => {
    if (currentProj === "default") {
      projectManage.getdefaultProject().getTodo(index).completion = status;
    } else {
      projectManage.getProject(currentProj).getTodo(index).completion = status;
    }
  };

  // renames the project at the index with the new name passed as an argument and returns update project info
  const renameProject = (index, name) => {
    projectManage.getProject(index).name = name;
    return projectManage.getProjectInfo();
  };

  const deleteProject = (index) => {
    projectManage.deleteProject(index);
    return projectManage.getProjectInfo();
  };

  const editTodo = undefined;

  return {
    addProject,
    getCurrentProjectData,
    getProjectData,
    addTodo,
    editTodo,
    deleteTodo,
    setComplete,
    renameProject,
    deleteProject,
  };
})();

export default mainController;
