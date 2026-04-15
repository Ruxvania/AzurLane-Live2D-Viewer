'''
轉換拆包出來的model3.json
重命名、組織motions以及增加n個hitarea(如TouchHead, TouchBody, TouchSpecial)
檔案結構須為(例):
assets
├─edu_3
│  │  edu_3.moc3
│  │  edu_3.model3.json
│  │  edu_3.physics3.json
│  ├─motions
│  └─textures
│
└─edu_4
    │  edu_4.moc3
    │  edu_4.model3.json
    │  edu_4.physics3.json
    ├─motions
    └─textures
'''

import os
import json

base = input("Directory: ")

if not os.path.isdir(base):
    print("Error: Directory does not exist")
    exit(-1)

folders = os.listdir(base)
for folder in folders:
    print("Processing " + folder)

    model3Path = os.path.join(base, folder, f"{folder}.model3.json")
    print(model3Path)
    if not os.path.exists(model3Path):
        print("Error: model3.json file was not detected\n")
        continue

    model3 = open(model3Path, 'r+')
    model = json.loads(model3.read())

    model['HitAreas'] = []

    for motion in model["FileReferences"]["Motions"]:
        if motion.startswith('touch'): # 'touch_body'
            splited = motion.split('_') # ['touch', 'body']
            splited = [s.capitalize() for s in splited] # ['Touch', 'Body']
            hitAreaId = ''.join(splited) # 'TouchBody'
            hitArea = {
                'Id': hitAreaId,
                'Name': motion
            }
            model['HitAreas'].append(hitArea)
            
    print(f"Rename all {len(model['FileReferences']['Motions'].keys())} motions")
    print(f"Add {len(model['HitAreas'])} HitAreas\n")
    
    model3.seek(0)
    model3.write(json.dumps(model, indent=2))
    model3.truncate()
    model3.close()

print(f"Processed all {len(folders)} l2d")
