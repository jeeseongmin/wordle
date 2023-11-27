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
    [...keyList].map((item, index) => {
      keyList[index].dataset.state = "empty";
    });
  };

  /**
   * 타일 스타일 및 텍스트 초기화
   */
  const resetTiles = () => {
    const tileList = document.querySelectorAll(".tile");
    [...tileList].map((item, index) => {
      tileList[index].dataset.state = "empty";
      tileList[index].innerText = "";
    });
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
  const englishRegex = /^[a-zA-Z]{1}$/;
  const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]{1}/;

  const emptyList = getTileList("empty");
  const tbdList = getTileList("tbd");

  // 정답을 맞췄거나, 모든 타일 검사가 끝난 경우에는 더이상 입력 못하도록 방지
  const isDisabled =
    config.isCorrect || (emptyList.length === 0 && tbdList.length === 0);
  // 백스페이스 여부
  const isBackspace = event.which === 8;
  // 엔터 여부
  const isEnter = event.which === 13;
  // 한글 입력 여부
  const isKorean = koreanRegex.test(event.key);
  // 영어 입력 여부
  const isEnglish = englishRegex.test(event.key);

  if (isDisabled) {
    return;
  }

  if (isKorean) {
    return openToast("Please type it in English");
  }

  if (isEnglish) {
    return addLetter(tbdList, event.key);
  }
  if (isBackspace) {
    return removeLetter(tbdList);
  }
  if (isEnter) {
    return handleEnterEvent(tbdList, emptyList);
  }
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

    // 해당 위치에 있는 문자가 동일한 경우
    if (currentLetter === answerLetter) {
      return (tbdTile.dataset.state = "correct");
    }
    // 해당 문자가 정답에 포함되어있는 경우
    if (config.answer.includes(currentLetter)) {
      return (tbdTile.dataset.state = "present");
    }
    // 정답과 아무 연관이 없는 경우
    return (tbdTile.dataset.state = "absent");
  };

  /**
   * 채점에 따른 키보드 내 키 스타일 변경
   */
  const checkKeyboard = (index) => {
    const tile = tbdList[index];
    const letter = tile.innerText;
    const key = document.querySelector(`[data-label='${letter}']`);

    const needToChange =
      (key.dataset.state === "present" && tile.dataset.state === "correct") ||
      key.dataset.state === "empty" ||
      key.dataset.state === "absent";
    /**
     * 키보드 내 키 상태를 타일과 동일하게 세팅하는 경우
     * 1. key.dataset.state가 present이면서 tile.dataset.state이 correct인 경우
     * 2. key.dataset.state가 empty이거나 absent인 경우
     */
    if (needToChange) {
      key.dataset.state = tile.dataset.state;
    }
  };

  // NodeList에 map을 사용하기 위해 spread Operator 사용
  const word = [...tbdList].map((item) => item.innerText).join("");

  // 단어 리스트에 포함되어있지 않으면 에러 토스트
  if (!validWords.includes(word.toLowerCase())) {
    openToast("Not in word list");
  }
  // 포함되어있다면 채점
  else {
    let rowResult = [];
    [...tbdList].map((item, index) => {
      let tileState = compareLetter(index);
      checkKeyboard(index);
      rowResult.push(tileState);
    });

    config.setNumber++;
    config.result.push(rowResult);

    const isAnswer =
      rowResult.filter((item) => item === "correct").length === 5;
    const isDisabled =
      getTileList("empty").length === 0 && getTileList("tbd").length === 0;

    // 정답인 경우
    if (isAnswer) {
      config.isCorrect = true;
      config.isEnd = true;
      return toggleModal("Game Clear!", true);
    }
    // 더이상 타일을 입력하지 못하는 경우
    if (isDisabled) {
      config.isEnd = true;
      openToast(config.answer);
      return toggleModal(`Game Fail`, true);
    }
  }
};

/**
 * 빈 타일에 문자 채우기
 */
