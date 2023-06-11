const display = document.querySelector(".display");
const startButton = document.querySelector("#start-button");
const input = document.getElementById('input-number');
const log = document.querySelector('.log');
const inputCount = document.getElementById('count');
const inputDigit = document.getElementById('digit');
const inputRound = document.getElementById('round');
const plusButton = document.querySelector('.plus');
const minusButton = document.querySelector('.minus');

input.disabled = true;

const config = {
  selected: '',
  count: 10,
  digit: 6,
  round: 3,
}

inputCount.textContent = config.count
inputDigit.textContent = config.digit
inputRound.textContent = config.round

let startTime;
let sum = 0;
let playing = false;
let maru;

render(config.count, config.digit, config.round);

plusButton.addEventListener('click', () => {
  if (config.selected === 'count' && config.count < 20) {
    config.count = config.count + 1;
    inputCount.textContent = parseInt(inputCount.textContent) + 1;
  } else if (config.selected === 'digit' && config.digit < 10) {
    config.digit = config.digit + 1;
    inputDigit.textContent = parseInt(inputDigit.textContent) + 1;
  } else if (config.selected === 'round' && config.round < config.digit - 1) {
    config.round = config.round + 1;
    inputRound.textContent = parseInt(inputRound.textContent) + 1;
  } else { return; }
  render(config.count, config.digit, config.round);
})

minusButton.addEventListener('click', () => {
  if (config.selected === 'count' && config.count > 2) {
    config.count = config.count - 1;
    inputCount.textContent = parseInt(inputCount.textContent) - 1;
  } else if (config.selected === 'digit' && config.digit > config.round + 1) {
    config.digit = config.digit - 1;
    inputDigit.textContent = parseInt(inputDigit.textContent) - 1;
  } else if (config.selected === 'round' && config.round > 0) {
    config.round = config.round - 1;
    inputRound.textContent = parseInt(inputRound.textContent) - 1;
  } else { return; }
  render(config.count, config.digit, config.round);
})

inputCount.addEventListener('click', () => {
  inputCount.classList.toggle('selected');
  inputDigit.classList.remove('selected');
  inputRound.classList.remove('selected');
  if (inputCount.classList.contains('selected')) {
    config.selected = 'count';
  } else {
    config.selected = '';
  }
})

inputDigit.addEventListener('click', () => {
  inputCount.classList.remove('selected');
  inputDigit.classList.toggle('selected');
  inputRound.classList.remove('selected');
  if (inputDigit.classList.contains('selected')) {
    config.selected = 'digit';
  } else {
    config.selected = '';
  }
})

inputRound.addEventListener('click', () => {
  inputCount.classList.remove('selected');
  inputDigit.classList.remove('selected');
  inputRound.classList.toggle('selected');
  if (inputRound.classList.contains('selected')) {
    config.selected = 'round';
  } else {
    config.selected = '';
  }
})

input.addEventListener('keypress', (e) => {
  if (e.code === "Enter" && playing === true) {
    if (input.value === '') return;

    const endTime = Date.now();
    const time = (endTime - startTime)/1000;
    const min = `${Math.floor(time/60)}`.padStart(2, '0');
    const sec = `${Math.floor(time%60)}`.padStart(2, '0');

    if (sum == Number(input.value.replace(/\D/g,''))) {
      playing = false;
      addLog(`<div style="margin-bottom: 6px; text-indent: 1em">${min}:${sec} <span class="blue">正解</span>`);
      input.classList.add('green');
      input.disabled = true;
      startButton.removeEventListener('click', answer);
      startButton.textContent = '再挑戦'
      startButton.addEventListener('click', reset);
      display.insertAdjacentHTML('beforebegin', `<img src="maru.gif?${new Date().getTime()}" class="maru">`);
      maru = document.querySelector('.maru');
    } else {
      let value = parseInt(input.value.replace(/\D/g,'')).toLocaleString();
      addLog(`<div style="text-indent: 1em">${min}:${sec} <span class="red">${value}</span></div>`);
      input.value = '';
    }
  }
})

input.addEventListener('blur', () => {
  let inputNumber = input.value;
  if (inputNumber === '') return;
  inputNumber = parseInt(input.value.replace(/\D/g,''));
  input.value = inputNumber.toLocaleString()
})

startButton.addEventListener('click', start)

function start() {

  render(config.count, config.digit, config.round);

  playing = true;

  startTime = Date.now();

  inputCount.classList.remove('selected');
  inputDigit.classList.remove('selected');
  inputRound.classList.remove('selected');

  inputCount.classList.add('disabled');
  inputDigit.classList.add('disabled');
  inputRound.classList.add('disabled');

  plusButton.classList.add('disabled');
  minusButton.classList.add('disabled');

  input.disabled = false;

  addLog(`<div>開始 <span style="font-size:15px">(項数:${config.count} 桁数:${config.digit} 丸め:${config.round})</span> </div>`);
  startButton.removeEventListener('click', start);
  startButton.textContent = '解答表示'
  startButton.addEventListener('click', answer);
}

function answer() {
  playing = false;

  const endTime = Date.now();
  const time = (endTime - startTime)/1000;
  const min = `${Math.floor(time/60)}`.padStart(2, '0');
  const sec = `${Math.floor(time%60)}`.padStart(2, '0');
  addLog(`<div style="margin-bottom: 6px; text-indent: 1em">${min}:${sec} <span class="green">${sum.toLocaleString()}</span></div>`);
  input.disabled = true;
  startButton.removeEventListener('click', answer);
  startButton.textContent = '再挑戦'
  startButton.addEventListener('click', reset);
}

function reset() {
  render(config.count, config.digit, config.round);

  inputCount.classList.remove('disabled');
  inputDigit.classList.remove('disabled');
  inputRound.classList.remove('disabled');

  plusButton.classList.remove('disabled');
  minusButton.classList.remove('disabled');

  input.value = '';
  startButton.removeEventListener('click', reset);
  startButton.textContent = '開始'
  startButton.addEventListener('click', start);
  if (maru) maru.remove();
}

function addLog(content) {
  log.insertAdjacentHTML('beforeend', content);
}

function render(count, digit, round) {
  while(display.firstChild) display.removeChild(display.firstChild);
  sum = 0;
  for (let i = 0; i < count; i++) {
    let num = Math.floor((Math.random()*0.9+0.1)*(10**digit));
    num = Math.floor(num / (10**round)) * (10**round);
    sum += num;
    if(i === 0) {
      display.insertAdjacentHTML('afterbegin', `
        <div style="border-bottom: solid .1px white; padding-bottom: 3px;">
          <span style="float:left">+</span>
          ${num.toLocaleString()}
        </div>`
      );
    }
    else display.insertAdjacentHTML('afterbegin', `<div>${num.toLocaleString()}</div>`);;
  }
}