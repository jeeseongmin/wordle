import { WordleTemplates } from "./templates.js";

const WordleBoard = () => {
  const element = document.createElement("div");
  element.className = "wordle-wrapper";
  const contents = WordleTemplates();
  element.insertAdjacentHTML("beforeend", contents);

  return { element };
};

export default WordleBoard;
