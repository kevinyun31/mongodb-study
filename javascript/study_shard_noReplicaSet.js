// // *** 시작하기전에 기존에 폴더가 있으면 안에 내용 다 삭제하고 시작

// // 1. 폴더 생성
// mongolab/shard1
// mongolab/shard2
// mongolab/shard3
// mongolab/config1
// mongolab/config2
// mongolab/config3

// // 2. config - CMD 창 3개 열어서 CS 서버 3개 실행
// mongod --configsvr --replSet configSet --dbpath "C:\mongolab\config1" --port 50001 --bind_ip_all
// mongod --configsvr --replSet configSet --dbpath "C:\mongolab\config2" --port 50002 --bind_ip_all
// mongod --configsvr --replSet configSet --dbpath "C:\mongolab\config3" --port 50003 --bind_ip_all

// netstat -ano | findstr 5000*

// // 3. config - CS서버중 50001로 접속해서 리플리카셋 설정하기
// mongo --port 50001
// let con = {_id:"configSet", members:[{_id:1, host:"127.0.0.1:50001"}, {_id:2, host:"127.0.0.1:50002"}, {_id:3, host:"127.0.0.1:50003"}]};
// rs.initiate(con);

// rs.status();

// // --------------------------------------------------------------------------------------------------

// // 4. shard - CMD 창 3개 열어서 SHARD 서버 3개 실행 (리플리카 구성을 하진 않음 - 하지만 리플리카 세트 박스는 만들어줘야 함)
// mongod --shardsvr --dbpath "C:\mongolab\shard1" --port 30001 --bind_ip_all --replSet shardSet1
// mongod --shardsvr --dbpath "C:\mongolab\shard2" --port 30002 --bind_ip_all --replSet shardSet2
// mongod --shardsvr --dbpath "C:\mongolab\shard3" --port 30003 --bind_ip_all --replSet shardSet3


// // 5. shard - CMD 창 1개 열어서 30001로 들어가서 리플리카셋 설정
// netstat -ano | findstr 3000*

// mongo --port 30001
// let con = {_id:"shardSet1", members:[{_id:1, host:"127.0.0.1:30001"}]};
// rs.initiate(con);

// // 6. CMD 창 1개 열어서 30002로 들어가서 리플리카셋 설정
// mongo --port 30002
// let con = {_id:"shardSet2", members:[{_id:1, host:"127.0.0.1:30002"}]};
// rs.initiate(con);

// // 7. CMD 창 1개 열어서 30003로 들어가서 리플리카셋 설정
// mongo --port 30003
// let con = {_id:"shardSet3", members:[{_id:1, host:"127.0.0.1:30003"}]};
// rs.initiate(con);

// // --------------------------------------------------------------------------------------------------

// // 8. mongos = 몽고S 서버 실행(라우팅 서버) 
// - 이 서버는 CS(config)에서 메타정보를 가져와서 샤드 서버에 save하거나 find할때 참고하는 서버
// - CMD 창 1개 열어서 실행
// mongos --configdb configSet/127.0.0.1:50001,127.0.0.1:50002,127.0.0.1:50003 --port 20000 --bind_ip_all

// // 9. CMD 창 1개 열어서 몽고S 서버 접속 (현재 몽고S서버)
// mongo --port 20000

// // 10. admin 디비로 접속해서 샤드 추가 (현재 몽고S서버)
// use admin;
// sh.addShard("shardSet1/127.0.0.1:30001");
// sh.addShard("shardSet2/127.0.0.1:30002");
// sh.addShard("shardSet3/127.0.0.1:30003");

// // 11. emp 디비로 접속해서 인덱스 생성 (현재 몽고S서버)
// - 사실 _id 는 인덱스 생성안해도 자동으로 잡히는데 개념을 익히기 위해 직접 잡아줌.
// - 왜냐하면 인덱스가 없으면 샤드키로 설정할 수 없음(중요)
// use emp;
// db.programmer.createIndex({_id:1});

// // 12. emp 디비에 먼저 샤드 설정하고 그다음에 programmer 컬렉션에 샤드 설정하기 (현재 몽고S서버)
// sh.enableSharding("emp");
// sh.shardCollection("emp.programmer", { _id : "hashed" });

// // 13. 샤드 상태 확인 (현재 몽고S서버)
// // 방법1
// sh.status()

// // 방법2
// use emp;
// db.programmer.getShardDistribution()

// // 14. emp 디비 접속해서 10000건 값 추가 (현재 몽고S서버)
// use emp;
// for (let i=0; i<10000; i++){db.programmer.save({name:"name"+i})}

// // 15. CMD 창 각 각 열어서!! 값 확인
// 30001, 30002, 30003 들어가서 use emp 하고, db.programmer.count() 로 대략 3000개씩 잘 분배되었는지 확인하기