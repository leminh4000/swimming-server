npm install bcrypt express jsonwebtoken mongoose nodemon

curl -d '{name:"John"}' -H 'Content-Type: application/json' http://localhost:3000

cloud.mongodb.com
admin/123456

signup:
    curl -d '{"email":"test@test.com", "password":"123456"}' -H "Content-Type: application/json" -X POST http://localhost:3000/signup
signin:
    curl -d '{"email":"test@test.com", "password":"123456"}' -H "Content-Type: application/json" -X POST http://localhost:3000/signin

{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzJkNjI3ZDY5NjZlMGYzZjE4NDAyZWMiLCJpYXQiOjE2NjM5MTg3MTd9.4127ptTHtCZIb9xI7kiLtnqRWFybvpfPvr9W5MjfiRY"}
curl -d '{"email":"test@test.com", "password":"123456"}' -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzJkNjI3ZDY5NjZlMGYzZjE4NDAyZWMiLCJpYXQiOjE2NjM5MTg3MTd9.4127ptTHtCZIb9xI7kiLtnqRWFybvpfPvr9W5MjfiRY" -X GET http://localhost:3000/

curl -d '{
"name": "My new tract",
"locations": [
{
"timestamp":1000000000,
"corrds": {
"latitude":100,
"longitude":100,
"altitude":100,
"accuracy":100,
"speed":100
}
}
]
}'  -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzMwNTlkZWIyMzk2NTI2NWIwNTc4ZWEiLCJpYXQiOjE2NjQxMjA4MDR9.Y83k_UPiiJdssVRfBoGGHuCu9HcuTcUN_Czf_NNGhdY" -X POST http://localhost:3000/tracts
