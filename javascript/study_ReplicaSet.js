// 실습 ReplicaSet

// 폴더를 먼저 생성 후 cmd창 3개에 각각 실행 시켜준다
// mongod --replSet downSet --dbpath "C:\workspace\MongoDB_lab\var1" --port 10000
// mongod --replSet downSet --dbpath "C:\workspace\MongoDB_lab\var2" --port 10001
// mongod --replSet downSet --dbpath "C:\workspace\MongoDB_lab\var3" --port 10002

// 4번째 cmd창 하나를 더 켜서 위 3개의 서버를 확인한다
netstat -ano

// ----------------------------------------------------------------------------------------

// port 접속 예시
// mongo --port 10000
// 내 host 가 아닐때
// mongo 192.10.20.30:10000
rs.status();

// config = 변수 설정으로 리플리카셋 동기화 시작
let config = {_id:"downSet", members:[{_id:1, host:"localhost:10000"}, {_id:2, host:"localhost:10001"}, {_id:3, host:"localhost:10002"}]};
config

// 렌덤이여서 other 가 나오면 엔터 한번더 치면 primary 로 바뀐다
rs.initiate(config);
rs.status();

// ----------------------------------------------------------------------------------------

// 리플리카셋 마스터 확인
db.isMaster();

// 아직 collections이 없는 상태
// show collections;

// database 선택
// use korea;
// collections 생성시 db도 같이 만들어짐
// mongo --port 10000 에서 한다
db.users.save({id:1, username:"ssar"});

// ----------------------------------------------------------------------------------------

// 다른 서버에도 잘 들어 갔는지 확인
// mongo --port 10001
// 찾을 수 없다. secondary는 읽기도 지원하지 않는다
// "errmsg" : "not master and slaveOk=false" = 너는 마스터가 아니다. 트루로 바꿔라
db.users.find();

// 읽기를 지원하는 명령어
rs.secondaryOk();
// 찾을 수 있다
db.users.find();

// ----------------------------------------------------------------------------------------

// primary서버에서 secondary서버에 접속하는 객체 만들기
secondary10001 = new Mongo("localhost:10001"); // 커넥션 정보 얻기
secondary10002 = new Mongo("localhost:10002"); // 커넥션 정보 얻기
sdb10002 = secondary10002.getDB("korea"); // DB 정보 얻기
secondary10002.setSecondaryOk(); // 읽기 모드 옵션 활성화
sdb10002.users.find();

// ----------------------------------------------------------------------------------------

// primary서버 죽이기 --port 10000에서
db.adminCommand({"shutdown": 1});
exit

// port 10001 or port 10002에서 확인해보기
rs.status();
db.isMaster();

// ----------------------------------------------------------------------------------------

