import requests

# Test get endpoint
req = requests.get(
  url=f"http://localhost:3000/users/",
)

print("GET", req.status_code, "No Data" if len(req.json()) == 0 else req.json())
