with open('lib/collect-embed.ts', 'rb') as f:
    content = f.read()

# Replace the specific byte sequences
old1 = b'if(${w.display_type} !== \'inline\')'
new1 = b'if(DT !== \'inline\')'
content = content.replace(old1, new1)

old2 = b'${w.display_type} === \'floating\''
new2 = b'DT === \'floating\''
content = content.replace(old2, new2)

with open('lib/collect-embed.ts', 'wb') as f:
    f.write(content)

print('Done')