const Browser = require('zombie');

const LOGIN_URL = 'https://asoiuexam.com/studentLogin';

const browser = new Browser();
const browser2 = new Browser();
const browser3 = new Browser();
const browser4 = new Browser();
const browser5 = new Browser();

//
const subjectID = '1534';
const delayBetweenAuth = 10000;

const delayBeforeDeleting = 60000;

const first = {
  login: 'emil.aliyev.n@asoiu.edu.az',
  password: 'KYyo3d2q'  
}

const second = {
  login: 'elnur.maharramov.e@asoiu.edu.az',
  password: 'xzgaRrRd'
}

const third = {
  login: 'azad.kichibayov.y@asoiu.edu.az',
  password: 'XVukEu51'  
}

const fourth = {
  login: 'denis.sazonov.d@asoiu.edu.az',
  password: 'AS7yIMtU'  
}

const fifth = {
  login: 'darya.ahmadova.q@asoiu.edu.az',
  password: '7swDADAO'
}

/////////////////// 
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

const init = async (browser, log, pass) => {
  await login(browser, log, pass);

  const selection = async () => {
    await browser.visit(`https://asoiuexam.com/ticketSelect/${subjectID}`, () => console.log(`----- successful ADD request for: ${log}`));
    consoleText(`subject added for: ${log}`)

    await sleep(delayBeforeDeleting)

    await browser.visit(`https://asoiuexam.com/deleteTicket/${subjectID}`, () => console.log(`----- successful DELETE request for: ${log}`));
    consoleText(`subject removed for: ${log}`)

    await sleep(500)

    return selection()
  }

  await selection()
}


const asyncStart = async () => {
  if (first.login && first.password) {
    consoleText(first.login);
    init(browser, first.login, first.password);

    await sleep(delayBetweenAuth);
  };

  if (second.login && first.password) {
    consoleText(second.login)
    init(browser2, second.login, second.password);

    await sleep(delayBetweenAuth);
  }

  if (third.login && first.password) {
    consoleText(third.login);

    init(browser3, third.login, third.password);

    await sleep(delayBetweenAuth);
  }

  if (fourth.login && first.password) {
    consoleText(third.login);

    init(browser4, third.login, third.password);

    await sleep(delayBetweenAuth);
  }

  if (fifth.login && fifth.password) {
    consoleText(fifth.login);
    init(browser5, fifth.login, fifth.password);
  }
} 

asyncStart();




