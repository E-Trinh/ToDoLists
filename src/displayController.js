import './styles.css';

//displayController module, handles all dom controls for the mainController module

const displayController = (function() {
    const pageSetup = () => {
        const navBar = document.createElement("div");
        navBar.classList.toggle("nav-bar");

        const mainView = document.createElement("div");
        mainView.classList.toggle("main-container");

        document.getElementById("content").appendChild(navBar);
        document.getElementById("content").appendChild(mainView);
        navSetup();
    };

    const navSetup = () => {
        const navBar = document.querySelector(".nav-bar");
        navBar.textContent = "";

        const header = document.createElement("h1");
        header.textContent = "Todo's";
        
        const defaultProject = document.createElement("p");
        defaultProject.textContent = "Home";

        navBar.appendChild(header);
        navBar.appendChild(defaultProject);
    }

    return {
        pageSetup,
    }
})();

export { displayController }