// A curated diceware-style wordlist for the passphrase generator. This is NOT
// the official 7,776-word EFF list - it's a smaller, hand-picked set of common,
// unambiguous, easy-to-type English words. Entropy math (see secret-generator.ts)
// uses this list's actual length via log2(WORDLIST.length), so its size doesn't
// need to be a round number - accuracy of the entropy estimate just depends on
// every entry here being unique.
export const WORDLIST = [
  // animals
  'ant', 'bear', 'bird', 'cat', 'crab', 'crow', 'deer', 'dog', 'duck', 'eagle',
  'fish', 'fox', 'frog', 'goat', 'goose', 'hawk', 'horse', 'lion', 'lynx', 'mole',
  'moose', 'mouse', 'otter', 'owl', 'panda', 'rabbit', 'seal', 'shark', 'sheep', 'wolf',
  'zebra', 'tiger', 'whale', 'swan', 'robin', 'raven', 'puma', 'newt', 'mule', 'lark',
  // nature / weather
  'beach', 'birch', 'bloom', 'brook', 'cedar', 'cliff', 'cloud', 'coast', 'creek', 'dawn',
  'delta', 'dune', 'dusk', 'fern', 'field', 'flame', 'forest', 'frost', 'glade', 'grove',
  'hill', 'ice', 'island', 'lake', 'leaf', 'marsh', 'meadow', 'mist', 'moon', 'moss',
  'peak', 'pine', 'pond', 'rain', 'reef', 'ridge', 'river', 'rock', 'sand', 'shore',
  'sky', 'snow', 'star', 'storm', 'stream', 'sun', 'thaw', 'tide', 'valley', 'wave',
  // colors
  'amber', 'azure', 'bronze', 'coral', 'crimson', 'emerald', 'gold', 'indigo', 'ivory', 'jade',
  'maroon', 'navy', 'olive', 'pearl', 'plum', 'rose', 'ruby', 'sage', 'teal', 'violet',
  // objects
  'anchor', 'arrow', 'axe', 'badge', 'ball', 'banner', 'barrel', 'basket', 'bell', 'blade',
  'boat', 'book', 'boot', 'bottle', 'bowl', 'box', 'brick', 'bridge', 'brush', 'bucket',
  'cabin', 'camera', 'candle', 'cannon', 'cape', 'card', 'cart', 'castle', 'chain', 'chair',
  'chest', 'clock', 'coin', 'comb', 'compass', 'cord', 'crown', 'cube', 'cup', 'dial',
  'drum', 'flag', 'flask', 'gate', 'harp', 'helm', 'hook', 'horn', 'jar', 'key',
  'kite', 'lamp', 'lens', 'lever', 'map', 'mask', 'mirror', 'nail', 'net', 'oar',
  'paddle', 'pipe', 'plate', 'pouch', 'quill', 'raft', 'ring', 'rope', 'sail', 'shield',
  'spade', 'spoon', 'stamp', 'staff', 'tent', 'torch', 'tower', 'tray', 'vase', 'wheel',
  // food
  'apple', 'bacon', 'bean', 'berry', 'bread', 'broth', 'butter', 'cake', 'candy', 'cherry',
  'chili', 'cocoa', 'corn', 'cream', 'curry', 'fig', 'grain', 'grape', 'honey', 'jam',
  'lemon', 'lime', 'mango', 'melon', 'mint', 'raisin', 'onion', 'peach', 'pear', 'walnut',
  'rice', 'salt', 'spice', 'sugar', 'syrup', 'toast', 'wheat', 'yam', 'basil', 'clove',
  // adjectives
  'bold', 'brave', 'bright', 'brisk', 'broad', 'calm', 'clean', 'clear', 'clever', 'cool',
  'crisp', 'curly', 'dense', 'eager', 'early', 'fair', 'fast', 'fine', 'firm', 'flat',
  'fresh', 'gentle', 'giant', 'glad', 'grand', 'great', 'happy', 'hardy', 'heavy', 'huge',
  'keen', 'kind', 'large', 'late', 'lean', 'light', 'lively', 'lucky', 'lush', 'merry',
  'mighty', 'mild', 'neat', 'noble', 'plain', 'proud', 'quick', 'quiet', 'rapid', 'rare',
  'rich', 'sharp', 'shiny', 'silent', 'silly', 'slim', 'smart', 'smooth', 'soft', 'solid',
  'sound', 'spry', 'stark', 'steady', 'stout', 'strong', 'sturdy', 'sunny', 'swift', 'tidy',
  'tough', 'vast', 'vivid', 'warm', 'wild', 'wise', 'witty', 'young', 'zesty', 'active',
  // verbs
  'act', 'aim', 'ask', 'bake', 'bind', 'blend', 'boost', 'build', 'carry', 'carve',
  'catch', 'chase', 'cheer', 'climb', 'craft', 'dance', 'dash', 'dive', 'draft', 'draw',
  'dream', 'drift', 'drive', 'earn', 'fetch', 'find', 'fix', 'flow', 'fly', 'focus',
  'form', 'gain', 'gather', 'give', 'glide', 'grow', 'guard', 'guide', 'hold', 'hunt',
  'jump', 'keep', 'lead', 'leap', 'learn', 'lift', 'march', 'mend', 'mix', 'move',
  'paint', 'plant', 'play', 'race', 'reach', 'read', 'roam', 'run', 'ride', 'save',
  'scan', 'search', 'sense', 'shape', 'share', 'shift', 'sketch', 'soar', 'solve', 'sort',
  'spark', 'speak', 'spin', 'sprint', 'stack', 'start', 'steer', 'stir', 'study', 'surf',
  'swing', 'teach', 'trace', 'track', 'train', 'travel', 'trust', 'tune', 'watch', 'weave',
  // misc nouns
  'arch', 'atlas', 'aura', 'bay', 'beam', 'bolt', 'brand', 'camp', 'canyon', 'cave',
  'chart', 'cove', 'crest', 'dome', 'echo', 'edge', 'ember', 'era', 'flare', 'forge',
  'grid', 'harbor', 'haven', 'ledge', 'nova', 'orbit', 'pulse', 'quest', 'realm', 'saga',
  'scope', 'signal', 'spire', 'summit', 'tempo', 'trail', 'vault', 'vertex', 'zone', 'crux',
];
