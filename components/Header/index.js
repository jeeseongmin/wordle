import { HeaderTemplates } from "../Header/templates.js";

const Header = ({ title }) => {
  const element = document.createElement("header");
  const contents = HeaderTemplates({ title });
  element.insertAdjacentHTML("beforeend", contents);

  return { element };
};

export default Header;
