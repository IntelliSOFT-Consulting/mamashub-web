import json


with open('./wards.json') as f:
    wards = json.loads(f.read())

with open('./counties.json') as f:
    counties = json.loads(f.read())



def code_to_x_map(x):
    with open('./{}.json'.format(x)) as f:
        units = json.loads(f.read())
    rows = {}
    for i in units:
        rows["{}".format(i['code'])] = i['name']
    with open('./code_to_{}_map.json'.format(x), 'w') as f:
        f.write(json.dumps(rows))


code_to_x_map("counties")
code_to_x_map("constituencies")
code_to_x_map("wards")



# consituencies_to_ward = {}
# county_to_consituencies = {}

# for i in constituencies:
#     # print(i)
#     county_to_consituencies['{}'.format(i['county_code'])] = []

# # print(wards[0])
# for i in constituencies:
#     county = i['county_code']
#     code = i['code']
#     name = i['name']

#     county_to_consituencies['{}'.format(i['county_code'])].append({"code":code, "name": name})


# print(county_to_consituencies)

# with open('./src/data/county_to_consituencies.json', 'w') as f:
#     f.write(json.dumps(county_to_consituencies))