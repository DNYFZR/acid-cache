import requests, json

# Test user post endpoint

users = {
  1 : {"name": "A Person", "email" :  "A.Person2024@email.com"},
  1 : {"name": "A Person", "email" : "A.Person@email.com"},
  2 : {"name": "B Person", "email" : "B.Person@email.com"},
  3 : {"name": "C Person", "email" : "C.Person@email.com"},
  4 : {"name": "D Person", "email" : "D.Person@email.com"},
  5: {"name": "E Person", "email" : "E.Person@email.com"},
  6: {"name": "X Person", "email" : "X.Person@email.com"},
  7 : {"name": "A Notherdude", "email" : "A.Notherdude@email.com"},
}

for id, user in users.items():
  req = requests.post(
      url="http://localhost:3000/store",
      json=dict(key=id, value=json.dumps(user))
    )

  print("POST", users, req.status_code, req.json())

