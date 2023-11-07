// 연산자 실습 배열 연산자
// 예제 샘플 insert - 키값 없이 값만 있는 상태
db.food.insertOne({_id:1, fruit: ["apple", "banana", "peach"]});
db.food.insertOne({_id:2, fruit: ["apple", "kumquat", "orange"]});
db.food.insertOne({_id:3, fruit: ["cherry", "banana", "apple"]});
db.food.insertOne({_id:4, fruit: ["cherry", "raspberry", "peach"]});
db.food.find().pretty();

// 순서가 다르면 검색이 안된다
db.food.find({fruit : ["apple", "banana", "peach"]});
db.food.find({fruit : ["banana", "peach","apple"]});

// 1. $all = 순서와 상관없이 다 찾을 수 있다
db.food.find({fruit : {$all :["apple", "banana"]}});

// 2. $in = 둘중에 하나라도 있으면 다 찾는다
db.food.find({fruit : {$in :["apple", "banana"]}});

// 3. $size = 배열속 필드 갯수에 맞춰 검색
db.food.find({fruit : {$size : 3}});
db.food.find({fruit : {$size : 2}});
// and = 두가지 검색조건인 and 사용시 중간에 (,)만 넣어주면 된다 
db.food.find({fruit : {$size : 3, $all : ["apple", "banana"]}});

// 4. $push 배열에 값을 추가
db.food.update({_id:1}, {$push:{fruit:"strawberry"}});
// updateMany = {}, $push 모든 배열에 값을 추가
db.food.updateMany({}, {$push:{fruit:"watermelon"}});
// update = [] 내용 전체가 바뀜
db.food.update({_id:1},[]);

// 삭제
// remove() = documents 를 삭제
// $unset = fields 를 삭제
// 5. $pull =  배열([])안에 값을 삭제
db.food.updateOne({_id:2}, {$pull : {fruit:"apple"}});
db.food.updateOne({_id:3}, {$pull : {fruit:"banana"}});

// food 의 collections 전체 검색
db.food.find().pretty();

//  food 내 특정 id 의 documents 검색
db.food.find({_id: 1}).pretty();
db.food.find({_id: 1, fruit:"banana"}).pretty();

// ---------------------------------------------------------------------------------

// 6. $slice = 배열을 제한해서 보기, 전체 document를 제한해서 보려면 limit() 함수를 사용
db.food.find();
db.food.find({_id:1});
// $slice:2 = 0~2 (0번지부터 2개), $slice:-2 = 뒤에서 2개
db.food.find({_id:1}, {fruit: {$slice:2}});
db.food.find({_id:1}, {fruit: {$slice:-2}});
// $slice:[1,4]} = 범위검색 (앞값은 시작 index, 뒷값은 갯수)
db.food.find({_id:1}, {fruit: {$slice:[1,4]}});
db.food.find({_id:1}, {fruit: {$slice:[1,3]}});

// ---------------------------------------------------------------------------------

// 예제 샘플 insert - 배열안에 documents가 있는 상태
db.post.insertOne({_id:1, replys : [
    {id:1, content:"내용1", userId: 1},
    {id:2, content:"내용2", userId: 1},
    {id:3, content:"내용3", userId: 2},
]});
db.post.insertOne({_id:2, replys : [
    {id:4, content:"내용4", userId: 1},
    {id:5, content:"내용5", userId: 1},
    {id:6, content:"내용6", userId: 2},
]});
db.post.find().pretty();

// find = documents를 찾는 것이기 때문에 항상 " "안에 값을 넣어 줘야 한다
// 앞서서는 생략하고 했지만 json형식이 아니어서 오류가 날 수있다
// " "안에 넣어서 입력하는 것이 올바른 방식이다
db.post.find({"replys.id" : 2}).pretty();
// 배열에 속해 있어서 하나만 뽑아 낼수 없다 documents 자체가 검색된다
db.post.find({"replys.id" : 4}).pretty();
// id는 제외하고 documents 검색
db.post.find({"replys.id" : 2}, {_id:0, replys:1}).pretty();

// 하나의 값만 찾고 싶을때 = 1.a라는 변수에 넣은 후 2.변수를 불러내고 3.나온 값 안에서 찾는다
var a = db.post.findOne({"replys.id" : 2});
a.replys
a.replys[1]

