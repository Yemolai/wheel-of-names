import { Random, browserCrypto as browserCryptoEngine } from 'random-js'
import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'

const STORAGE_KEY = 'names-list';
const WHEEL_ACTION_CLASS = 'spinning';

const app = document.querySelector('#app');
const wheel = app.querySelector('.wheel');
const listOfNames = app.querySelector('ul#names-list');
const namesTextarea = app.querySelector('textarea#names');
const spinButton = app.querySelector('button#spin-action');
const winnerDialog = app.querySelector('dialog#winner-dialog');

document.querySelectorAll('dialog').forEach((dialog) => {
  const closeDialogButtons = dialog.querySelectorAll('button.close-dialog');
  function closeDialog() {
    if (dialog.open) {
      dialog.close();
    }
  }
  closeDialogButtons.forEach((closeDialogButton) => {
    closeDialogButton.addEventListener('click', () => closeDialog());
  });
});

function renderWinnerName(name) {
  document.querySelector('dialog#winner-name').innerText = name;
}

function loadFromLocalStorage(fallbackValue = []) {
  try {
    if (!localStorage || !localStorage.getItem) {
      throw new Error('Cannot access LocalStorage');
    }
    const serialized = localStorage.getItem(STORAGE_KEY);
    return JSON.parse(serialized);
  } catch (error) {
    console.error('failed to load from local storage', error);
    return fallbackValue;
  }
}

function saveToLocalStorage(namesList) {
  if (!localStorage || !localStorage.setItem) {
    return alert('Do not have access to LocalStorage. Can\' save the list.');
  }
  const serialized = JSON.stringify(namesList);
  localStorage.setItem(STORAGE_KEY, serialized);
}

let placeholderNames = ['John', 'Jane', 'Joey', 'Fernando', 'Paul'];

let namesList = placeholderNames;
let spinning = false;

function generateRandomWithin(min, max, resolution = 2) {
  const rng = new Random(browserCryptoEngine);
  const factor = Math.pow(10, Math.round(Math.abs(resolution)));
  const randomValue = rng.realZeroToOneInclusive();
  return Math.round(
    (min + (randomValue * (max - min)))
    * factor
  ) / factor;
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
    ['spin-final-angle', targetPoint],
    ['spin-duration', duration],
    ['spin-start-angle', startingPoint],
  ]
    .map(([key, value]) => `--${key}: ${value}`)
    .join(';')
  );
  wheel.classList.add(WHEEL_ACTION_CLASS);

  setTimeout(() => {

    spinning = false;
    spinButton.disabled = false;
    wheel.setAttribute('style', `--spin-start-angle: ${targetPoint}`);
    wheel.classList.remove(WHEEL_ACTION_CLASS);
  }, (duration + 1) * 1000);
});

document.addEventListener('DOMContentLoaded', () => {
  namesTextarea.value = placeholderNames.join('\n');
  forceUpdateNamesList();
});
