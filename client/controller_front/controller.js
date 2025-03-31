import { createUser, inLog, newPassword, tokenSend, tokenValidate } from "./login.js";

let vista = new Vista();

document.addEventListener("DOMContentLoaded", () => {
    vista.mostrarPlantilla("template-login", "box-temp"); 
});

document.addEventListener("click", (e) => {
    switch (e.target.id) {
        case "btn-register-login":
            vista.mostrarPlantilla("template-register", "box-temp");
            document.getElementById("btn-register").addEventListener("click", createUser); 
            break;

        case "btn-back-login":
            vista.mostrarPlantilla("template-login", "box-temp");
            break;

        case "btn-forgot-password":
            vista.mostrarPlantilla("template-passrecovery", "box-temp");
            break;

        case "btn-back-pass-recovery":
            vista.mostrarPlantilla("template-passrecovery", "box-temp");
            break

        case "btn-send-email":
            tokenSend();
            break

        case "btn-send-token":
            tokenValidate();
            break
        
        case "btn-send-new-password":
            newPassword();
            break

        case "btn-login":
            inLog();
            break

        case "btn-log-out":
            vista.mostrarPlantilla("template-login", "box-temp")

        default:
            break;
    }
});
