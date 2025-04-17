const { execSync } = require('child_process');
const path = require('path');

// Run the Vite build command
execSync('vite build', { stdio: 'inherit' });

// Run the TypeScript file (connect.ts) using ts-node
execSync('npx ts-node ' + path.join(__dirname, 'connect.ts'), { stdio: 'inherit' });

// Add any custom operations you'd like here
console.log('Custom build script ran successfully!');
