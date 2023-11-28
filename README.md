## 프로젝트명

Wordle 게임 클론

## 프로젝트 스택

HTML, Javascript, css(scss)

## 프로젝트 내용 및 요약

기존에 존재하던 Wordle 페이지를 클론코딩하여 그대로 만들어본다.

| 내용          | 링크                                                              |
| ------------- | ----------------------------------------------------------------- |
| Wordle game   | https://www.nytimes.com/games/wordle/index.html?success=true      |
| 프로젝트 설명 | https://aimho.notion.site/Wordle-bd48edaa3d2f410da5b7693e0455c183 |

## 기능 시나리오

### Data set 내 state 값의 의미

각 타일은 state 값을 가지고 있다. 해당 state 값에 따라 타일의 스타일이 변경된다.

1. state = "correct"

   - 채점 이후 해당 타일의 문자와 위치가 정답의 것과 동일한 경우

2. state = "present"

   - 채점 이후 해당 타일의 문자가 정답에 포함되어있는 경우

3. state = "absent"

   - 채점 이후 해당 타일의 문자가 정답에 포함되지않는 경우

4. state = "empty"

   - 해당 타일에 아직 문자가 채워지지 않은 경우

5. state = "tbd"

   - 해당 타일에 문자가 채워지기만 하고 채점이 이루어지지 않은 경우

### 초기 세팅

1. Tile 초기화
   - 모든 Tile의 state를 empty로 변경, innerText를 공백으로 변경
2. 키보드 UI 스타일 초기화
   - 하단의 키보드 UI의 모든 키 state를 empty로 변경
3. config 설정
   - 정답, 정답 여부, 게임 종료 여부, 세트 수, 각 row 결과값

### 문자 입력

1. Tile에 letter 입력
   - validation을 통과한 경우만 letter 입력
   - tbd Tile의 갯수가 5개 이하인 경우
     - 5개인 경우 letter을 입력받는 것이 아니라 정답 체크
   - letter 입력 시 state를 empty에서 tbd로 변경
     - 게임이 끝난 경우에는 입력하지 못하도록 방지한다.
       - 게임 승리 (한 row의 tile을 정답과 비교하여 동일한 경우)
       - 게임 실패 (emptyList:state=empty, tbdList:state=tbd 모두에 더이상 작성할 공간이 없는 경우)
2. Tile에 Backspace 입력
   - 가장 후방의 tbd Tile 초기화
3. Tile에 Enter 입력
   - tbd 타일이 5개인 경우 : 채점을 기다리는 상태
     - 채점 시 data.json에 포함되지 않은 단어인 경우 'Not in word list' 에러 토스트 발생
     - 위치 별 문자를 비교하여 아래의 규칙에 맞게 state를 변경하여 스타일을 변경한다.
       1. 문자와 위치가 모두 같다면 'correct'
       2. 문자를 포함만 한다면 'present'
       3. 문자를 포함하지 않는다면 absent'
     - correct가 5번 일어난 경우 승리로 게임 종료
     - 더이상 타일을 입력하지 못하는 경우 게임 종료
     - 결과 텍스트를 위한 세트 카운팅
     - 결과 텍스트를 위한 로우 결과값 저장

### 게임 종료

- 게임 종료 시 모달 오픈
  1. 모달 > 공유하기 : 결과 텍스트 구성 후 클립보드에 복사
  2. 모달 > 다시하기 : 초기 세팅 함수 실행
  3. 모달 > 창 닫기 : 모달창 닫기
