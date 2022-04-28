import csv, json

# counties_names_map = {}
# with open('./src/data/counties.json') as f:
#     counties = json.loads(f.read())
#     for i in counties:
#         counties_names_map[i['code']] = i['name']
# print(counties_names_map)



constituency_names_map = {}
with open('./src/data/constituencies.json') as f:
    counties = json.loads(f.read())
    for i in counties:
        constituency_names_map[i['code']] = i['name']
print(constituency_names_map)


with open('./src/data/wards.json') as f:
    c = json.loads(f.read())

with open('./src/data/wards-output.csv', mode='w') as csv_file:
    fieldnames = ['ID', 'Region', 'Institution', 'Region ID','is Polling Station', 'Active Register', 'is Group', 'Parent Electoral District' ]
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames, quoting=csv.QUOTE_NONNUMERIC)
    writer.writeheader()
    for i in c:
        writer.writerow({'ID': "{}".format(i['name'].upper()), 
            'Region': (i['name']).upper() + " WARD",
            'Institution': 'United Progressive Alliance',
            'Region ID': i['code'],
            'is Polling Station': '0',
            'Active Register':'V-REG-00001',
            'is Group': '1',
            'Parent Electoral District': (constituency_names_map[i['constituency_code']]).upper() + " CONSTITUENCY"
        })