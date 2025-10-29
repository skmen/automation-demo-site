
const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Test: Check if products.json is not empty
const productsPath = path.join(__dirname, 'products.json');
const productsContent = fs.readFileSync(productsPath, 'utf-8');
assert(productsContent.length > 0, 'products.json should not be empty');

// Test: Check if scripts.js fetches and loads products
const scriptsPath = path.join(__dirname, 'scripts.js');
const scriptsContent = fs.readFileSync(scriptsPath, 'utf-8');
assert(scriptsContent.includes('fetchProducts();'), 'scripts.js should call fetchProducts() directly');

// Test: Check if products.html has the script at the end of the body
const productsHtmlPath = path.join(__dirname, 'products.html');
const productsHtmlContent = fs.readFileSync(productsHtmlPath, 'utf-8');
assert(productsHtmlContent.includes('</body><script src="scripts.js"></script>'), 'products.html should have the script at the end of the body');

console.log('All tests passed!');
