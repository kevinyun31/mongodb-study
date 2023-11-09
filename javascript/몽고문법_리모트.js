// - 수정명령을 로컬서버로 다시 왔다갔다 하지않고
// 그곳 원격 서버에서 명령어를 수행하고 결과를 받을 수 있음
// 서버의 효율이 매우 올라감
db.eval(update_area);

// 위 코드는 3.2부터 중단됨
// 예시 코드, 실제 함수에 맞게 수정해야 합니다.
const update_area = function() {
    // 여기에 함수 내용 작성
    // ...
};

// MongoDB 셸에서 JavaScript 코드를 실행하는 방법은 적절한 명령을 사용하는 것입니다.
// 아래는 MongoDB 셸에서 JavaScript 코드를 실행하는 명령의 예시입니다.
db.eval(() => {
    // 여기에 update_area 함수 호출 코드 추가
    update_area();
});

// db.eval은 MongoDB 4.0 이후로 deprecation 되었으며, 더 이상 권장되지 않습니다. 
// 따라서 해당 기능을 최신 버전의 MongoDB에서 대체하는 방법은 다른 방식으로 구현해야 합니다.