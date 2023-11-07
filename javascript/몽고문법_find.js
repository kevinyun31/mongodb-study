// 실습 find
db.users.find();
// 자바스크립트 기반이여서 반드시 키값에 " "를 붙여줘야 한다(Json 데이터 방식)
// " " 생략해도 통과 되는 것들이 있어서 습관이 되면 빠트려서 오류가 날 수 있다
db.users.find({"friend.id" : 2});

// {id:1} = 특정 데이터 찾기
db.users.find({id:1});
db.users.find().pretty();

// $gt = 1보다 큰것
db.users.find({id: {$gt:1}});

// $gte = 3보다 같거나 큰것
db.users.find({id: {$gte:3}});

// $lt = 3보다 작은것 
db.users.find({id : {$lt: 3}});

// ----------------------------------------------------------------------------------
// $in = 여러개 or와 비슷, 하나의 키 값으로 검색할 때 - 키값(id)이 먼저 나온다
db.users.find({id : {$in : [1,2]}});
db.users.find({username : {$in : ["ssar","cos"]}});

// $or = 다수의 키 값으로 검색할 때 - 연산자(or)가 먼저 나온다
db.users.find({$or : [{id:1},{id:2}]});

// $and = 따로 and를 적어 주지 않아도 된다
// db.users.find($and : [{id:2}, {username:"cos"}]); 
db.users.find({id:2, username:"cos"});

// {"" : ""} = 객체 연결 연산, 중간에 (:) 넣어준다
db.users.find({"friend.username" : "cos"}).pretty();

// $exists = (0=false, 1=true)
db.users.find({friend : {$exists: 1}});

// $ne = 네거티브 연산자, 1이 아닌 것들 
db.users.find({id : {$ne: 1}});

// $not = 전체부정, 2보다 크지 않은 것($gt를 부정한다)
db.users.find({"id" : {$not : {"$gt" :2}}}).pretty();

// ----------------------------------------------------------------------------------

// sort() = 정렬
// 정렬 = 키값을 넣어야 한다 1은 오름차순, -1은 내림차순
db.users.find().sort();

db.users.find().sort({id:1});
db.users.find({in_stock: {$gt : 1}}).sort({in_stock:1});

db.users.find().sort({id:-1});
db.users.find({in_stock: {$gt : 1}}).sort({in_stock:-1});

// ----------------------------------------------------------------------------------

// limit() = 제한해서 보여주기, 1보다 크지만 2까지만
db.users.find({in_stock: {$gt : 1}}).limit(2);

// skip() = 스킵하고 보여주기
db.users.find({in_stock: {$gt : 1}}).sort({in_stock:-1}).limit(2).skip(2);

// ----------------------------------------------------------------------------------

// 자바스크립트 함수로 find 해보기
var f = function(){
    var result = db.users.findOne({id:5}, {_id:0, friend:1});
    return db.users.findOne({id:result.friend.id})
}

f();

// count() = 개수 찾기
db.users.find().count();