const addLetter = (tbdList, letter) => {
  const isPossible = !config.isEnd && tbdList.length < 5;
  if (isPossible) {
    const emptyTile = document.querySelector(".tile[data-state='empty']");
    emptyTile.innerText = letter;
    emptyTile.dataset.state = "tbd";
  }
};

/**
 * tbd 타일에서 문자 지우기
 */
const removeLetter = (tbdList) => {
  const isPossible = !config.isEnd && tbdList.length > 0;
  if (isPossible) {
    const tbdTile = tbdList[tbdList.length - 1];
    tbdTile.innerText = "";
    tbdTile.dataset.state = "empty";
  }
};

const getTileList = (state) => {
  return document.querySelectorAll(`.tile[data-state=${state}]`);
};

/**
 * 키보드 마우스 클릭 이벤트
 */
const handleClickKeyboard = (target) => {
  const letter = target.dataset.label;
  const tbdList = getTileList("tbd");
  const emptyList = getTileList("empty");

  if (letter === "backspace") {
    removeLetter(tbdList);
  } else if (letter === "enter") {
    handleEnterEvent(tbdList, emptyList);
  } else {
    addLetter(tbdList, letter);
  }

  // 버튼 포커스 해제
  target.blur();
};

/**
 * 엔터 입력 시에 동작하는 함수
 */
const handleEnterEvent = (tbdList, emptyList) => {
  // tbd 타일 갯수가 5개일 경우 한줄이 채워진 것이므로 정답 체크
  if (tbdList.length === 5) {
    return checkAnswer(tbdList);
  }
  // 아닌 경우 부족하다는 에러 토스트
  if (emptyList.length > 0) {
    return openToast("Not enough letters");
  }
};

/**
 * 토스트 팝업 오픈 함수
 */
const openToast = (message) => {
  const closeToast = () => {
    toastMessage.classList.remove("active");
  };
  const toastMessage = document.querySelector(".toast-message");

  toastMessage.innerText = message;
  toastMessage.classList.add("active");
  setTimeout(closeToast, 1000);
};

/**
 * 모달 토글 함수
 */
const toggleModal = (text, isOpen) => {
  const toggleAction = () => {
    const modal = document.getElementById("modal");
    const resultText = document.getElementById("result-text");
    const answerText = document.getElementById("answer-text");
    resultText.innerText = text;

    answerText.innerText = config.isEnd ? `answer : ${config.answer}` : ``;
    isOpen ? modal.classList.remove("hidden") : modal.classList.add("hidden");
  };

  setTimeout(toggleAction, 500);
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
      .then(() => openToast("Copied!"))
      .catch((e) => console.log(e));
  };

  let resultText = `Wordle ${getToday()} ${config.setNumber}/6\n\n`;
  const stateStyle = {
    correct: "🟩",
    present: "🟨",
    absent: "⬛",
  };

  for (let resultNum = 0; resultNum < config.result.length; resultNum++) {
    let row = config.result[resultNum];

    for (let rowNum = 0; rowNum < row.length; rowNum++) {
      resultText += stateStyle[row[rowNum]];
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
    const isModalOpenButton = event.target.id === "modal-open-button";
    const isModalCloseButton = event.target.id === "modal-close-button";
    const isReplayButton =
      event.target.id === "replay-button" ||
      event.target.parentElement.id === "replay-button";
    const isShareButton =
      event.target.id === "share-button" ||
      event.target.parentElement.id === "share-button";
    const isKeyboardUI =
      event.target.classList[0] === "keyboard-key" ||
      event.target.parentElement.classList[0] === "keyboard-key";

    if (isModalOpenButton) {
      return toggleModal("", true);
    }

    if (isModalCloseButton) {
      return toggleModal("", false);
    }

    if (isReplayButton) {
      init();
      toggleModal("", false);
      return openToast("New Game");
    }

    if (isShareButton) {
      return shareResult();
    }

    if (isKeyboardUI) {
      return handleClickKeyboard(
        event.target.classList[0] === "keyboard-key"
          ? event.target
          : event.target.parentElement
      );
    }
  });
};
