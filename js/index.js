window.addEventListener("keyup", (event) => handleKeyup(event));

function handleKeyup(event) {
  const englishRegex = /^[a-zA-Z]*$/;
  const emptyTile = document.querySelector(".tile[data-state='empty']");
  const tbdList = document.querySelectorAll(".tile[data-state='tbd']");
  if (
    65 <= event.which &&
    event.which <= 90 &&
    englishRegex.test(event.key) &&
    tbdList.length < 5
  ) {
    addLetter();
  } else if (event.which === 8 && tbdList.length > 0) {
    removeLetter();
  }

  function addLetter() {
    emptyTile.innerText = event.key;
    emptyTile.dataset.state = "tbd";
  }

  function removeLetter() {
    const tbdTile = tbdList[tbdList.length - 1];
    tbdTile.innerText = "";
    tbdTile.dataset.state = "empty";
  }
}
