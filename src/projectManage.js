import { project } from "./project";

//projectManage module, contains the logic for managing the projects

const projectManage = (function() {
    const defaultProject = project("Home");
    const userProjects = [];

    const getdefaultProject = () => {
        return defaultProject;
    };

    const newProject = name => {
        userProjects.push(project(name));
    };

    const getProject = index => {
        return userProjects[index];
    };

    const deleteProject = index => {
        userProjects.splice(index, 1);
    };

    const projectNum = () => {
        return userProjects.length;
    };

    return {
        getdefaultProject,
        newProject,
        getProject,
        deleteProject,
        projectNum,
    };
})();

export { projectManage };