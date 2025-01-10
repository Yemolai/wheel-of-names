import { Random, browserCrypto as browserCryptoEngine } from 'random-js'
import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'

const app = document.querySelector('#app');
const wheel = app.querySelector('.wheel');
const listOfNames = app.querySelector('ul#names-list');
const namesTextarea = app.querySelector('textarea#names');
const spinButton = app.querySelector('button');

let placeholderNames = ['John', 'Jane', 'Joey', 'Fernando', 'Paul'];

let namesList = placeholderNames;
let spinning = false;

function generateRandomWithin(from, to, resolution = 2) {
  const rng = new Random(browserCryptoEngine);
  const factor = Math.pow(10, Math.round(Math.abs(resolution)));
  const randomValue = rng.realZeroToOneInclusive();
  return Math.round((from + (randomValue * (to - from))) * factor) / factor;
}

function updateNamesList(event) {
  const field = event.target;
  const namesListFromField = field.value.split('\n').filter(line => line.trim().length > 0);
  const namesCount = namesListFromField.length;

  if (namesCount < 1) {
    namesList = placeholderNames;
  } else if (namesCount < 2) {
    const [singleName] = namesListFromField;
    namesList = new Array(4).fill(singleName);
  } else if (namesCount < 3) {
    const [a, b] = namesListFromField;
    namesList = [a, b, a, b];
  } else if (namesCount < 4) {
    const [a, b, c] = namesListFromField;
    namesList = [a, b, c, a, b, c];
  } else {
    namesList = namesListFromField;
  }

  const namesListItems = namesList.map((name, idx) => {
    const li = document.createElement('li');
    li.innerText = `${name}`;
    li.setAttribute('style', `--_idx: ${idx + 1};`);
    return li;
  });

  listOfNames.innerHTML = '';
  listOfNames.append(...namesListItems);
  listOfNames.setAttribute('style', `--_items: ${namesList.length};`)
}

function forceUpdateNamesList() {
  updateNamesList({ target: namesTextarea });
}

namesTextarea.addEventListener('keyup', updateNamesList);
namesTextarea.addEventListener('paste', updateNamesList);

spinButton.addEventListener('click', () => {
  if (spinning) return false;
  spinning = true;
  spinButton.disabled = true;

  forceUpdateNamesList();
  // const names = [...namesList];
  const duration = generateRandomWithin(3, 6);
  const startingPoint = generateRandomWithin(0, 360);
  const targetPoint = generateRandomWithin(0, 360);
  wheel.setAttribute('style', [
    ['spin-duration', duration],
    ['spin-start-angle', startingPoint],
    ['spin-final-angle', targetPoint]
  ]
    .map(([key, value]) => `--${key}: ${value}`)
    .join(';')
  );
  wheel.classList.add('spin');

  setTimeout(() => {
    spinning = false;
    spinButton.disabled = false;
    wheel.setAttribute('style', `--spin-start-angle: ${targetPoint}`);
    wheel.classList.remove('spin');
  }, (duration + 1) * 1000);
});

document.addEventListener('DOMContentLoaded', () => {
  namesTextarea.value = placeholderNames.join('\n');
  forceUpdateNamesList();
});
