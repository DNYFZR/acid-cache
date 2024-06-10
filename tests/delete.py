import requests

# for i in range(1, 10):
#   req = requests.delete(
#     url=f"http://localhost:3000/users/{i}",
#   )

#   print("DELETE", i, req.content)
tables = [
  "data", "madalorian", "skywalker", "tables", "expo",
  "octocat", "admin", "badmin", "cadmin", "fadman", "eadman", "gadman"
]

# Create tables
for table in tables:
  req = requests.get(
    url=f"http://localhost:3000/{table}",
  )
  print("GET", table, req.status_code, req.content)

# Delete tables
for table in tables:
  req = requests.delete(
    url=f"http://localhost:3000/drop/{table}",
  )

  print("DELETE", table, req.status_code, req.content)
