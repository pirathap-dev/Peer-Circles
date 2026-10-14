const ADJECTIVES = ['Brave', 'Calm', 'Kind', 'Gentle', 'Hopeful', 'Serene', 'Quiet', 'Wise'];
const ANIMALS    = ['Owl', 'Fox', 'Bear', 'Deer', 'Robin', 'Wolf', 'Hare', 'Hawk'];

function generateAnonAlias() {
  const adj    = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `Anonymous ${adj} ${animal}`;
}

module.exports = { generateAnonAlias };
