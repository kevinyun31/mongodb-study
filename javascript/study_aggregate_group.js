// 실습 aggregate_group

// aggregate 집계합수 총 정리

$match = where
// $project = select 칼럼 선택  ($max, $min, $filter)
// $sort = order by
$unwind
$group ($max, $min, $sum, $avg)
$skip
$limit
$lookup

// 1. 샘플 데이터 입력

// use korea;

for(i=1; i<101; i++){
  db.emp.save({_id: i, name: "이름"+i, hiredate: "199"+Math.floor(Math.random()*9), sal: Math.floor(Math.random()*1000)+1000});
}

db.emp.find().pretty();

// ---------------------------------------------------------------------------------------------

// 2. 입사년도 별 평균 연봉을 뽑아보자.

// $group = 파이프라인 생성, _id = 키값(뭘로 그룹을 묶을지), $hiredate = 날짜함수(날짜로 묶겠다)
db.emp.aggregate([{$group: { _id: {hiredate: "$hiredate"}, avg_sal: {$avg: "$sal"} }}]);

// $group을 사용할 때 첫번째 필드 _id는 꼭 있어야 하는 키워드이다.
// 변경할 수 있는 변수값이 아니다. 주의!!
db.emp.aggregate([
    {$group: { _id: {hiredate: "$hiredate"}, avg_sal: {$avg: "$sal"}}}
  ]);

// hired = 변수이름(자유롭게), $hiredate = 키값(실제 hiredate로 그룹핑 할거다)
// $avg = 평균, $sal = 실제 필드값
db.emp.aggregate([
    {$group: {_id: {hired: "$hiredate"}, avg_sal: {$avg: "$sal"}}}
])

// ---------------------------------------------------------------------------------------------

// 3. 입사년도 별 연봉의 합을 순위별로 출력하자.
// $sort = 정렬, sum_sal:-1 = sal을 더해서 내림차순
db.emp.aggregate([
    {$group: { _id: {hiredate: "$hiredate"}, sum_sal: {$sum: "$sal"} }},
    {$sort: {sum_sal:-1}}
  ]);


// 4. 입사년도 별 연봉의 합을 순위별로 출력하돼 _id 필드를 제외하고 출력하라.
// $project를 사용하여 추가 설정 입력
  db.emp.aggregate([
    {$group: { _id: {hiredate: "$hiredate"}, sum_sal: {$sum: "$sal"}  }},
    {$sort: {sum_sal:-1}},
    {$project: {_id:0}}	
  ]);


// 5. 입사년도 별 연봉의 합을 순위별로 출력하돼 _id 필드를 제외하고 새로운 rank 필드를 출력하라.
// $addFields = 새로운 rank 추가, "rank":1 = 랭크모두 1로 설정
db.emp.aggregate([
    {$group: { _id: {hiredate: "$hiredate"}, sum_sal: {$sum: "$sal"}  }},
    {$sort: {sum_sal:-1}},
    {$project: {_id:0}},
    {$addFields : {"rank":1} }
  ]);


// 6. 위 결과에서 rank를 순위별로 숫자를 출력하라(자바스크립트 활용)
// rank 변수를 생성
var rank = 1;

// 결과를 r1에 넣음
var r1 = db.emp.aggregate([
  {$group: { _id: {hiredate: "$hiredate"}, sum_sal: {$sum: "$sal"} }},
  {$sort: {sum_sal:-1}},
  {$project: {_id:0}}	,
  {$addFields : {"rank":1} }
]);

// map = []배열을 순회하며 돌때마다 return한다. 전부다 조회
// r2 = map으로 한줄씩 계속 값이 쌓이게 들어온다
var r2 = r1.map(d => { return {"sum_sal": d.sum_sal, "rank" : rank++} });

// r2 실행
r2 

// 7. 6번의 문제점을 살펴보자.
// "sum_sal": d.sum_sal = 필드값이 여러개면 적을게 너무 많아진다
var r2 = r1.map(d => { return {"sum_sal": d.sum_sal, "rank" : rank++} });

// 전개연산자(자바스크립트)
// ...d = d의 요소를 하나씩 가져와서 흩 뿌린다
// "rank" : rank++ = 앞에 rank값을 덮어 씌운다
var r2 = r1.map(d => { return {...d, "rank" : rank++} });

// ---------------------------------------------------------------------------------------------

// 8. 그룹핑 된 도큐먼트 개수 구하기

// $sum:1 = hiredate로 sum_sal(연봉별 합계)을 구할때 d_count(더해진 갯수)를 알 수 있다
db.emp.aggregate([
    {$group: { _id: {hiredate: "$hiredate"}, sum_sal: {$sum: "$sal"}, d_count: {$sum:1} }},
    {$sort: {sum_sal:-1}}
  ]);

// ---------------------------------------------------------------------------------------------

// 9. Max값 구하기

db.emp.aggregate([
    {$group: { _id: {hiredate: "$hiredate"}, max_sal : {$max : "$sal"}  }}
  ]);
  // max값 검증 해보기
db.emp.find({hiredate:"1992"});
  
 

