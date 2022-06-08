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

  // returns the name of all user projects
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

  return {
    getdefaultProject,
    newProject,
    getProject,
    deleteProject,
    projectNum,
    getProjectInfo,
  };
})();

export default projectManage;
