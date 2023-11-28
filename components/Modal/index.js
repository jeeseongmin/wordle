import { ModalTemplates } from "./templates.js";

const Modal = () => {
  const element = document.createElement("div");
  element.id = "modal";
  element.className = "hidden";
  const contents = ModalTemplates();
  element.insertAdjacentHTML("beforeend", contents);

  return { element };
};

export default Modal;
