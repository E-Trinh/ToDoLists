import projectManage from "./projectManage";

// displayController module, only handles the DOM and user interactions
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

  // closes the side menu
  const closeSideMenu = () => {
    document.querySelector(".side-menu").style.width = "0";
    document.querySelector(".opacity-bg").style.width = "0";
  };

  // sets up the side menu with the selected todo object data for editing
  const editTodoMenu = (todo) => {
    // removing any previous data in side menu and updating elements with selected todo data
    clearSideMenu();
    const sideMenu = document.querySelector(".side-menu");
    const buttonDiv = document.getElementById("buttons");
    const title = document.getElementById("title");
    title.value = todo.title;
    const desc = document.getElementById("description");
    desc.value = todo.description;
    const priority = document.getElementById("priority");
    priority.value = todo.priority;
    const date = document.getElementById("date");
    date.value = todo.date;

    // when the user saves the todo, calls the editTodo method to update the changes in the projectManage
    const save = document.createElement("button");
    save.textContent = "Save";
    save.addEventListener("click", () => {
      projectManage.editTodo({
        index: todo.index,
        title: title.value,
        description: desc.value,
        priority: priority.value,
        due: date.value,
      });
      containerSetup(projectManage.getProjectInfoName());
      closeSideMenu();
    });

    // closes the side menu
    const cancel = document.createElement("button");
    cancel.textContent = "Cancel";
    cancel.addEventListener("click", () => {
      closeSideMenu();
    });

    // rremoves the selected todo from the project in projectManage
    const deleteTodo = document.createElement("button");
    deleteTodo.textContent = "Delete";
    deleteTodo.addEventListener("click", () => {
      projectManage.deleteTodo(todo.index);
      containerSetup(projectManage.getProjectInfoName());
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

  // sets the main container for showing the user a project and its todos with buttons for interaction
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

    // adding elements to the container as a key
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

    // adding elements to the document for each todo object in the project
    for (let i = 1; i < todos.length; i += 1) {
      const todoContainer = document.createElement("div");
      todoContainer.classList.toggle("todo-container");
      todoContainer.dataset.index = i - 1;
      todoContainer.dataset.description = todos[i].description;

      // check box for marking a todo as complete or incomplete
      const completeCheck = document.createElement("input");
      completeCheck.type = "checkbox";
      completeCheck.classList.toggle("complete");
      completeCheck.dataset.index = i - 1;
      completeCheck.checked = todos[i].completion;
      completeCheck.addEventListener("change", (event) => {
        event.stopPropagation();
        projectManage.setCompletion(
          event.target.dataset.index,
          event.target.checked
        );
      });

      // tag showing the user the priority of a todo
      const priorityTag = document.createElement("p");
      priorityTag.dataset.priority = todos[i].priority;
      if (todos[i].priority === "1") {
        priorityTag.textContent = "High";
      } else if (todos[i].priority === "2") {
        priorityTag.textContent = "Medium";
      } else {
        priorityTag.textContent = "Low";
      }
      priorityTag.classList.toggle("priority");

      // tag with the title of the todo
      const todoTag = document.createElement("p");
      todoTag.textContent = todos[i].title;
      todoTag.classList.toggle("todo-title");

      // tag with the due data of the todo
      const dueTag = document.createElement("p");
      dueTag.textContent = todos[i].due;
      dueTag.classList.toggle("due");

      // when the todo is clicked opens the side menu to allow the user to edit the todo object
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

    // button for opening the side menu to create a new todo object
    const newTodo = document.createElement("button");
    newTodo.classList.toggle("new-todo-button");
    newTodo.textContent = "New Todo Item";
    newTodo.addEventListener("click", newTodoMenu);
    allTodoContainer.appendChild(newTodo);
  };

  // sets up the navigation bar elements and adds event listeners
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
      containerSetup(projectManage.getProjectInfoName("default"));
    });
    navBar.appendChild(defaultProject);

    // changes the main container to show the all project information
    const projectsTag = document.createElement("p");
    projectsTag.textContent = "Projects";
    projectsTag.addEventListener("click", () => {
      projectTabSetup(projectManage.getProjectInfo());
    });
    navBar.appendChild(projectsTag);

    // adds elements for the name of each projects
    for (let i = 0; i < projects.length; i += 1) {
      // when the name of a project is clicked, update the main container to show the details of the selected proejct
      const nameTag = document.createElement("p");
      nameTag.dataset.index = i;
      nameTag.textContent = projects[i].name;
      nameTag.addEventListener("click", (event) => {
        containerSetup(
          projectManage.getProjectInfoName(event.target.dataset.index)
        );
      });
      navBar.appendChild(nameTag);
    }

    // event listener for creating a new project
    const newProjectEventListener = (event) => {
      const name = event.target.textContent;
      if (name !== "+ New Project" && name !== "") {
        containerSetup(projectManage.newProject(name));
        navSetup(projectManage.getProjectInfo());
      }
      const newProjTag = document.querySelector("#new-project-tag");
      newProjTag.textContent = "+ New Project";
      newProjTag.blur();
    };

    // element used for creating a new project from the navigation bar
    const newProject = document.createElement("p");
    newProject.id = "new-project-tag";
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

  const renameProjectEventListener = (event) => {
    const projData = projectManage.renameProject(
      event.target.dataset.index,
      event.target.textContent
    );
    navSetup(projData);
  };

  // adds the needed elements to the side menu used for creating and editing todos
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

  // updates the elements in the side menu for creating a new todo
  const newTodoMenu = () => {
    // clears all fields in the side menu
    clearSideMenu();
    const sideMenu = document.querySelector(".side-menu");
    const buttonDiv = document.getElementById("buttons");
    const title = document.getElementById("title");
    const desc = document.getElementById("description");
    const priority = document.getElementById("priority");
    const date = document.getElementById("date");

    // gets the user input and creates a new todo for the selected project
    const add = document.createElement("button");
    add.textContent = "Add";
    add.addEventListener("click", () => {
      projectManage.addTodo({
        title: title.value,
        description: desc.value,
        priority: priority.value,
        due: date.value,
      });
      containerSetup(projectManage.getProjectInfoName());
      closeSideMenu();
    });

    // closes the side menu
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

  // shows a list of all the user projects with name, length, and option to delete
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

    // elements containing keys to show user the name, length, and delete button
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

    // adds elements to the div for each project
    for (let i = 0; i < projects.length; i += 1) {
      const projectContainer = document.createElement("div");
      projectContainer.classList.toggle("project-container");

      // tag for the project title, when clicked user can change the name of the project
      const projectName = document.createElement("p");
      projectName.classList.toggle("project-name");
      projectName.textContent = projects[i].name;
      projectName.dataset.index = i;
      projectName.contentEditable = true;
      projectName.addEventListener("keyup", (event) => {
        if (event.code === "Enter") {
          event.target.blur();
        }
      });
      projectName.addEventListener("blur", renameProjectEventListener);

      // tag showing the number of todos objects in a project
      const projectCount = document.createElement("p");
      projectCount.classList.toggle("project-size");
      projectCount.textContent = projects[i].count;

      // button for deleting a project
      const projectDelete = document.createElement("button");
      projectDelete.classList.toggle("project-delete");
      projectDelete.textContent = "Delete";
      projectDelete.dataset.index = i;
      projectDelete.addEventListener("click", (event) => {
        projectManage.deleteProject(event.target.dataset.index);
        const projectInfo = projectManage.getProjectInfo();
        projectTabSetup(projectInfo);
        navSetup(projectInfo);
      });

      projectContainer.appendChild(projectName);
      projectContainer.appendChild(projectCount);
      projectContainer.appendChild(projectDelete);
      allProjectContainer.appendChild(projectContainer);
    }
    container.appendChild(allProjectContainer);
  };

  // used for initial set up of HTML document, adds the main containers and calls functions to add default items to them
  const pageSetup = () => {
    const data = projectManage.restore();
    window.onbeforeunload = projectManage.save;
    const { projects } = data;
    const { todos } = data;
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
    projectManage.getProjectInfoName();
  };

  return {
    pageSetup,
  };
})();

export default displayController;
