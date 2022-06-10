import project from "./project";

// projectManage module, contains the logic for managing the projects

const projectManage = (() => {
  // the current project the user is working on, default is for the defaultProject, an integer is for the index of the userProject
  let currentProject = "default";
  const defaultProject = project("Home");
  const userProjects = [];

  const getdefaultProject = () => defaultProject;

  const projectNum = () => userProjects.length;

  // returns the project at the index
  const getProject = (index) => {
    if (index === "default") {
      return defaultProject;
    }
    return userProjects[index];
  };

  // returns the name and length as objects in an array for all user projects
  const getProjectInfo = () => {
    const info = [];
    for (let i = 0; i < projectNum(); i += 1) {
      info.push({
        name: getProject(i).name,
        count: getProject(i).length(),
      });
    }
    return info;
  };

  // returns the name of the project and the todos in the project as an array, the first element in the array is the name followed by todos. If no index is set then gets the project data for the currently selected project. If index is set, it sets the currentProject to the index
  const getProjectInfoName = (index) => {
    let todos = [];
    if (index === undefined) {
      todos = [getProject(currentProject).name].concat(
        getProject(currentProject).getAllTodos()
      );
    } else if (index === "default") {
      currentProject = "default";
      todos = [getdefaultProject().name].concat(
        getdefaultProject().getAllTodos()
      );
    } else {
      currentProject = index;
      todos = [getProject(index).name].concat(getProject(index).getAllTodos());
    }
    return todos;
  };

  // creates a new project in userProjects, selects the project as currentProject and returns the project info
  const newProject = (name) => {
    userProjects.push(project(name));
    return getProjectInfoName(projectNum() - 1);
  };

  // creates a new project without returning or selecting the project
  const addProject = (name) => {
    userProjects.push(project(name));
  };

  // removes the userProject at the index
  const deleteProject = (index) => {
    userProjects.splice(index, 1);
  };

  // renames the project and returns the updated list of project names and lengths
  const renameProject = (index, name) => {
    getProject(index).name = name;
    return getProjectInfo();
  };

  // adds a todo to currentProject
  const addTodo = (newTodo) => {
    getProject(currentProject).addTodo(
      newTodo.title,
      newTodo.description,
      newTodo.due,
      newTodo.priority
    );
  };

  // edits a todo in currentProject at the index
  const editTodo = (editedTodo) => {
    getProject(currentProject).editTodo(
      parseInt(editedTodo.index, 10),
      editedTodo
    );
  };

  // sets the completion status of a todo in currentProject at the index
  const setCompletion = (index, status) => {
    if (currentProject === "default") {
      getdefaultProject().getTodo(index).completion = status;
    } else {
      getProject(currentProject).getTodo(index).completion = status;
    }
  };

  // removes a todo at the index in currentProject
  const deleteTodo = (index) => {
    if (currentProject === "default") {
      getdefaultProject().deleteTodo(index);
    } else {
      getProject(currentProject).deleteTodo(index);
    }
  };

  // stores projects and todos in local storage
  const save = () => {
    localStorage.clear();
    // saves the default project
    localStorage.setItem("count", projectNum());
    const defaultProj = [];
    defaultProj.push(getdefaultProject().name);
    for (let i = 0; i < getdefaultProject().length(); i += 1) {
      const todo = getdefaultProject().getTodo(i);
      defaultProj.push(JSON.stringify(todo));
    }
    // saves the user created projects
    localStorage.setItem(0, JSON.stringify(defaultProj));
    for (let i = 0; i < projectNum(); i += 1) {
      const proj = [];
      proj.push(getProject(i).name);
      for (let j = 0; j < getProject(i).length(); j += 1) {
        const todo = getProject(i).getTodo(j);
        proj.push(JSON.stringify(todo));
      }
      localStorage.setItem(i + 1, JSON.stringify(proj));
    }
  };

  // checks if there is any previous data in local storage and retrieves it
  const restore = () => {
    // retrieves any todo objects for the default project
    const defaultProj = JSON.parse(localStorage.getItem(0));
    if (defaultProj) {
      [getdefaultProject().name] = defaultProj;
      for (let i = 1; i < defaultProj.length; i += 1) {
        projectManage
          .getdefaultProject()
          .addFullTodo(JSON.parse(defaultProj[i]));
      }
    }
    // retrieves any user projects and todo objects in local storage
    const count = localStorage.getItem("count");
    if (count) {
      for (let i = 1; i < parseInt(count, 10) + 1; i += 1) {
        const proj = JSON.parse(localStorage[i]);
        addProject(proj[0]);
        for (let j = 1; j < proj.length; j += 1) {
          getProject(i - 1).addFullTodo(JSON.parse(proj[j]));
        }
      }
    }
    const projects = getProjectInfo();
    const todos = [getdefaultProject().name].concat(
      getdefaultProject().getAllTodos()
    );
    return { projects, todos };
  };

  return {
    getdefaultProject,
    newProject,
    getProject,
    deleteProject,
    renameProject,
    projectNum,
    getProjectInfo,
    getProjectInfoName,
    addTodo,
    editTodo,
    setCompletion,
    deleteTodo,
    save,
    restore,
  };
})();

export default projectManage;
