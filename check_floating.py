with open('lib/collect-embed.ts', 'r') as f:
    content = f.read()
idx = content.find('w.display_type === "floating"')
if idx >= 0:
    print(f'Found at index {idx}')
    print(content[max(0,idx-200):idx+500])
else:
    print('Not found with double quotes, trying single')
    idx = content.find("w.display_type === 'floating'")
    if idx >= 0:
        print(f'Found at index {idx}')
        print(content[max(0,idx-200):idx+500])