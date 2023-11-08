// 실습 aggregate_lookup(조인)

// aggregate 집계합수 총 정리

$match = where
// $project = select 칼럼 선택  ($max, $min, $filter)
// $sort = order by
$unwind
$group ($max, $min, $sum, $avg)
$skip
$limit
$lookup

// 데이터를 비워주기
// show collections;
db.users.drop();
db.boards.drop();

// --------------------------------------------------------------------------------------------------------

// 샘플데이터 넣기

// 1. users 컬렉션 샘플 데이터
var users = [
{
        "_id" : ObjectId("60986fbe93843236060071d2"),
        "username" : "ssar",
        "password" : "1234",
        "phone" : "0102222"
},
{
        "_id" : ObjectId("6098700293843236060071d5"),
        "username" : "cos",
        "password" : "1234",
        "phone" : "0103333"
},
{
        "_id" : ObjectId("6098701b93843236060071d6"),
        "username" : "love",
        "password" : "1234",
        "phone" : "0103333"
}
]

db.users.save(users);
db.users.find().pretty();

// 2. boards 컬렉션 샘플 데이터
var boards = [
{
        "_id" : ObjectId("609870ea93843236060071db"),
        "title" : "t1",
        "content" : "c1",
        "user_id" : ObjectId("6098700293843236060071d5") // users의 cos데이터
},
{
        "_id" : ObjectId("6098711393843236060071dc"),
        "title" : "t2",
        "content" : "c2",
        "user_id" : ObjectId("6098700293843236060071d5") // users의 cos데이터
},
{
        "_id" : ObjectId("6098712e5bd0ba17bce175a4"),
        "title" : "t3",
        "content" : "c3",
        "user" : {
                "username" : "love",
                "password" : "1234",
                "phone" : "0103333"
        }
},
{
        "_id" : ObjectId("6098726893843236060071de"),
        "title" : "t4",
        "content" : "c4",
        "user_id" : ObjectId("60986fbe93843236060071d2") // users의 ssar데이터
}
]

db.boards.save(boards);
db.boards.find().pretty();

// --------------------------------------------------------------------------------------------------------

// 3. $lookup 조인
db.boards.aggregate([{$lookup: {"from": "users", localField: "user_id", foreignField: "_id", as: "user"} }]);

db.boards.aggregate([
    {$lookup: {"from": "users",
     localField: "user_id",
      foreignField: "_id",
    as: "user"} }
]).pretty();

// --------------------------------------------------------------------------------------------------------

// 4. $lookup 조인 결과 필드 변형하기

// $project = 보기 싫은 것들은 걸러내기, 값이 배열안에 들어가있다.
db.boards.aggregate([
    {$lookup: {"from": "users",
                         localField: "user_id",
                         foreignField: "_id",
                         as: "user" }},
    {$project: {title:1, content:1, username:"$user.username"}}
    ]).pretty();

// $unwind를 사용하면 inner join이 된다. 사용하지 않으면 outer join이 된다.
db.boards.aggregate([
    {$lookup: {"from": "users",
                         localField: "user_id",
                         foreignField: "_id",
                         as: "user" }},
    {$unwind: "$user"},
    {$project: {title:1, content:1, username:"$user.username"}}
    ]).pretty();

// $unwind를 사용하면서 outer join을 하고 싶다면 아래와 같이 사용하자.
// {$unwind: {path: "$user", preserveNullAndEmptyArrays: true}},
db.boards.aggregate([
    {$lookup: {"from": "users",
                         localField: "user_id",
                         foreignField: "_id",
                         as: "user" }},
    {$unwind: {path: "$user", preserveNullAndEmptyArrays: true}},
    {$project: {title:1, content:1, username: "$user.username"}}
    ]).pretty();