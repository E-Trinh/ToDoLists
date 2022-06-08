import project from "./project";

// projectManage module, contains the logic for managing the projects

const projectManage = (() => {
  const defaultProject = project("Home");
  const userProjects = [];

  const getdefaultProject = () => defaultProject;

  const newProject = (name) => {
    userProjects.push(project(name));
  };

  const getProject = (index) => userProjects[index];

  const deleteProject = (index) => {
    userProjects.splice(index, 1);
  };

  const projectNum = () => userProjects.length;

  return {
    getdefaultProject,
    newProject,
    getProject,
    deleteProject,
    projectNum,
  };
})();

export default projectManage;
