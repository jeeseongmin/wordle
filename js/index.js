import Header from "../components/Header/index.js";
import Modal from "../components/Modal/index.js";
import Toast from "../components/Toast/index.js";
import WordleBoard from "../components/Wordle/index.js";
import { eventsLoad } from "./events.js";

const app = document.getElementById("app");

const renderComponent = ({ element }) => {
  app.appendChild(element);
};

const onContentLoaded = () => {
  renderComponent(Header({ title: "wordle" }));
  renderComponent(WordleBoard());
  renderComponent(Modal());
  renderComponent(Toast());

  eventsLoad();
};

document.addEventListener("DOMContentLoaded", onContentLoaded);
