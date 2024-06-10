import requests

# Test put endpoint
users_updated = [
  {"id": 1, "name": "A Person", "email" :  "A.Person@email.com",},
  {"id": 10, "name": "A Dude", "email" :  "A.Dude@email.com",},
]

for user in users_updated:
  req = requests.put(
    url=f"""http://localhost:3000/users/{user["id"]}""",
    json={"name":user["name"], "email":user["email"] }
  )

  print("PUT", user, req.status_code)
