const Browser = require('zombie');
const fs = require('fs');

const LOGIN_URL = 'https://asoiuexam.com/studentLogin';

const autoSelectionConfigs = [
  {
    mail: 'azad.kichibayov.y@asoiu.edu.az',
    password: 'XVukEu51',
    subjectID: '460',
    constFirstNumber: '1136',
    startDelay: 0,
    from: 53340,
    to: 55000
  },
  {
    mail: 'azad.kichibayov.y@asoiu.edu.az',
    password: 'XVukEu51',
    subjectID: '460',
    constFirstNumber: '1136',
    startDelay: 400,
    from: 58370,
    to: 60000
  },
];
//////////////////////////////////////


const sleep = mSec => new Promise((res, rej) => setTimeout(() => res(), mSec))

const promisedVisit = (url, browser) => 
  new Promise((y, n) => {
    browser.visit(url, (data) => y(data))
  });

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
          console.log('succsessful logined');
          resolve()
        }, () => {      
          resolve()
        })
        } else {
          reject(status)
        }
  })
})

const init = async (browser, config) => {
  const { mail, password, subjectID, constFirstNumber, from, to } = config;

  await login(browser, mail, password);
  let cycle = from;

  const selection = async () => {
    // const link = `https://asoiuexam.com/selectTicketAct/${constFirstNumber}/${subjectID}/${twoUnknownNumbers}${'0'.repeat((4 - `${cycle}`.length)) + `${cycle}`}/1`;
    const link = `https://asoiuexam.com/selectTicketAct/${constFirstNumber}/${subjectID}/${cycle}/1`;

    await promisedVisit(link, browser)


    await browser.wait();
    console.log(cycle, link, 'VISITING STATUS:', browser.status, from, '-', to);

    cycle += 1;


    if (cycle % 500 === 0) {
      console.log('checkpoint');
      var isPageOpened = await new Promise((y, n) => browser.visit(`https://asoiuexam.com/showTicket/${subjectID}`, () => y(!browser.redirected)))

      await browser.wait();
    }

    if (cycle >= to || isPageOpened) {
      if (isPageOpened) {
        fs.writeFile('./logs.txt', cycle, (err) => { if (err) throw err} );
      }

      consoleText(cycle);
      return;
    } else {
      selection()
    }
  }

  await selection()
}

const asyncStart = async () => {
  autoSelectionConfigs.forEach(async config => {
    init(new Browser(), config);

    await sleep(config.startDelay);
  });
}


const consoleText = (text) => {
  console.log(`\n*-----------------------------------------------------------------*\n ${text}\n*-----------------------------------------------------------------*`);
}


asyncStart();