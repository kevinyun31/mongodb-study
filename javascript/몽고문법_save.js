// 실습 save
db.users.save({id:1, username:"ssar"});

// show collections;

db.users.drop();
db.users.save({id:1, username:"ssar"});
db.users.save({id:2, username:"cos"});
db.users.save({id:3, username:"love"});