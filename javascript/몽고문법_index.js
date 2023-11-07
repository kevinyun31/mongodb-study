// 데이터 넣기 10만건
for(i=0;i<100000;i++){
    db.users.insertOne({"id":i, "username":"user"+i, "age":Math.floor(Math.random()*120), "created":new Date()});
}
db.users.count();
// show dbs;

// 인덱스 없이 조회하기
db.users.find({"username": "user101"}).explain("executionStats");

// 인덱스 생성하기
db.users.createIndex({"username":1});

// 인덱스 생성 후 조회하기
db.users.find({"username":"user101"}).explain("executionStats");

// getIndexes() = 현재 가지고 있는 index
db.students.getIndexes();

// drop = index 삭제
db.students.dropIndex({student_id:1, class_id:1});
db.students.dropIndexs();

// --------------------------------------------------------------------------------------------------------------

// 복합 인덱스 효과를 보지 못 하는 쿼리
db.users.find().sort({"age":1, "username":1});

// 복합 인덱스 생성
db.users.createIndex({"age":1, "username":1});

// 복합 인덱스 생성 후 다시 정렬 해보기
db.users.find().sort({"age":1, "username":1});

// --------------------------------------------------------------------------------------------------------------

// 복합 인덱스 검색 효율
// sort(정렬) = age:21을 찾아서 순서대로 읽으면 된다.
db.user.find({"age":21}).sort({"username": 1});
// sort(정렬) = age:21을 찾아서 거꾸로 읽으면 된다.
db.user.find({"age":21}).sort({"username": -1});

// {"gt":21, "lt":30} = 범위검색 (21 부분을 찾아서 아래로 30까지)
db.users.find({"age":{"gt":21, "lt":30}});
// db.users.find({"age":{"gt":21, "lt":30}}).sort("username":1);

// --------------------------------------------------------------------------------------------------------------

// 복합 인덱스 쿼리 플랜 
// 데이터 넣기 10만건
for(i=0; i<100000; i++){
    db.students.insertOne({"student_id":i, "username":"user"+i, "class_id":Math.floor(Math.random()*500)});
}
db.students.count();
db.students.find().pretty();

// 복합 인덱스 생성하기
db.students.createIndex({"student_id":1, "classs_id":1});

// 아래와 같이 검색하게 되면, 인덱스 경쟁이 일어난다. 
// 그리고 거부된 플랜과 승리한 플랜을 확인할 수 있다.
// 현재는 인덱스가 하나 밖에 없기 때문에 경쟁이 없다
// 5만1부터 10만까지 읽고 class_id:54 인 것을 찾는다
db.students.find({student_id:{$gt:50000}, class_id:54}).sort({student_id:1}).explain("executionStats");

// class_id:54 로 조회되어서 경우의 수가 줄어들어 효율적으로 변환
db.students.createIndex({"class_id": 1});
db.students.find({student_id:{$gt:50000}, class_id:54}).sort({student_id:1}).explain("executionStats");

// sort 가 없어지고 바로 fetch 하여 훨씬 빨라짐
db.students.createIndex({"class_id": 1, "student_id":1});
db.students.find({student_id:{$gt:50000}, class_id:54}).sort({student_id:1}).explain("executionStats");

// --------------------------------------------------------------------------------------------------------------

// hint = 실행계획을 바꿔서 더욱 좋게 활용하기
db.students.find({student_id:{$gt:50000}, class_id:54}).sort({student_id:1}).hint({"class_id":1}).explain("executionStats");