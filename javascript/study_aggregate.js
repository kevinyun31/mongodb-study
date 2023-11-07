// 실습 aggregate

db.users.find({id:10}).pretty();

// aggregate = ()안에 오브젝트가 아닌 []배열이 들어가야 한다
// 5가지 단계가 들어갈 수 있기 때문에 []배열안에 {}값을 넣는다
db.users.aggregate([{}]);
db.users.aggregate([{$match: {id:10}}]).pretty();

// find
db.users.find({id:10}, {_id:0, id:1, username:1, age:1}).pretty();
// aggregate
db.users.aggregate([{$match: {id:10}}, {$project: {_id:0, id:1, username:1, age:1}}]).pretty();

// ---------------------------------------------------------------------------------------------

// find, limit
db.users.find({age:12},{_id:0, username:1, age:1}).limit(5);
db.users.find({age:12},{_id:0, username:1, age:1}).limit(3);

// aggregate - $match, $project, $limit
db.users.aggregate([{$match : {age:12}}, {$project: {_id:0, username:1, age:1}}, {$limit:5}]);
db.users.aggregate(
    [
    {$match : {age:12}},
    {$project: {_id:0, username:1, age:1}},
    {$limit:3}
    ]
    );

// $limit를 끝이 아닌 중간에 넣어 준 예시
db.users.aggregate([{$match : {age:12}}, {$limit:5}, {$project: {_id:0, username:1, age:1}}]);
db.users.aggregate([{$match : {age:12}}, {$limit:3}, {$project: {_id:0, username:1, age:1}}]);

// $sort = limit을 하기전에 정렬한 결과가 필요하다면 sort를 우선 단계에 둔다
db.users.aggregate([{$match : {age:12}}, {$sort: {username:-1}}, {$limit:5}, {$project: {_id:0, username:1, age:1}}]);
db.users.aggregate([{$match : {age:12}}, {$limit:5}, {$sort: {username:1}}, {$limit:3}, {$project: {_id:0, username:1, age:1}}]);

// $skip = 
db.users.aggregate([{$match : {age:12}}, {$sort: {username:-1}}, {$skip:10}, {$limit:5}, {$project: {_id:0, username:1, age:1}}]);
db.users.aggregate(
    [
        {$match : {age:12}},
        {$sort: {username:-1}},
        {$skip:98},
        {$limit:5},
        {$project: {_id:0, username:1, age:1}}
    ]
    );

// ---------------------------------------------------------------------------------------------

// save = 데이터 넣기
    var persons1 = {
        _id: 1,
        username : "ssar",
        posts : [{id:1, title:"제목1", content:"내용1"}, {id:2, title:"제목2", content:"내용2"}, {id:3, title:"제목3", content:"내용3"}]};
     
     
     var persons2 = {
        _id: 2,
        username : "cos",
        posts : [
          {id:1, title:"제목1", content:"내용1"},
          {id:2, title:"제목2", content:"내용2"},
          {id:3, title:"제목3", content:"내용3"}
        ]
     };
     
     var persons1 = {
        _id: 1,
        username : "ssar",
        posts : [
          {id:1, title:"제목1", content:"내용1"},
          {id:2, title:"제목2", content:"내용2"},
          {id:3, title:"제목3", content:"내용3"},
        ]
     }     
     
db.persons.save(persons1);
db.persons.save(persons2);
db.persons.find().pretty();

// ---------------------------------------------------------------------------------------------

// $unwind = 전개연산자 <- 배열에서 원하는 데이터 만 뽑아 내기
db.persons.aggregate([{$match: {_id:1}}, {$unwind: "$posts"}, {$project: {_id: 0, username: 1, postId: 1,  title: 2, content: 3}}]);

db.persons.aggregate([
    {$match: {_id:1}},  
    {$unwind: "$posts"},
    {$project: {
       _id: 0,
       username: 1,
       postId: "$posts.id", 
       title: "$posts.title",
       content: "$posts.content"
    }}
  ]);

// ---------------------------------------------------------------------------------------------

// $filter =  도큐먼트안의 배열을 필터링 할 수 있다.
// $max = 최대값
  db.persons.aggregate([
    {$match: {}},
    {$project: {
       _id:0,
       username:1,
       new : {
         $filter :  {
            input: "$posts",        // 6건, 배열을 가져온다
            as: "post",             // $posts = 6건 인자를 for문을 받는 변수이름
            cond: {$eq : ["$$post.id", {$max: "$posts.id"}]}  //cond = 조건, $$post.id = 배열이 돌때 마다의 도큐먼트
         }
       },
    }}
  ]).pretty();

// $min = 최소값.
  db.persons.aggregate([
    {$match: {}},
    {$project: {
       _id:0,
       username:1,
       new : {
         $filter :  {
            input: "$posts",        // 6건, 배열을 가져온다
            as: "post",             // $posts = 6건 인자를 for문을 받는 변수이름(별칭)
            cond: {$eq : ["$$post.id", {$min: "$posts.id"}]}  //cond = 조건, $$post.id = 배열이 돌때 마다의 도큐먼트
         }
       }, 
    }}
  ]).pretty();

// $gt = 1보다 큰값 들
  db.persons.aggregate([
    {$match: {}},
    {$project: {
       _id:0,
       username:1,
       new : {
         $filter :  {
            input: "$posts",        // 6건, 배열을 가져온다
            as: "post",             // $posts = 6건 인자를 for문을 받는 변수이름(별칭)
            cond: {$gt : ["$$post.id",1]}  //cond = 조건, $$post.id = 배열이 돌때 마다의 도큐먼트
         }
       },
    }}
  ]).pretty();

db.persons.find().pretty();

// 유저네임 ssar,cos에서 가장 postId가 가장 큰값을 골라내기
db.persons.aggregate([
    {$match:{}},
    {$project: { 
        _id:0,
        username:1,
        maxPostId: {$max: "$posts.id"}
    }}
]).pretty();

// ---------------------------------------------------------------------------------------------

// 배열 선택 표현식

// $arrayElemAt 배열 특정 인덱스 뽑기
// 가장 최신 문서 뽑아내기
db.persons.aggregate([
    {$match: {_id:1}},
    {$project: {
       _id:0,
       username:1,
       last : {$arrayElemAt: ["$posts", -1]}
    }}
  ]).pretty();

  // 가장 예전 문서 뽑아내기
  db.persons.aggregate([
    {$match: {_id:1}},
    {$project: {
       _id:0,
       username:1,
       last : {$arrayElemAt: ["$posts", 0]}
    }}
  ]).pretty();

  // ---------------------------------------------------------------------------------------------

  // 배열 범위 표현식
  // $slice 첫번째 요소 시작번지, 두번째 요소 개수
  db.persons.aggregate([
    {$match: {_id:1}},
    {$project: {
       _id:0,
       username:1,
       medium : {$slice: ["$posts", 1,1]}
    }}
  ]).pretty();

  // $slice 첫번째 요소 시작번지, 첫번째 요소 개수
  db.persons.aggregate([
    {$match: {_id:1}},
    {$project: {
       _id:0,
       username:1,
       medium : {$slice: ["$posts", 0,1]}
    }}
  ]).pretty();