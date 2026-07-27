with open('lib/collect-embed.ts', 'rb') as f:
    content = f.read()

# Fix the keydown handler too
old = b'contains(\'open\') && ${w.display_type} !== \'inline\')'
new = b'contains(\'open\') && DT !== \'inline\')'
content = content.replace(old, new)

# Also fix the floating ternary operators that generate JS code (they should use DT at runtime)
# These are the ones that generate actual JS code, not just CSS
# at 15317: ${w.display_type === 'floating' ? `\nvar t
# at 16710: ${w.display_type === 'floating' ? `\nif(tb
# at 16826: w.display_type === 'inline' ? '' : `pn.c

with open('lib/collect-embed.ts', 'wb') as f:
    f.write(content)

print('Done')