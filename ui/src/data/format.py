import json


with open('./src/data/wards.json') as f:
    wards = json.loads(f.read())

with open('./src/data/counties.json') as f:
    counties = json.loads(f.read())

with open('./src/data/constituencies.json') as f:
    constituencies = json.loads(f.read())




consituencies_to_ward = {}
county_to_consituencies = {}

for i in constituencies:
    # print(i)
    county_to_consituencies['{}'.format(i['county_code'])] = []

# print(wards[0])
for i in constituencies:
    county = i['county_code']
    code = i['code']
    name = i['name']

    county_to_consituencies['{}'.format(i['county_code'])].append({"code":code, "name": name})


print(county_to_consituencies)

with open('./src/data/county_to_consituencies.json', 'w') as f:
    f.write(json.dumps(county_to_consituencies))