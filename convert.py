import json

with open("facts.json", "r") as f:
    data = json.load(f)
    
lines = ""

for fact in data:
    lines += f"{fact[0]}\n"

with open("facts.txt", "w", encoding="utf-8") as f:
    f.write(lines)
