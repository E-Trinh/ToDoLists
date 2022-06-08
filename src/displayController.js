import mainController from "./index";

// displayController module, handles all DOM controls for the mainController module
const displayController = (() => {
  const openNavBar = () => {
    document.querySelector(".nav-bar").style.width = "20%";
  };

  const closeNavBar = () => {
    document.querySelector(".nav-bar").style.width = "0";
  };

  // resets the contents of the side menu
  const clearSideMenu = () => {
    const buttonDiv = document.getElementById("buttons");
    buttonDiv.textContent = "";
    document.querySelector(".side-header").textContent = "";
    const title = document.getElementById("title");
    title.value = "";
    const desc = document.getElementById("description");
    desc.value = "";
    const priority = document.getElementById("priority");
    priority.value = "3";
    const date = document.getElementById("date");
    date.value = "";
  };

  // close this side menu
  const closeSideMenu = () => {
    document.querySelector(".side-menu").style.width = "0";
    document.querySelector(".opacity-bg").style.width = "0";
  };

  const renameProjectEventListener = (event) => {
    mainController.renameProject(
      event.target.dataset.index,
      event.target.textContent
    );
  };

  // function for setting up the layout of the side menu
  const todoMenuSetup = () => {
    const sideMenu = document.querySelector(".side-menu");
    const header = document.createElement("h1");
    header.classList.toggle("side-header");
    header.textContent = "";
    const title = document.createElement("input");
    title.type = "text";
    title.placeholder = "Title";
    title.id = "title";

    const desc = document.createElement("textarea");
    desc.rows = "4";
    desc.placeholder = "Description";
    desc.id = "description";

    const priorityLabel = document.createElement("label");
    priorityLabel.for = "priority";
    priorityLabel.textContent = "Priority";

    const priority = document.createElement("select");
    priority.id = "priority";

    const low = document.createElement("option");
    low.textContent = "Low";
    low.value = "3";
    low.selected = true;

    const medium = document.createElement("option");
    medium.textContent = "Medium";
    medium.value = "2";

    const high = document.createElement("option");
    high.textContent = "High";
    high.value = "1";

    const dateLabel = document.createElement("label");
    dateLabel.for = "date";
    dateLabel.textContent = "Date";

    const date = document.createElement("input");
    date.type = "date";
    date.id = "date";

    const buttonDiv = document.createElement("div");
    buttonDiv.classList.toggle("button-div");
    buttonDiv.id = "buttons";

    priority.appendChild(high);
    priority.appendChild(medium);
    priority.appendChild(low);

    sideMenu.appendChild(header);
    sideMenu.appendChild(title);
    sideMenu.appendChild(desc);
    sideMenu.appendChild(priorityLabel);
    sideMenu.appendChild(priority);
    sideMenu.appendChild(dateLabel);
    sideMenu.appendChild(date);
    sideMenu.appendChild(buttonDiv);
  };

  // sets up the side menu with controls specific to creating a todo object
  const newTodoMenu = () => {
    clearSideMenu();
    const sideMenu = document.querySelector(".side-menu");
    // const sideHeader = document.querySelector(".side-header");
    const buttonDiv = document.getElementById("buttons");
    const title = document.getElementById("title");
    const desc = document.getElementById("description");
    const priority = document.getElementById("priority");
    const date = document.getElementById("date");

    const add = document.createElement("button");
    add.textContent = "Add";
    add.addEventListener("click", () => {
      mainController.addTodo({
        title: title.value,
        description: desc.value,
        priority: priority.value,
        date: date.value,
      });
      closeSideMenu();
    });
    const cancel = document.createElement("button");
    cancel.textContent = "Cancel";
    cancel.addEventListener("click", () => {
      closeSideMenu();
    });

    document.querySelector(".side-header").textContent = "New Item";

    buttonDiv.appendChild(add);
    buttonDiv.appendChild(cancel);

    window.requestAnimationFrame(() => {
      sideMenu.style.width = "25%";
      document.querySelector(".opacity-bg").style.width = "100%";
    });
  };

  const editTodoMenu = (todo) => {
    clearSideMenu();
    const sideMenu = document.querySelector(".side-menu");
    const buttonDiv = document.getElementById("buttons");
    // const sideHeader = document.querySelector(".side-header");
    const title = document.getElementById("title");
    title.value = todo.title;
    const desc = document.getElementById("description");
    desc.value = todo.description;
    const priority = document.getElementById("priority");
    priority.value = todo.priority;
    const date = document.getElementById("date");
    date.value = todo.date;

    const save = document.createElement("button");
    save.textContent = "Save";
    save.addEventListener("click", () => {
      mainController.editTodo({
        index: todo.index,
        title: title.value,
        description: desc.value,
        priority: priority.value,
        date: date.value,
      });
      closeSideMenu();
    });
    const cancel = document.createElement("button");
    cancel.textContent = "Cancel";
    cancel.addEventListener("click", () => {
      closeSideMenu();
    });
    const deleteTodo = document.createElement("button");
    deleteTodo.textContent = "Delete";
    deleteTodo.addEventListener("click", () => {
      mainController.deleteTodo(todo.index);
      closeSideMenu();
    });

    document.querySelector(".side-header").textContent = "View/Edit Item";

    buttonDiv.appendChild(save);
    buttonDiv.appendChild(cancel);
    buttonDiv.appendChild(deleteTodo);

    window.requestAnimationFrame(() => {
      sideMenu.style.width = "25%";
      document.querySelector(".opacity-bg").style.width = "100%";
    });
  };

  // adds elements to the navigation bar
  const navSetup = (projects) => {
    const navBar = document.querySelector(".nav-bar");
    navBar.textContent = "";

    const header = document.createElement("h1");
    header.textContent = "Todo's";
    navBar.appendChild(header);

    const sourceLink = document.createElement("a");
    sourceLink.textContent = "View Source";
    sourceLink.target = "_blank";
    sourceLink.href = "https://github.com/E-Trinh/ToDoLists";
    navBar.appendChild(sourceLink);

    const collaspe = document.createElement("span");
    collaspe.textContent = "x";
    collaspe.addEventListener("click", closeNavBar);
    navBar.appendChild(collaspe);

    // default project, Home
    const defaultProject = document.createElement("p");
    defaultProject.textContent = "Home";
    defaultProject.addEventListener("click", () => {
      mainController.selectProject("default");
    });
    navBar.appendChild(defaultProject);

    const projectsTag = document.createElement("p");
    projectsTag.textContent = "Projects";
    projectsTag.addEventListener("click", () => {
      mainController.showProjects();
    });
    navBar.appendChild(projectsTag);

    // adds elements for the name of each projects
    projects.forEach((proj) => {
      const nameTag = document.createElement("p");
      nameTag.dataset.index = proj.index;
      nameTag.textContent = proj.name;
      nameTag.addEventListener("click", (event) => {
        mainController.selectProject(event.target.dataset.index);
      });
      navBar.appendChild(nameTag);
    });

    // function is called whenever the user tries to make an new project user document elements
    const newProjectEventListener = event => {
      const name = event.target.textContent;
      if (name !== "+ New Project" && name !== "") {
        mainController.addProject(name);
      }
      const newProjTag = document.querySelector("new-project-tag");
      newProjTag.textContent = "+ New Project";
      newProjTag.blur();
    };

    // element used for creating new project from the navigation bar
    const newProject = document.createElement("p");
    newProject.id = ("new-project-tag");
    newProject.textContent = "+ New Project";
    newProject.contentEditable = true;
    newProject.addEventListener("click", () => {
      newProject.textContent = "";
    });
    newProject.addEventListener("keyup", (event) => {
      if (event.code === "Enter") {
        newProjectEventListener(event);
      }
    });
    newProject.addEventListener("blur", newProjectEventListener);
    navBar.appendChild(newProject);
  };

  // function is used for displaying the contents of the main container
  const containerSetup = (todos) => {
    const container = document.querySelector(".main-container");
    container.textContent = "";

    const openNav = document.createElement("span");
    openNav.textContent = "☰";
    openNav.addEventListener("click", openNavBar);
    container.appendChild(openNav);

    const header = document.createElement("h1");
    [header.textContent] = todos;
    container.appendChild(header);

    const allTodoContainer = document.createElement("div");
    allTodoContainer.classList.toggle("all-todo-container");

    const keyContainer = document.createElement("div");
    keyContainer.classList.toggle("key-container");
    const complete = document.createElement("p");
    complete.textContent = "Complete";
    complete.classList.toggle("priority");
    const priority = document.createElement("p");
    priority.textContent = "Priority";
    priority.classList.toggle("priority");
    const todo = document.createElement("p");
    todo.textContent = "Title";
    todo.classList.toggle("todo-title");
    const due = document.createElement("p");
    due.textContent = "Due";
    due.classList.toggle("due");
    keyContainer.appendChild(complete);
    keyContainer.appendChild(priority);
    keyContainer.appendChild(todo);
    keyContainer.appendChild(due);
    allTodoContainer.appendChild(keyContainer);

    for (let i = 1; i < todos.length; i += 1) {
      const todoContainer = document.createElement("div");
      todoContainer.classList.toggle("todo-container");
      todoContainer.dataset.index = i - 1;
      todoContainer.dataset.description = todos[i].description;

      const completeCheck = document.createElement("input");
      completeCheck.type = "checkbox";
      completeCheck.classList.toggle("complete");
      completeCheck.dataset.index = i - 1;
      completeCheck.checked = todos[i].complete;
      completeCheck.addEventListener("change", (event) => {
        event.stopPropagation();
        if (event.target.checked) {
          mainController.setComplete(event.target.dataset.index, true);
        } else {
          mainController.setComplete(event.target.dataset.index, false);
        }
      });

      const priorityTag = document.createElement("p");
      priorityTag.dataset.priority = todos[i].priority;
      if (todos[i].priority === 1) {
        priorityTag.textContent = "High";
      } else if (todos[i].priority === 2) {
        priorityTag.textContent = "Medium";
      } else {
        priorityTag.textContent = "Low";
      }
      priorityTag.classList.toggle("priority");

      const todoTag = document.createElement("p");
      todoTag.textContent = todos[i].title;
      todoTag.classList.toggle("todo-title");

      const dueTag = document.createElement("p");
      dueTag.textContent = todos[i].due;
      dueTag.classList.toggle("due");

      todoContainer.addEventListener("click", (event) => {
        if (!event.target.classList.contains("complete")) {
          editTodoMenu({
            index: todoContainer.dataset.index,
            title: todoTag.textContent,
            description: todoContainer.dataset.description,
            priority: priorityTag.dataset.priority,
            date: dueTag.textContent,
          });
        }
      });
      todoContainer.appendChild(completeCheck);
      todoContainer.appendChild(priorityTag);
      todoContainer.appendChild(todoTag);
      todoContainer.appendChild(dueTag);
      allTodoContainer.appendChild(todoContainer);
    }

    container.appendChild(allTodoContainer);

    const newTodo = document.createElement("button");
    newTodo.classList.toggle("new-todo-button");
    newTodo.textContent = "New Todo Item";
    newTodo.addEventListener("click", newTodoMenu);
    allTodoContainer.appendChild(newTodo);
  };

  // shows a list of all the user projects
  const projectTabSetup = (projects) => {
    const container = document.querySelector(".main-container");
    container.textContent = "";

    const openNav = document.createElement("span");
    openNav.textContent = "☰";
    openNav.addEventListener("click", openNavBar);
    container.appendChild(openNav);

    const header = document.createElement("h1");
    header.textContent = "All Projects";
    container.appendChild(header);

    const allProjectContainer = document.createElement("div");
    allProjectContainer.classList.toggle("all-project-container");

    const keyContainer = document.createElement("div");
    keyContainer.classList.toggle("key-container");
    const projectNameKey = document.createElement("p");
    projectNameKey.classList.toggle("project-name");
    projectNameKey.textContent = "Project Name";
    const projectSizeKey = document.createElement("p");
    projectSizeKey.classList.toggle("project-size");
    projectSizeKey.textContent = "Todo Count";
    const projectDeleteKey = document.createElement("p");
    projectDeleteKey.classList.toggle("project-delete-key");
    projectDeleteKey.textContent = "Delete";
    keyContainer.appendChild(projectNameKey);
    keyContainer.appendChild(projectSizeKey);
    keyContainer.appendChild(projectDeleteKey);
    allProjectContainer.appendChild(keyContainer);

    for (let i = 0; i < projects.length; i += 1) {
      const projectContainer = document.createElement("div");
      projectContainer.classList.toggle("project-container");

      const projectName = document.createElement("p");
      projectName.classList.toggle("project-name");
      projectName.textContent = projects[i].name;
      projectName.dataset.index = i;
      projectName.contentEditable = true;
      projectName.addEventListener("keyup", (event) => {
        if (event.code === "Enter") {
          renameProjectEventListener(event);
        }
      });
      projectName.addEventListener("blur", renameProjectEventListener);

      const projectCount = document.createElement("p");
      projectCount.classList.toggle("project-size");
      projectCount.textContent = projects[i].count;

      const projectDelete = document.createElement("button");
      projectDelete.classList.toggle("project-delete");
      projectDelete.textContent = "Delete";
      projectDelete.dataset.index = i;
      projectDelete.addEventListener("click", (event) => {
        mainController.deleteProject(event.target.dataset.index);
      });

      projectContainer.appendChild(projectName);
      projectContainer.appendChild(projectCount);
      projectContainer.appendChild(projectDelete);
      allProjectContainer.appendChild(projectContainer);
    }
    container.appendChild(allProjectContainer);
  };

  // used for initial set up of HTML document, adds the main containers and calls functions to add default items to them
  const pageSetup = (projects, todos) => {
    const navBar = document.createElement("div");
    navBar.classList.toggle("nav-bar");

    const mainView = document.createElement("div");
    mainView.classList.toggle("main-container");

    const menuDiv = document.createElement("div");
    menuDiv.classList.toggle("side-menu");

    const opacityDiv = document.createElement("div");
    opacityDiv.classList.toggle("opacity-bg");
    opacityDiv.addEventListener("click", () => {
      window.requestAnimationFrame(() => {
        closeSideMenu();
      });
    });

    const storageUseDiv = document.createElement("div");
    storageUseDiv.classList.toggle("storage");
    const storageUseText = document.createElement("p");
    storageUseText.textContent =
      "This site uses local storage to store all user projects and todo items locally when the website is closed.";
    const storageUseClose = document.createElement("span");
    storageUseClose.textContent = "x";
    storageUseClose.addEventListener("click", () => {
      document.body.removeChild(storageUseDiv);
    });
    storageUseDiv.appendChild(storageUseText);
    storageUseDiv.appendChild(storageUseClose);
    document.body.appendChild(storageUseDiv);

    const content = document.getElementById("content");
    content.appendChild(navBar);
    content.appendChild(mainView);
    content.appendChild(menuDiv);
    content.appendChild(opacityDiv);
    navSetup(projects);
    containerSetup(todos);
    todoMenuSetup();
  };

  return {
    pageSetup,
    navSetup,
    containerSetup,
    projectTabSetup,
  };
})();

export default displayController;
