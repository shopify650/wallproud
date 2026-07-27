with open('lib/collect-embed.ts', 'rb') as f:
    content = f.read()

content = content.replace(b'\${w.display_type} !== \'inline\'', b'DT !== \'inline\'')
content = content.replace(b'\${w.display_type} === \'floating\'', b'DT === \'floating\'')

with open('lib/collect-embed.ts', 'wb') as f:
    f.write(content)

print('Done')