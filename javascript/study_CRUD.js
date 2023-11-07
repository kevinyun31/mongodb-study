// 셸 실행
mongo

// 자바스크립트 함수 정의(여러줄 가능)
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// 현재 db에 할당된 데이터베이스 확인
db
// use video
db.movies

// CRUD
// C = create 생성, 도큐먼트를 나타내는 자바스크립트 객체인 movie 지역 변수 생성
db.movis.save({"name" : "john"});

movie = {
    "title": "Star Wars: Episode IV - A New Hope",
    "director": "George Lucas",
    "year": 1977
}
// 도큐먼트 insertOne 함수를 이용 movies 컬렉션에 저장
db.movies.insertOne(movie);
// 영화가 데이터베이스에 저장됐다. 컬렉션에 find를 호출해서 확인
db.movies.find().pretty();

// R = read 읽기, find와 findOne은 켈력션을 쿼리하는데  사용
db.movies.find();
db.movies.findOne();

// U = update 갱신, updateOne의 매개변수는 최소 두개(1.수정할 도큐먼트, 2.갱신 작업을 설명)
db.movies.updat();
db.movies.updateOne({
    title: "Star Wars: Episode IV - A New Hope"
},
    { $set: { reviews: [] } }
)
// 도큐먼트에 reviews 키가 생김. find로 확인
db.movies.find(),pretty();

// D = delete 삭제, deleteOne과 deleteMany는 도큐먼트를 데이터베이스에서 영구 삭제 
db.movies.remove({title : "Star Wars:Eprisode IV - A New Hope"})
db.movies.deleteOne({ title: "Star Wars:Eprisode IV - A New Hope"})
