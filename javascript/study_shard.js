// 1. shard - 폴더 생성
// mkdir C:\workspace\MongoDB_lab\shard1\r1
// mkdir C:\workspace\MongoDB_lab\shard1\r2
// mkdir C:\workspace\MongoDB_lab\shard1\r3
// mkdir C:\workspace\MongoDB_lab\shard2\r1
// mkdir C:\workspace\MongoDB_lab\shard2\r2
// mkdir C:\workspace\MongoDB_lab\shard2\r3
// mkdir C:\workspace\MongoDB_lab\shard3\r1
// mkdir C:\workspace\MongoDB_lab\shard3\r2
// mkdir C:\workspace\MongoDB_lab\shard3\r3

//  2. config - 서버 저장 폴더 생성
// mkdir C:\workspace\MongoDB_lab\config\r1
// mkdir C:\workspace\MongoDB_lab\config\r2
// mkdir C:\workspace\MongoDB_lab\config\r3

// ------------------------------------------------------------------------------------------------------------

//  3. 샤드 서버 - 백그라운드에서 실행 
// 윈도우 버전
// start mongod --replSet shard1Set --shardsvr --dbpath "C:\workspace\MongoDB_lab\shard1\r1" --port 30001 --bind_ip_all
// start mongod --replSet shard1Set --shardsvr --dbpath "C:\workspace\MongoDB_lab\shard1\r2" --port 30002 --bind_ip_all
// start mongod --replSet shard1Set --shardsvr --dbpath "C:\workspace\MongoDB_lab\shard1\r3" --port 30003 --bind_ip_all
// start mongod --replSet shard2Set --shardsvr --dbpath "C:\workspace\MongoDB_lab\shard2\r1" --port 40001 --bind_ip_all
// start mongod --replSet shard2Set --shardsvr --dbpath "C:\workspace\MongoDB_lab\shard2\r2" --port 40002 --bind_ip_all
// start mongod --replSet shard2Set --shardsvr --dbpath "C:\workspace\MongoDB_lab\shard2\r3" --port 40003 --bind_ip_all
// start mongod --replSet shard3Set --shardsvr --dbpath "C:\workspace\MongoDB_lab\shard3\r1" --port 50001 --bind_ip_all
// start mongod --replSet shard3Set --shardsvr --dbpath "C:\workspace\MongoDB_lab\shard3\r2" --port 50002 --bind_ip_all
// start mongod --replSet shard3Set --shardsvr --dbpath "C:\workspace\MongoDB_lab\shard3\r3" --port 50003 --bind_ip_all

// 맥 버전
// nohup mongod --replSet shard1Set --shardsvr --dbpath "${HOME}/workspace/MongoDB_lab/shard1/r1" --port 30001 --bind_ip_all &
// nohup mongod --replSet shard1Set --shardsvr --dbpath "${HOME}/workspace/MongoDB_lab/shard1/r2" --port 30002 --bind_ip_all &
// nohup mongod --replSet shard1Set --shardsvr --dbpath "${HOME}/workspace/MongoDB_lab/shard1/r3" --port 30003 --bind_ip_all &
// nohup mongod --replSet shard2Set --shardsvr --dbpath "${HOME}/workspace/MongoDB_lab/shard2/r1" --port 40001 --bind_ip_all &
// nohup mongod --replSet shard2Set --shardsvr --dbpath "${HOME}/workspace/MongoDB_lab/shard2/r2" --port 40002 --bind_ip_all &
// nohup mongod --replSet shard2Set --shardsvr --dbpath "${HOME}/workspace/MongoDB_lab/shard2/r3" --port 40003 --bind_ip_all &
// nohup mongod --replSet shard3Set --shardsvr --dbpath "${HOME}/workspace/MongoDB_lab/shard3/r1" --port 50001 --bind_ip_all &
// nohup mongod --replSet shard3Set --shardsvr --dbpath "${HOME}/workspace/MongoDB_lab/shard3/r2" --port 50002 --bind_ip_all &
// nohup mongod --replSet shard3Set --shardsvr --dbpath "${HOME}/workspace/MongoDB_lab/shard3/r3" --port 50003 --bind_ip_all &

