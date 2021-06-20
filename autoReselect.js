const Browser = require('zombie');

const LOGIN_URL = 'https://asoiuexam.com/studentLogin';

const autoReSelectionConfigs = [
  {
    mail: 'azad.kichibayov.y@asoiu.edu.az',
    password: 'XVukEu51',
    subjectID: '167',
    startDelay: 0,
  },
  {
    mail: 'denis.sazonov.d@asoiu.edu.az',
    password: 'AS7yIMtU',
    subjectID: '167',
    startDelay: 10000,
  },
  {
    mail: 'darya.ahmadova.q@asoiu.edu.az',
    password: '7swDADAO',
    subjectID: '167',
    startDelay: 20000,
  },
];
//

const delayBeforeDeleting = 60000;


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

const promisedVisit = (url, browser) => 
  new Promise((y, n) => {
    browser.visit(url, (data) => y(data))
  });


const initReselectLoop = async (browser, config) => {

  const selection = async () => {
    await promisedVisit(`https://asoiuexam.com/ticketSelect/${config.subjectID}`, browser);
    await promisedVisit(`https://asoiuexam.com/ticketSelect/${config.subjectID}`, browser);
    await sleep(200);
    await promisedVisit(`https://asoiuexam.com/ticketSelect/${config.subjectID}`, browser);

    consoleText(`subject added for: ${config.mail}`);

    await sleep(delayBeforeDeleting);

    await browser.visit(`https://asoiuexam.com/deleteTicket/${config.subjectID}`, () => console.log(`----- successful DELETE request for: ${config.mail}`));
    consoleText(`subject removed for: ${config.mail}`)

    await sleep(200);

    return selection();
  }

  await selection();
}

const asyncStart = async () => {
  autoReSelectionConfigs.forEach(async config => {
    const browser = new Browser();
    await sleep(config.startDelay);

    await login(browser, config.mail, config.password);

    initReselectLoop(browser, config);
    
    consoleText(config.mail);
  });
}

asyncStart();


// const asyncStart = async () => {
//   if (first.login && first.password) {
//     consoleText(first.login);
//     init(browser, first.login, first.password);

//     await sleep(delayBetweenAuth);
//   };

//   if (second.login && second.password) {
//     consoleText(second.login)
//     init(browser2, second.login, second.password);

//     await sleep(delayBetweenAuth);
//   }

//   if (third.login && third.password) {
//     consoleText(third.login);

//     init(browser3, third.login, third.password);

//     await sleep(delayBetweenAuth);
//   }

//   if (fourth.login && fourth.password) {
//     consoleText(fourth.login);

//     init(browser4, fourth.login, fourth.password);

//     await sleep(delayBetweenAuth);
//   }

//   if (fifth.login && fifth.password) {
//     consoleText(fifth.login);
//     init(browser5, fifth.login, fifth.password);
//   }
// } 


