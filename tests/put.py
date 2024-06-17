import requests, json

# Test put endpoint
user_updates = {
  1 : {"name": "A Person", "email" :  "A.Person2024@email.com"},
  100 : {"name": "Ana Lyst", "email" :  "A.Lyst@email.com"},
}

for id, user in user_updates.items():
  req = requests.put(
    url="http://localhost:3000/store",
    json=dict(key=id, value=json.dumps(user))
  )

  print("PUT", req.status_code, req.json())
