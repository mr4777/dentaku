const display = document.querySelector(".display");
const startButton = document.querySelector("#start-button");
const input = document.querySelector(".input");
const log = document.querySelector('.log');
const inputCount = document.getElementById('count');
const inputDigit = document.getElementById('digit');
const inputRound = document.getElementById('round');

const config = {
  count: 10,
  digit: 6,
  round: 2
}

let startTime;
let sum = 0;

render(config.count, config.digit, config.round);

inputCount.addEventListener('input', () => {
  if (parseInt(inputCount.value) < 2) inputCount.value = 2;
  else if (parseInt(inputCount.value) > 20) inputCount.value = 20;
  else {
    config.count = inputCount.value;
    render(config.count, config.digit, config.round);
  }
})

inputDigit.addEventListener('input', () => {
  if (parseInt(inputDigit.value) <= config.round) inputDigit.value = parseInt(config.round) + 1;
  else if (parseInt(inputDigit.value) > 10) inputDigit.value = 10;
  else {
    config.digit = inputDigit.value;
    render(config.count, config.digit, config.round);
  }
})

inputRound.addEventListener('input', () => {
  if (parseInt(inputRound.value) < 0) inputRound.value = 0;
  else if (parseInt(inputRound.value) >= config.digit) inputRound.value = parseInt(config.digit) - 1;
  else {
    config.round = inputRound.value;
    render(config.count, config.digit, config.round);
  }
})


input.addEventListener('keypress', (e) => {
  if (e.code === "Enter") {
    if (input.value === '') return;
    const endTime = Date.now();
    const time = (endTime - startTime)/1000;
    const min = `${Math.floor(time/60)}`.padStart(2, '0');
    const sec = `${Math.floor(time%60)}`.padStart(2, '0');
    if (sum == Number(input.value.replace(/\D/g,''))) {
      addLog(`<div style="margin-bottom: 6px; text-indent: 1em">${min}:${sec} <span class="blue">正解</span>`);
      input.classList.add('green');
      input.disabled = true;
      startButton.removeEventListener('click', answer);
      startButton.textContent = '再挑戦'
      startButton.addEventListener('click', reset);
      display.insertAdjacentHTML('beforebegin', `<img src="maru.gif?${new Date().getTime()}" class="maru">`)
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
  startTime = Date.now();
  inputCount.disabled = !inputCount.disabled;
  inputDigit.disabled = !inputDigit.disabled;
  inputRound.disabled = !inputRound.disabled;
  input.disabled = !input.disabled;
  addLog(`<div>開始 <span style="font-size:15px">(項数:${config.count} 桁数:${config.digit} 丸め:${config.round})</span> </div>`);
  startButton.removeEventListener('click', start);
  startButton.textContent = '解答表示'
  startButton.addEventListener('click', answer);
}

function answer() {
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
  inputCount.disabled = !inputCount.disabled;
  inputDigit.disabled = !inputDigit.disabled;
  inputRound.disabled = !inputRound.disabled;
  input.value = '';
  startButton.removeEventListener('click', reset);
  startButton.textContent = '開始'
  startButton.addEventListener('click', start);
  document.querySelector('.maru').remove();
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


