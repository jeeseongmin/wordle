const keySequence = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["", "A", "S", "D", "F", "G", "H", "J", "K", "L", ""],
  ["enter", "Z", "X", "C", "V", "B", "N", "M", "backspace"],
];

const Tile = () => {
  return `<div class='tile' data-state='empty'></div>`;
};

const Key = ({ letter }) => {
  return letter === ""
    ? `<div class='empty-space'></div>`
    : `
    <button
        type='button'
        class='keyboard-key ${
          letter === "enter" || letter === "backspace"
            ? "keyboard-special-key"
            : ""
        }'
        data-label=${letter}
        data-state='empty'
    >
        ${
          letter === "backspace"
            ? "<span class='material-symbols-outlined'>" + letter + "</span>"
            : letter.toUpperCase()
        }
    </button>
`;
};

export const WordleTemplates = () => {
  const GameBoardTemplates = () => {
    let gameboardComponents = [];
    Array.from({ length: 6 }, () => {}).map(() => {
      let rowComponent = Array.from({ length: 5 }, () => {}).map(() => {
        return Tile();
      });
      gameboardComponents.push(
        `<div class='board-row'>${rowComponent.join("")}</div>`
      );
    });

    return `
    <div class='board'>
        ${gameboardComponents.join("")}
    </div>`;
  };

  const KeyboardTemplates = () => {
    let keyboardComponent = [];
    keySequence.map((keyRow) => {
      let rowComponent = keyRow.map((letter) => {
        return Key({ letter });
      });
      keyboardComponent.push(
        `<div class='keyboard-row'>${rowComponent.join("")}</div>`
      );
    });

    return `${keyboardComponent.join("")}`;
  };

  return ` 
        <div class='board-wrapper'>
            ${GameBoardTemplates()}
        </div>
        <div class='keyboard-wrapper'>
            ${KeyboardTemplates()}
        </div>
    `;
};
