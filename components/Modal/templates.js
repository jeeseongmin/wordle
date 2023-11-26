const Button = ({ id, name, iconName }) => `
    <button type="button" id="${id}">
        ${name}
        <span class="material-symbols-outlined"> ${iconName} </span>
    </button>
`;

export const ModalTemplates = () => {
  return `      
    <div class="modal-wrapper">
      <div class="modal-header">
        <span
          id="modal-close-button"
          class="icon material-symbols-outlined"
        >
          close
        </span>
      </div>
      <div class="modal-contents">
        <div id="result-board">
          <h1 id="result-text"></h1>
          <h2 id="answer-text"></h2>
        </div>
        <div class="button-wrapper">
            ${Button({
              id: "replay-button",
              name: "다시하기",
              iconName: "replay",
            })}
            ${Button({
              id: "share-button",
              name: "공유하기",
              iconName: "share",
            })}
        </div>
      </div>
    </div>
  `;
};
