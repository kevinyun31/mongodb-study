// // 셸 사용법 
// // 다른 장비나 포트에 mongod를 연결하려면 셸을 시작 할 때 호스트명, 포트, 데이터베이스를 명시해야 한다.
// mongo some-host:30000/myDB

// // 셸을 --nodb 옵션을 주어 시작하면 어디에도 연결되지 않은 채 시작된다.
// mongo --nodb

// // 시작 후 원하는 때에 new Mongd(호스트명)를 실행함으로써 mongod에 연결한다.
// // 이 두 명령어를 실행하면 기본적으로 db를 사용할 수 있으며, 다른 데이터베이스나 서버에 언제든지 연결할 수 있다.

// conn = new Mongo("some-host : 30000")
// db = conn.getDB("myDB")

// // 셸 활용 팁
// // mongo는 단순하게 보면 자바스크립트 셸이여서 자바스크립트를 참조하면 유용하다.
// help
// db.help()
// db.foo.help()

// // 함수의 기능을 알고 싶으면 함수명을 괄호 없이 입력하면 된다.
// // 그러면 함수의 자바스크립트 소스코드가 출력된다.
// db.movies.updateOne

// mongo script1.js script2.js script3.js