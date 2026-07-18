#!/usr/bin/env node

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const dailySource = fs.readFileSync(path.join(root, 'daily-verses.js'), 'utf8');
const sharedSource = fs.readFileSync(path.join(root, 'shared.js'), 'utf8');

const elements = {};
function fakeElement() {
  return {
    innerHTML: '', textContent: '', value: '',
    style: {setProperty: () => {}},
    classList: {add: () => {}, remove: () => {}, toggle: () => {}},
    setAttribute: () => {}, addEventListener: () => {},
    scrollIntoView: () => {}
  };
}

const context = vm.createContext({
  console,
  Date,
  Math,
  JSON,
  setTimeout: () => 0,
  clearTimeout: () => {},
  supabase: {createClient: () => ({})},
  document: {
    getElementById: id => (elements[id] ||= fakeElement()),
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({})
  },
  window: {scrollTo: () => {}},
  navigator: {},
  localStorage: {getItem: () => null, setItem: () => {}}
});

vm.runInContext(`${dailySource}\n${sharedSource}\n;globalThis.__dailyTest={
  source:DAILY_VERSE_LIBRARY,
  verses:VERSES,
  study:STUDY_VERSES,
  state,
  defaultProducts:DEFAULT_PRODUCTS,
  getDailyVerse,
  getDailyAffirmation,
  renderProducts,
  renderRoutine
};`, context);

const api = context.__dailyTest;

assert.equal(api.source.length, 111, 'the reviewed WEB library should contain 111 readings');
assert.ok(api.verses.length >= 150, 'the merged rotation should contain at least 150 readings');
assert.equal(new Set(api.verses.map(v => v.ref.toLowerCase())).size, api.verses.length, 'verse references must be unique');

for (const verse of api.verses) {
  for (const field of ['ref', 'text', 'context', 'meaning', 'application', 'prompt']) {
    assert.equal(typeof verse[field], 'string', `${verse.ref} is missing ${field}`);
    assert.ok(verse[field].trim(), `${verse.ref} has an empty ${field}`);
  }
}

const dailyRefs = [];
for (let day = 0; day < api.verses.length; day += 1) {
  dailyRefs.push(api.getDailyVerse(new Date(2026, 9, 1 + day, 9)).ref);
}
assert.equal(new Set(dailyRefs).size, api.verses.length, 'daily verses should not repeat before the rotation is exhausted, including across New Year');
assert.equal(
  api.getDailyVerse(new Date(2026, 6, 18, 1)).ref,
  api.getDailyVerse(new Date(2026, 6, 18, 23)).ref,
  'the daily verse should remain stable throughout the day'
);

const affirmations = [];
for (let day = 0; day < 366; day += 1) {
  const date = new Date(2026, 0, 1 + day, 9);
  const affirmation = api.getDailyAffirmation(0, date);
  assert.ok(!affirmation.includes('undefined'), `invalid affirmation on ${date.toISOString()}`);
  assert.ok(affirmation.length > 100, `affirmation is unexpectedly short on ${date.toISOString()}`);
  affirmations.push(affirmation);
}
assert.equal(new Set(affirmations).size, affirmations.length, 'daily affirmations should not repeat within a leap year');

const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripture = fs.readFileSync(path.join(root, 'scripture.html'), 'utf8');
assert.ok(home.includes('id="dailyAffirmation"'), 'the Hero page needs the daily affirmation');
assert.ok(home.indexOf('daily-verses.js') < home.indexOf('shared.js'), 'daily verse data must load before shared logic');
assert.ok(scripture.includes('data-trans="web"'), 'the scripture filter needs a WEB option');
assert.ok(scripture.indexOf('daily-verses.js') < scripture.indexOf('shared.js'), 'scripture data must load before shared logic');

const routine = fs.readFileSync(path.join(root, 'routine.html'), 'utf8');
const products = fs.readFileSync(path.join(root, 'products.html'), 'utf8');
assert.ok(routine.includes('class="routine-mode"'), 'the routine page needs its Quick, Full and Focus modes');
assert.ok(products.includes('id="shelfSummary"'), 'the product page needs its stock overview');

api.state.products = api.defaultProducts.map((product, index) => ({...product, id: index + 1, stock: product.stock || 'full'}));
api.renderProducts();
assert.ok(elements.shelfSummary.innerHTML.includes('running low'), 'the shelf overview should render stock counts');
assert.ok(elements.productsList.innerHTML.includes('stock-badge'), 'product cards should render quick stock controls');
api.renderRoutine();
assert.ok(elements.routine.innerHTML.includes('routine-check'), 'routine steps should render completion controls');
assert.ok(elements.routineProgress.innerHTML.includes('complete'), 'routine progress should render');

for (const page of ['index.html', 'routine.html', 'products.html', 'scripture.html']) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  for (const label of ['Home', 'Routine', 'Products', 'Scripture']) {
    assert.ok(html.includes(`class="nav-label">${label}</span>`), `${page} is missing the ${label} navigation item`);
  }
}
for (const retired of ['motivation.html', 'wellness.html', 'cognitive-triangle.html']) {
  assert.equal(fs.existsSync(path.join(root, retired)), false, `${retired} should be retired from the focused app`);
}

console.log(`Daily content verified: ${api.verses.length} verses and ${affirmations.length} unique dated affirmations.`);
