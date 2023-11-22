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
  } else if (event.which === 13 && tbdList.length < 5) {
    openToast("Not enough letters");
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

function openToast(message) {
  const toastMessage = document.querySelector(".toast-message");

  toastMessage.innerText = message;
  toastMessage.classList.add("active");
  setTimeout(function () {
    toastMessage.classList.remove("active");
  }, 1000);
}