// 배열에 속해 있는 documents 검색방법
// 아래 코드들은 각각 해당하는 값이 충족되면 배열 전체가 검색되어서 안된다. 
db.post.findOne({"replys.id" : 1, "replys.userId" : 1 });
db.post.findOne({"replys.id" : 1, "replys.userId" : 2 });
// $연산자 = 찾는 값(documents)이 하나일때, {"replys.$" : 1 } = userId:1 가 여러개 있어도 하나만 검색한다
db.post.find({"replys.userId" : 1}, {"replys.$" : 1 }).pretty();

// 7. $elemMatch = 배열안에 documents의 두가지 이상의 fields를 만족시키는 값을 찾는 법
// {id : 1, userId : 2} 두가지를 동시에 만족하는 documents 전체를 return 한다
db.post.find({"replys": {$elemMatch:{id : 1, userId : 1}}}).pretty();
// {id : 1, userId : 2} 두가지를 동시에 만족하는 fields가 없어서 못 찾는다
db.post.find({"replys": {$elemMatch:{id : 1, userId : 2}}}).pretty();
// replys collections의 배열안에 documents가 id:4 이고, userId:1 인 값 찾는법
db.post.find({"replys": {$elemMatch:{id : 4, userId : 1}}}).pretty();

// 배열 안에서 특정번지 찾기 = 0번지
// 일치하는 요소 한개만 반환한다(2개가 있어도 첫번째 것만 반환)
db.post.find({"replys.id" : 4}).pretty();
db.post.find({"replys.0.id" : 4}).pretty();
db.post.find({"replys.0.id" : 5}).pretty(); // 검색 안됨
db.post.find({"replys": {$elemMatch:{id : 4, userId : 1}}},{"replys" : 1}).pretty();
db.post.find({"replys": {$elemMatch:{id : 4, userId : 1}}},{"replys.0" : 1}).pretty();
// 앞에서 찾아낸 값의 위치를 {"replys.$" : 1} $가 가지고 있다
db.post.find({"replys": {$elemMatch:{id : 4, userId : 1}}},{"replys.$" : 1}).pretty();
db.post.findOne({replys: {$elemMatch:{id : 4, userId : 1}}},{"replys.$" : 1});

// filter = 찾는 값(documents)이 여러개일때, javascript 문법,함수를 이용하여 충족하는 여러개를 다 찾아낸다
var r1 = db.post.find({replys: {$elemMatch: {userId : 1}}});
var r1 = db.post.findOne({replys: {$elemMatch: {userId : 1}}});
// filter() = ()내부에 함수를 받을 수 있다. 조건에 맞는 값만 filtering해서 return해준다
var r2 = r1.replys.filter((r)=> r.userId == 1);
var r2 = r1.replys.filter((r)=> r.userId == 1 && r.id == 4);

// ---------------------------------------------------------------------------------

// 전체 업데이트
db.post.find().pretty();

// 1. 제일 위에 하나씩만 바뀐다
db.post.updateMany({"replys.userId":1}, {$set: {"replys.$.userId": 50}});

// 2. $[] = 연산자가 지정된 배열 필드의 모든 요소를 수정한다
db.post.updateMany({"replys.userId":1}, {$set: {"replys.$[].userId": 90}});

// userId : 1 <- 이 없어져서 아래 코드는 안먹힌다
db.post.updateMany({"replys.userId":1}, {$set: {"replys.$[].userId": 80}});

// 3. arrayFilters = 선택한 요소를 다 바꾼다
db.post.drop();
db.post.insertOne({_id:1, replys : [
    {id:1, content:"내용1", userId: 1},
    {id:2, content:"내용2", userId: 1},
    {id:3, content:"내용3", userId: 2},
]});
db.post.insertOne({_id:2, replys : [
    {id:4, content:"내용4", userId: 1},
    {id:5, content:"내용5", userId: 1},
    {id:6, content:"내용6", userId: 2},
]});
db.post.find().pretty();
// arrayFilters
db.post.updateMany({"replys.userId": 1}, {$set:{"replys.$[ee].userId": 50}}, {arrayFilters: [{"ee.userId": 1}]});
db.post.updateMany({"replys.userId": 50}, {$set:{"replys.$[ee].userId": 1}}, {arrayFilters: [{"ee.userId": 50}]});

// $set = banana 하나만 melon 으로 바꾸기
// arrayFilters = 선택한 요소를 다 바꾼다
db.food.updateOne({_id:1, fruit:"banana"}, {$set: {"fruit.$" : "melon"}});