// Dynamically import all JS files in /cards
const context = require.context('./cards', true, /\.js$/);

context.keys().forEach((key) => {
  console.info(`Loading card: ${key}`);
  context(key);
});

// Optional: Log for debugging
console.info(
  '%c Cards Galore: All cards loaded from /cards',
  'color: white; background: #2ecc71; font-weight: bold; padding: 2px 4px; border-radius: 2px'
);
