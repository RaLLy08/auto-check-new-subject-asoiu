const Browser = require('zombie');

const LOGIN_URL = 'https://asoiuexam.com/studentLogin';

const browser = new Browser();
const browser2 = new Browser();
const browser3 = new Browser();
const browser4 = new Browser();

//
const subjectID = '1534';
const delayBetweenAuth = 10000;

const delayBeforeDeleting = 60000;

const first = {
  login: 'azad.kichibayov.y@asoiu.edu.az',
  password: 'XVukEu51'  
}

const second = {
  login: 'emil.aliyev.n@asoiu.edu.az',
  password: ''
}

const third = {
  login: '',
  password: ''
}

const fourth = {
  login: '',
  password: ''  
}
// 
const consoleText = (text) => {
  console.log(`\n*-----------------------------------------------------------------*\n ${text}\n*-----------------------------------------------------------------*`);
}

const sleep = mSec => new Promise((res, rej) => setTimeout(() => res(), mSec))

const login = (browser, log, pass) => new Promise((resolve, reject) => {
  browser.visit(LOGIN_URL, () => {
    const url = browser.response.url;
    const status = browser.response.status;

    if ((status === 200) && (url === LOGIN_URL)) {
      browser.fill('input[name=studentLogin]', log);
      browser.fill('input[name=studentPassword]', pass);
      browser.pressButton('input[name=studentSubmit]');
      
      browser.wait()
        .then(() => {
          consoleText(`logined ${log}`);
          resolve()
        }, () => {
          consoleText(`logined ${log}`);      
          resolve()
        })
        } else {
          reject(status)
        }
  })
})
// 2000-6000
// 4994 - 7000
// 7300 - 9999
const init = async (browser, log, pass) => {
  await login(browser, log, pass);

  const selection = async () => {
    // const link = `https://asoiuexam.com/selectTicketAct/1136/809/13${'0'.repeat((4 - `${cycle}`.length)) + `${cycle}`}/1`;

  
    await browser.visit(`https://asoiuexam.com/ticketSelect/${subjectID}`, () => console.log('VISITING'))
    // await browser.wait();
    consoleText(`added ${log}`)
    // cycle += 1;

    await sleep(delayBeforeDeleting)

    await browser.visit(`https://asoiuexam.com/deleteTicket/${subjectID}`, () => console.log('DELETING'))
    // await browser.wait();
    consoleText(`removed ${log}`)

    await sleep(1000)

    return selection()
  }

  await selection()
}


const asyncStart = async () => {
  if (first.login && first.password) {
    // consoleText(first.login);
    init(browser, first.login, first.password);
    await sleep(delayBetweenAuth);
  };

  // if (second.login && first.password) {
  //   consoleText(second.login)
  //   init(browser2, second.login, second.password);
  //   await sleep(delayBetweenAuth);
  // }

  // if (third.login && first.password) {
  //   consoleText(third.login);

  //   init(browser3, third.login, third.password);
  //   await sleep(delayBetweenAuth);
  // }

  // if (fourth.login && first.password) {
  //   consoleText(third.login);

  //   init(browser4, third.login, third.password);
  // }
} 

asyncStart();




