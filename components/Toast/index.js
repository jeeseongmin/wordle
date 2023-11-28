import { ToastTemplates } from "./templates.js";

const Toast = () => {
  const element = document.createElement("div");
  element.className = "toast-wrapper";
  const contents = ToastTemplates();
  element.insertAdjacentHTML("beforeend", contents);

  return { element };
};

export default Toast;
