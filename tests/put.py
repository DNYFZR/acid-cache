import requests

# Test put endpoint
users_updated = [
  {"id": 1, "name": "A Person", "email" :  "A.Person2024@email.com",},
  {"id": 100, "name": "Ana Lyst", "email" :  "A.Lyst@email.com",},
]

for user in users_updated:
  req = requests.put(
    url=f"""http://localhost:3000/users/{user["id"]}""",
    json={"name":user["name"], "email":user["email"] }
  )

  print("PUT", req.status_code, req.json())
