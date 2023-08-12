'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jibran Zaffer',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2023-07-22T23:36:17.929Z',
    '2023-07-21T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2023-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2023-06-25T18:49:59.371Z',
    '2023-07-21T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days`;

  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  return `${month}/ ${day}/${year}`;
  //
  // return new Intl.DateTimeFormat(locale).format(date);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);

    const formattedMov = Intl.NumberFormat(acc.locale, {
      style: 'currency',
      currency: 'USD',
    }).format(mov);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handler

const startLogoutTimer = function () {
  // Set time to 5 min
  let time = 100;
  // Call the timer every second
  setInterval(function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = Math.trunc(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;
    time = time - 1;
  }, 1000);
  // In each call, print the remaining time to UI

  // When 0 seconds, logout user
};

let currentAccount;

// Fake Always LOGIN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//day/month/year

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long'
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    startLogoutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  setTimeout(function () {
    if (
      amount > 0 &&
      currentAccount.movements.some(mov => mov >= amount * 0.1)
    ) {
      // Add movement
      currentAccount.movements.push(amount);

      // Add Loan Date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }
  }, 2500);
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// console.log(23 === 23.0);

// // Base 10 - 0 to 9
// // Binary base 2 - 0 to 1
// // Conversion
// console.log(Number('23'));
// console.log(+'23');
// // Parsing
// console.log(Number.parseInt('30px',10));
// console.log(Number.parseInt('px30',10));

// console.log(Number.parseInt('2.5rem'));
// console.log(Number.parseFloat('2.5rem'));
// // console.log(parseFloat("2.5"))
// console.log(Number.isNaN(20));
// console.log(Number.isNaN('29'));
// console.log(Number.isNaN(+'x29'));
// // Cbecking if value is number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite("20"));

// console.log(Math.sqrt(25));
// console.log(25 ** (1/2));
// console.log(8 ** (1/3));

// console.log(Math.max(4,5,3,6,2,1,3));
// console.log(Math.min(4,5,3,6,2,1,3));

// console.log(Math.PI * Number.parseFloat('10px') ** 2);

// console.log(Math.random() * 6);

// const randomInt = (min, max) => Math.trunc(Math.random()*(max - min)+ 1 ) + min;

// randomInt(10,20);

// // Rounding Ints
// console.log(Math.trunc(23.3));

// console.log(Math.round(23.7));
// console.log(Math.ceil(23.7));
// console.log(Math.round(23.7));
// console.log(Math.floor(23.6));

// console.log(5 % 2);
// console.log(8 % 3);

// console.log(6 % 2);

/*
console.log(2 ** 53 -1 );
console.log(Number.MAX_SAFE_INTEGER);

console.log(32493242304923049342523121n); 
console.log(BigInt(34234523523423524353242135245)); 

// Operations using BigInt
console.log(10000n + 10000n);
console.log(2342352352345243524n * 345252423524352n);

const huge = 3423423524523235n;
const num = 23;
console.log(huge * BigInt(num));  

console.log(20n > 15);
console.log(20n === 20);

// Divisions
console.log(10n / 3n);
*/
/*
// Create a date
const now = new Date();
console.log(now); 

console.log(new Date('Sun Jul 23 2023 23:48:47 GMT-0400 (Eastern Daylight Time)'));
console.log(new Date('December 24, 2015')); 

console.log(new Date(account1.movementsDates[0]));    

console.log(new Date(2037,10,19,15,23,5));
console.log(new Date(2037,10,31,15,23,5));

console.log(new Date(0));

console.log(new Date(3*24*60*60*1000)); 

// Working with Dates
const future = new Date(2037,10,31,15,23,5);  
console.log(future);
console.log(future.getFullYear()); 
console.log(future.getMonth()); 
console.log(future.getDate()); 
console.log(future.getDay()); 
console.log(future.getMinutes()); 
console.log(future.getSeconds());
console.log(future.toISOString());  
*/

// const calcDaysPassed = (date1, date2) =>
// Math.abs((date2 - date1) / (1000*60*60*24));

// const num = 3234523.23;
// const options = {
//   style: 'unit',
//   unit: 'mile-per-hour',
// }

// console.log(new Intl.NumberFormat('en-US',options).format(num));
// console.log(new Intl.NumberFormat('de-DE').format(num));
// console.log(new Intl.NumberFormat('ar-SY').format(num));

// setInterval(function() {
//   const now = new Date();
//   console.log(now);
// })
