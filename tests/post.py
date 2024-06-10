import requests

# Test user post endpoint

users = {
  "A Person" : "A.Person@email.com",
  "B Person" : "B.Person@email.com",
  "C Person" : "C.Person@email.com",
  "D Person" : "D.Person@email.com",
  "E Person" : "E.Person@email.com",
}

for user, email in users.items():
  req = requests.post(
    url="http://localhost:3000/users",
    json={"name":user, "email":email }
  )

  print("POST", user, req.status_code, req.json())

