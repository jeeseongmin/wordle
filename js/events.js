import { data as validWords } from "../data/data.js";

const config = {
  answer: "", // 정답 텍스트
  isCorrect: false, // 정답 여부
  isEnd: false, // 게임 종료 여부
  setNumber: 0, // 시도 횟수
  result: [], // 공유를 위한 행 결과 모음
};

/**
 * 초기 설정 세팅
 */
const init = () => {
  /**
   * 키보드 UI 스타일 초기화
   */
  const resetKeyboard = () => {
    const keyList = document.querySelectorAll(".keyboard-key");
    for (let i = 0; i < keyList.length; i++) {
      keyList[i].dataset.state = "empty";
    }
  };

  /**
   * 타일 스타일 및 텍스트 초기화
   */
  const resetTiles = () => {
    const tileList = document.querySelectorAll(".tile");
    for (let i = 0; i < tileList.length; i++) {
      tileList[i].dataset.state = "empty";
      tileList[i].innerText = "";
    }
  };

  /**
   * 랜덤 단어 추출
   */
  const getRandomWord = () => {
    const randomNum = Math.floor(Math.random() * validWords.length);
    return validWords[randomNum].toUpperCase();
  };

  /**
   * 설정 초기화
   */
  const resetConfig = () => {
    config.answer = getRandomWord();
    config.isCorrect = false;
    config.isEnd = false;
    config.setNumber = 0;
    config.result = [];
  };

  resetKeyboard();
  resetTiles();
  resetConfig();
};

/**
 * 키 입력 이벤트
 */
const handleKeyup = ({ event }) => {
  const englishRegex = /^[a-zA-Z]*$/;
  const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

  const emptyList = getEmptyList();
  const tbdList = getTbdList();

  //  정답을 맞췄거나, 모든 타일 검사가 끝난 경우에는 더이상 입력 못하도록 방지
  if (config.isCorrect || (emptyList.length === 0 && tbdList.length === 0))
    return;

  // 문자 입력 (validation : 영문자 제한, 하나의 로우가 다 채워졌을 경우, 끝이 나지 않은 경우)
  if (65 <= event.which && event.which <= 90 && tbdList.length < 5) {
    if (koreanRegex.test(event.key)) {
      openToast("Please type it in English");
    } else if (englishRegex.test(event.key)) {
      addLetter(tbdList, event.key);
    }
  }
  // 백스페이스 입력
  else if (event.which === 8) removeLetter(tbdList);
  // 엔터 입력
  else if (event.which === 13) handleEnterEvent(tbdList, emptyList);
};

/**
 * 정답 체크 함수
 */
const checkAnswer = (tbdList) => {
  /**
   * 해당 위치의 문자를 정답과 비교 후 타일 스타일 변경
   */
  const compareLetter = (index) => {
    let tbdTile = tbdList[index];
    let currentLetter = tbdTile.innerText;
    let answerLetter = config.answer[index];

    if (currentLetter === answerLetter) {
      tbdTile.dataset.state = "correct";
    } else if (config.answer.includes(currentLetter))
      tbdTile.dataset.state = "present";
    else tbdTile.dataset.state = "absent";

    return tbdTile.dataset.state;
  };

  /**
   * 채점에 따른 키보드 내 키 스타일 변경
   */
  const checkKeyboard = (index) => {
    const tile = tbdList[index];
    const letter = tile.innerText;
    const key = document.querySelector(`[data-label='${letter}']`);
    /**
     * 키보드 내 키 상태를 타일과 동일하게 세팅하는 경우
     * 1. key.dataset.state가 present이면서 tile.dataset.state이 correct인 경우
     * 2. key.dataset.state가 empty이거나 absent인 경우
     */
    if (
      (key.dataset.state === "present" && tile.dataset.state === "correct") ||
      key.dataset.state === "empty" ||
      key.dataset.state === "absent"
    ) {
      key.dataset.state = tile.dataset.state;
    }
  };

  const word = [...tbdList].map((item) => item.innerText).join("");

  // 단어 리스트에 포함되어있지 않으면 에러 토스트
  if (!validWords.includes(word.toLowerCase())) {
    openToast("Not in word list");
  }
  // 포함되어있다면 채점
  else {
    let rowResult = [];
    for (let i = 0; i < tbdList.length; i++) {
      let tileState = compareLetter(i);
      checkKeyboard(i);
      rowResult.push(tileState);
    }
    config.setNumber++;
    config.result.push(rowResult);

    // 정답인 경우
    if (rowResult.filter((item) => item === "correct").length === 5) {
      config.isCorrect = true;
      config.isEnd = true;
      toggleModal("Game Clear!", true);
    }
    // 더이상 타일을 입력하지 못하는 경우
    else if (getEmptyList().length === 0 && getTbdList().length === 0) {
      config.isEnd = true;
      openToast(config.answer);
      toggleModal(`Game Fail`, true);
    }
  }
};