// 전체(collections) 연봉 중 최대값
db.emp.aggregate([
    {$group: {_id: {}, max_sal: {$max: "$sal"} }}, {$project: {_id:0}}
]);

// 전체 연봉 중 최대값 검증 해보기
db.emp.find({}).sort({sal:-1}).limit(1);

// ---------------------------------------------------------------------------------------------

// 10. Min값 구하기

// 10-1. 입사일이 가장 빠른 사람들을 찾아보자
db.emp.aggregate([
    {$group: { _id: {}, min_hiredate : {$min : "$hiredate"} }},
  ]);

// 10-2. $push를 이용하여 group으로 최대값을 구하면서 전체 결과를 추가해준다
db.emp.aggregate([
  {$group: { _id: {}, min_hiredate : {$min : "$hiredate"}, docs : { $push : { _id: "$_id", name: "$name", hiredate: "$hiredate"}} }},
]).pretty();

// 10-3. 그리고 배열 내부는 $project의 filter를 이용하여 결과를 추려내면 된다. 1990년만 뽑아진다  
db.emp.aggregate([
    {$group: { _id: {}, min_hiredate : {$min : "$hiredate"}, docs : { $push : { _id: "$_id", name: "$name", hiredate: "$hiredate"}} }},
    {$project : {_id:0, min_hiredate : 1, docs: {$filter : {input: "$docs", as: "doc", cond: {$eq : ["$$doc.hiredate", "$min_hiredate"]}}}}}
  ]).pretty();

db.emp.find({hiredate: "1990"}).pretty();
db.emp.find({hiredate: "1990"}, {_id:0}).pretty();

// 10-4. $unwind = $docs로 새 파이프라인을 정의하여 다시 값을 설정해보자
db.emp.aggregate([
    {$group: { _id: {}, min_hiredate : {$min : "$hiredate"}, docs : { $push : { _id: "$_id", name: "$name", hiredate: "$hiredate"}} }},
    {$project : {_id:0, min_hiredate : 1, docs: {$filter : {input: "$docs", as: "doc", cond: {$eq : ["$$doc.hiredate", "$min_hiredate"]}}}}},
    {$unwind : "$docs"},
    {$project: {_id:"$docs._id", name:"$docs.name", hiredate:"$docs.hiredate"}}
  ]).pretty();

db.emp.aggregate([
    {$group: { _id: {}, min_hiredate : {$min : "$hiredate"}, docs : { $push : { _id: "$_id", name: "$name", hiredate: "$hiredate"}} }},
    {$project : {_id:0, min_hiredate : 1, docs: {$filter : {input: "$docs", as: "doc", cond: {$eq : ["$$doc.hiredate", "$min_hiredate"]}}}}},
    {$unwind : "$docs"},
    {$project: {_id:0, name:1, hiredate:"$docs.hiredate"}}
  ]).pretty();

// 10-5. project 승격 시키기 (원하는 데이터만)
// docs 안에 있는 배열 데이터들을 상위로 끌어올리는 방법
db.emp.aggregate([
  {$group: { _id: {}, min_hiredate : {$min : "$hiredate"}, docs : { $push : { _id: "$_id", name: "$name", hiredate: "$hiredate"}} }},
  {$project : {_id:0, min_hiredate : 1, docs: {$filter : {input: "$docs", as: "doc", cond: {$eq : ["$$doc.hiredate", "$min_hiredate"]}}}}},
  {$project: {min_hiredate:1, name:"$docs.name"}}
]).pretty();

// ---------------------------------------------------------------------------------------------

// 추천코드
// 10-6. 응용프로그램에서 제어하여 사용하는게 좋다
//  r1 = 자바같은 응용프로그램을 사용하여 데이터를 받아서
var r1 = db.emp.aggregate([
    {$group: { _id: {}, min_hiredate : {$min : "$hiredate"} }},
    {$project: {_id:0, min_hiredate:1}}
  ]);
 
// r2 = 실행하고  
var r2 = r1._batch[0];

db.emp.find({hiredate: r2.min_hiredate}).pretty();

// 값을 확인하는 방법 들
db.emp.find({hiredate: "1990"}, {_id:0, hiredate:1});
db.emp.find({hiredate: "1990"}, {_id:0, hiredate:1}).limit(1);
var a = db.emp.find({hiredate: "1990"}, {_id:0, hiredate:1}).limit(1);
var a = db.emp.findOne({hiredate: "1990"}, {_id:0, hiredate:1});
// aggregate로는 아래 처럼 값을 찾을 수 없다
a
a.hiredate

// map 함수 혹은 _batch를 사용하는 이유는 타입을 확인해보면 알 수 있다.
// aggregate 했을 때는 결과가 자바스크립트 Object가 아니라 BSON 객체이다.
var r1 = db.emp.aggregate([
  {$group: { _id: {}, min_hiredate : {$min : "$hiredate"} }}
]);  
var s1 = JSON.stringify(r1);
s1

// _batch
var r2 = r1._batch[0].min_hiredate;
r2
db.emp.find({hiredate: r2});

r1._batch
var r1 = db.emp.findOne({_id:1});
var r2 = JSON.stringify(r1);
r2
////asdasd