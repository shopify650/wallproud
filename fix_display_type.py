with open('lib/collect-embed.ts', 'rb') as f:
    content = f.read()

# Replace all occurrences of w.display_type in JavaScript logic with DT
replacements = [
    (b'\${w.display_type === \'floating\' ? \`', b'\${DT === \'floating\' ? \`'),
    (b'\${w.display_type === \'inline\' ?', b'\${DT === \'inline\' ?'),
    (b'\${w.display_type} !== \'inline\'', b'\${DT} !== \'inline\''),
]

for old, new in replacements:
    count = content.count(old)
    if count > 0:
        content = content.replace(old, new)
        print(f'Replaced {count} occurrences of {old}')

with open('lib/collect-embed.ts', 'wb') as f:
    f.write(content)

print('Done')