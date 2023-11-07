// 샤딩 구현
// 샤딩을 위해서는 아래 단계를 따르세요.

// --------------------------------------------------------------------------------------------

// 1 단계
// 복제본 세트에서 구성 서버를 시작 하고 이들 간의 복제를 활성화합니다.
// mongod --configsvr --port 27019 --replSet rs0 --dbpath C:\data\data1 --bind_ip localhost

// mongod --configsvr --port 27018 --replSet rs0 --dbpath C:\data\data2 --bind_ip localhost

// mongod --configsvr --port 27017 --replSet rs0 --dbpath C:\data\data3 --bind_ip localhost

// 2 단계

// 구성 서버 중 하나에서 복제본 세트를 초기화합니다.
// mongo --port 27017
rs.initiate( { _id : "rs0",  configsvr: true,  members: [   { _id: 0, host: "IP:27017" }, { _id: 1, host: "IP:27018" }, { _id: 2, host: "IP:27019"}]})
rs.initiate( { _id : "rs0",  members: [   { _id: 0, host: "IP:27017" }, { _id: 1, host: "IP:27018" }, { _id: 2, host: "IP:27019"}]})

// 안되서 도중 중단