// 샤드서버의 레플리카셋 설정
// mongo --port 30001
// let con = {_id:"shard1Set", members:[{_id:1, host:"192.168.0.132:30001"}, {_id:2, host:"192.168.0.132:30002"}, {_id:3, host:"192.168.0.132:30003"}]};
// let con = {_id:"shard1Set", members:[{_id:1, host:"0.0.0.0:30001"}, {_id:2, host:"0.0.0.0:30002"}, {_id:3, host:"0.0.0.0:30003"}]};
rs.initiate(con);

// mongo --port 40001
// let con = {_id:"shard2Set", members:[{_id:1, host:"192.168.0.132:40001"}, {_id:2, host:"192.168.0.132:40002"}, {_id:3, host:"192.168.0.132:40003"}]};
rs.initiate(con);

// mongo --port 50001
// let con = {_id:"shard3Set", members:[{_id:1, host:"192.168.0.132:50001"}, {_id:2, host:"192.168.0.132:50002"}, {_id:3, host:"192.168.0.132:50003"}]};
rs.initiate(con);


// 서버 잘 돌고 있는지 확인
rs.status(); 

// netstat -ano | findstr 3000*
// netstat -ano | findstr 4000*
// netstat -ano | findstr 5000*

// ------------------------------------------------------------------------------------------------------------

// config 서버생성
// start mongod --configsvr --replSet configSet --dbpath "C:\workspace\MongoDB_lab\config\r1" --port 60001 --bind_ip_all
// start mongod --configsvr --replSet configSet --dbpath "C:\workspace\MongoDB_lab\config\r2" --port 60002 --bind_ip_all
// start mongod --configsvr --replSet configSet --dbpath "C:\workspace\MongoDB_lab\config\r3" --port 60003 --bind_ip_all

// config 서버의 리플리카셋 설정
// mongo --port 60001
let con = {_id:"configSet", members:[{_id:1, host:"192.168.0.132:60001"}, {_id:2, host:"192.168.0.132:60002"}, {_id:3, host:"192.168.0.132:60003"}]};
rs.initiate(con);

// ------------------------------------------------------------------------------------------------------------

// mongos 서버실행
// mongos --configdb configSet/192.168.0.132:60001,192.168.0.132:60002,192.168.0.132:60003 --port 20000 --bind_ip_all

// mongos 서버접속
// mongo --port 20000

// admin 데이터에 접속
// use admin

// mongos에 샤드서버 추가하기
sh.addShard("shard1Set/192.168.0.132:30001,192.168.0.132:30002,192.168.0.132:30003");
sh.addShard("shard2Set/192.168.0.132:40001,192.168.0.132:40002,192.168.0.132:40003");
sh.addShard("shard3Set/192.168.0.132:50001,192.168.0.132:50002,192.168.0.132:50003");

// greendb = 데이터베이스 명으로 샤드 키 설정
sh.enableSharding("greendb");
// .account = 컬렉션명을 지정해서 샤딩한다
sh.shardCollection("greendb.account", {_id: "hashed"});

// 샤드 키 설정시에 예를 들어 name 값으로 설정하려면 꼭 name에 인덱스를 생성해야한다.
db.account.createIndex({"name":1});
db.shardCollection("greendb.account", {"name":1});

// 샤딩 상태확인
mongos> sh.status()

// 더미데이터 추가
// use greendb;
for (let i=0; i<1000; i++){db.account.save({name:"name"+i})}

// 30001 포트로 접속해서 카운팅 해보기
// mongo --port 30001
// use greendb;
db.account.count();

// 샤딩 상태확인
db.account.getShardDistribution()