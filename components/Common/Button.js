export const Button = ({ id, name, iconName }) => `
    <button type="button" id="${id}">
        ${name}
        <span class="material-symbols-outlined"> ${iconName} </span>
    </button>
`;
