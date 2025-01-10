import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'

const app = document.querySelector('#app');
const listOfNames = app.querySelector('ul#names-list');
const namesTextarea = app.querySelector('textarea#names');

let placeholderNames = ['John', 'Jane', 'Joey', 'Steph', 'Paul'];

let namesList = placeholderNames;

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

namesTextarea.addEventListener('keyup', updateNamesList);
namesTextarea.addEventListener('paste', updateNamesList);

window.addEventListener('DOMContentLoaded', () => {
  updateNamesList({ target: namesTextarea });
})

