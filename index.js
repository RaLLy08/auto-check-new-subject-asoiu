const Browser = require('zombie');

const LOGIN_URL = 'https://asoiuexam.com/studentLogin';
const mail = 'azad.kichibayov.y@asoiu.edu.az'
const password = 'yvntEsDZ';

const browser = new Browser();
const browser2 = new Browser();

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
          resolve()
        }, () => {      
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
const init = async (browser, log, pass, from, to) => {
  await login(browser, log, pass);
  let cycle = from;

  const selection = async () => {
    const link = `https://asoiuexam.com/selectTicketAct/1136/809/13${'0'.repeat((4 - `${cycle}`.length)) + `${cycle}`}/1`;

    await browser.visit(link, () => console.log(cycle,link, 'VISITING', from, '-', to))
    await browser.wait();

    cycle += 1;


    if (cycle % 500 === 0) {
      console.log('checkpoint')
      var isPageOpened = await new Promise((y, n) => browser.visit(`https://asoiuexam.com/showTicket/809`, () => y(!browser.redirected)))

      await browser.wait();
    }

    if (cycle >= to || isPageOpened) {
      consoleText(cycle);
      return;
    } else {
      selection()
    }
  }

  await selection()
}


init(browser, mail, password, 0, 1001);
init(browser2, mail, password, 1000, 2200);




const consoleText = (text) => {
  console.log(`\n*-----------------------------------------------------------------*\n ${text}\n*-----------------------------------------------------------------*`);
}
