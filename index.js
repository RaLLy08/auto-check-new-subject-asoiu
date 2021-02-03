const Browser = require('zombie');

const LOGIN_URL = 'https://asoiuexam.com/studentLogin';
const mail = 'azad.kichibayov.y@asoiu.edu.az'
const password = 'yvntEsDZ';

const browser = new Browser();

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
const init = async (browser, log, pass) => {
  await login(browser, log, pass);
  let cycle = 7000;

  const selection = async () => {
    await browser.visit(`http://asoiuexam.com/selectTicketAct/1136/809/13${cycle}/1`, () => console.log(cycle, 'VISITING'))
    await browser.wait();

    cycle += 1;
    // await sleep(500)

    if (cycle % 500 === 0) {
      console.log('checkpoint')
      var isPageOpened = await new Promise((y, n) => browser.visit(`https://asoiuexam.com/showTicket/809`, () => y(!browser.redirected)))

      await browser.wait();
    }
    // const isPageOpened = await new Promise((y, n) => browser.visit(`https://asoiuexam.com/showTicket/809`, () => y(!browser.redirected)))
    // await browser.wait();
    
    if (cycle >= 9999 || isPageOpened) {
      consoleText(cycle);
      return;
    } else {
      selection()
    }
  }

  await selection()
}


init(browser, mail, password);




const consoleText = (text) => {
  console.log(`\n*-----------------------------------------------------------------*\n ${text}\n*-----------------------------------------------------------------*`);
}
