// 실습 update
// $unset = 특정 필드를 삭제
db.persons.save({_id:1, username:"ssar", password:"1234"});
db.persons.save({_id:2, username:"cos", password:"1234"});
db.persons.find().pretty();
db.persons.update({_id:2}, {$unset : {password:"1234"}});

// $set = 특정 필드를 변경,추가 
db.persons.update({_id:1}, {password:"5678"});
db.persons.update({_id:2}, {password:"5678"});
db.persons.update({_id:2}, {$set : {phone:"5678"}});
// $unset = 특정 필드를 삭제 
db.persons.update({_id:2}, {$unset : {phone:"5678"}});

// upsert = 행(documents)을 만든다. 데이터가 없으면 추가 있으면 업데이트, 업데이트와 인서트가 섞여 있다
db.persons.update({_id:3}, {password:"1234"});
db.persons.update({_id:3}, {password:"1234"}, {upsert:1});

// remove = 삭제, {}전체삭제
db.persons.remove({_id:3});
db.persons.remove({});

db.persons.drop();