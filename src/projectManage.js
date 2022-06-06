import { project } from "./project";

const projectManage = (function() {
    const defaultProject = project("default");
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
        projectNum
    };
})();

export { projectManage };