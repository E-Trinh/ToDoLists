import { projectManage } from "./projectManage.js";
import { displayController } from "./displayController.js";

//mainController module, handles interaction between the view and model

const mainController = (function() {
    const initialize = () => {
        displayController.pageSetup();
    }

    initialize();
})();