/**
 * 빈 타일에 문자 채우기
 */
const addLetter = (tbdList, letter) => {
  if (!config.isEnd && tbdList.length < 5) {
    const emptyTile = document.querySelector(".tile[data-state='empty']");
    emptyTile.innerText = letter;
    emptyTile.dataset.state = "tbd";
  }
};

/**
 * tbd 타일에서 문자 지우기
 */
const removeLetter = (tbdList) => {
  if (!config.isEnd && tbdList.length > 0) {
    const tbdTile = tbdList[tbdList.length - 1];
    tbdTile.innerText = "";
    tbdTile.dataset.state = "empty";
  }
};

/**
 * 해당 시점에서 empty 상태의 타일 리스트 가져오기
 */
const getEmptyList = () => {
  return document.querySelectorAll(".tile[data-state='empty']");
};

/**
 * 해당 시점에서 tbd 상태의 타일 리스트 가져오기
 */
const getTbdList = () => {
  return document.querySelectorAll(".tile[data-state='tbd']");
};

/**
 * 키보드 마우스 클릭 이벤트
 */
const handleClickKeyboard = (target) => {
  const letter = target.dataset.label;
  const tbdList = getTbdList();
  const emptyList = getEmptyList();

  if (letter === "backspace") removeLetter(tbdList);
  else if (letter === "enter") handleEnterEvent(tbdList, emptyList);
  else addLetter(tbdList, letter);

  // 버튼 포커스 해제
  target.blur();
};

/**
 * 엔터 입력 시에 동작하는 함수
 */
const handleEnterEvent = (tbdList, emptyList) => {
  // tbd 타일 갯수가 5개일 경우 한줄이 채워진 것이므로 정답 체크
  if (tbdList.length === 5) checkAnswer(tbdList);
  // 아닌 경우 부족하다는 에러 토스트
  else if (emptyList.length > 0) openToast("Not enough letters");
};

/**
 * 토스트 팝업 오픈 함수
 */
const openToast = (message) => {
  const toastMessage = document.querySelector(".toast-message");

  toastMessage.innerText = message;
  toastMessage.classList.add("active");
  setTimeout(function () {
    toastMessage.classList.remove("active");
  }, 1000);
};

/**
 * 모달 토글 함수
 */
const toggleModal = (text, isOpen) => {
  setTimeout(function () {
    const modal = document.getElementById("modal");
    const resultText = document.getElementById("result-text");
    const answerText = document.getElementById("answer-text");
    resultText.innerText = text;

    if (config.isEnd) {
      answerText.innerText = `answer : ${config.answer}`;
    } else {
      answerText.innerText = "";
    }
    if (isOpen) modal.classList.remove("hidden");
    else modal.classList.add("hidden");
  }, 500);
};

/**
 * 게임 결과 공유하기
 */
const shareResult = () => {
  /**
   * YYYY-MM-DD hh:mm:ss 형식으로 날짜를 가져오는 함수
   */
  const getToday = () => {
    const date = new Date();
    return (
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      "-" +
      (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
      " " +
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
      ":" +
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
      ":" +
      (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds())
    );
  };

  /**
   * 클립보드로 복사하는 함수
   */
  const copyToClipBoard = (text) => {
    window.navigator.clipboard
      .writeText(text)
      .then(() => console.log(`${text}`))
      .catch((e) => console.log(e));
  };

  let resultText = `Wordle ${getToday()} ${config.setNumber}/6\n\n`;

  for (let i = 0; i < config.result.length; i++) {
    let row = config.result[i];

    for (let j = 0; j < row.length; j++) {
      if (row[j] === "correct") resultText += "🟩";
      else if (row[j] === "present") resultText += "🟨";
      else if (row[j] === "absent") resultText += "⬛";
    }

    resultText += "\n";
  }
  copyToClipBoard(resultText);
};

/**
 * 이벤트 시작 함수
 */
export const eventsLoad = () => {
  init();

  window.addEventListener("keyup", (event) => handleKeyup({ event }));
  window.addEventListener("click", (event) => {
    // 모달 오픈 버튼
    if (event.target.id === "modal-open-button") toggleModal("", true);
    // 모달 닫기 버튼
    else if (event.target.id === "modal-close-button") toggleModal("", false);
    // 다시하기 버튼
    else if (
      event.target.id === "replay-button" ||
      event.target.parentElement.id === "replay-button"
    ) {
      init();
      toggleModal("", false);
      openToast("New Game");
    }
    // 공유 버튼 클릭
    else if (
      event.target.id === "share-button" ||
      event.target.parentElement.id === "share-button"
    )
      shareResult();
    // 키보드 UI 클릭
    else if (
      event.target.classList[0] === "keyboard-key" ||
      event.target.parentElement.classList[0] === "keyboard-key"
    ) {
      handleClickKeyboard(
        event.target.classList[0] === "keyboard-key"
          ? event.target
          : event.target.parentElement
      );
    }
  });
};
