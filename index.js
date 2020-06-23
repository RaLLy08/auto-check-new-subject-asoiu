const Browser = require('zombie');

const LOGIN_URL = 'http://exam.asoiu.edu.az/studentLogin';
const PROFILE_URL = 'http://exam.asoiu.edu.az/studentProfile'
const CHECK_TIME = 60000;
const CHOOSE_DELAY = 900000;
let urlValue = undefined;
//require('events').EventEmitter.defaultMaxListeners = Infinity;
const browser1 = new Browser();
const browser2 = new Browser();

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
 
const visit = (browser, url) => new Promise((resolve, reject) => {
  browser.visit(url, () => {
    browser.wait()
      .then(function() {
        //console.log(status, respUrl, url);
        if (browser.response && (browser.response.status === 200)) resolve(browser.response.body);
        else reject(html)
      }, () => {
        if ((browser.response.status === 200)) resolve(browser.response.body);
        else reject(html)
        consoleText('error in visit');
      })
  })
})

const autoCheckSubject = (browser) => {
  autoVisit(browser, PROFILE_URL)
    .then((html) => {
      const lastSubjectUrl = checkSubjects(html);
  
      if (lastSubjectUrl) {
        consoleText('changed');
        setTimeout(() => {
          chooseNewSubject(lastSubjectUrl);
        }, CHOOSE_DELAY);
      } else {
        consoleText('none');
        setTimeout(() => {
          autoCheckSubject(browser)
        }, CHECK_TIME);
      }
    })
} 

const checkSubjects = (htmlBody) => {
    console.log(new Date());

    const tableFrom = htmlBody.indexOf('<tbody>')
    const tableEnd = htmlBody.indexOf('</tbody>')
    const table = htmlBody.slice(tableFrom, tableEnd).replace(/ +/g, ' ').trim();
    const urlArr = table.match(/(?:https?:\/\/)?(?:[\w\.]+)\.(?:[a-z]{2,6}\.?)(?:\/[\w\.]*)*\/?/g);
    const lastSubjectUrl = urlArr[urlArr.length - 1];
  
    if ((urlArr.length === urlValue) || !urlValue) {
      urlValue = urlArr.length;
      console.log(urlArr);
      //return lastSubjectUrl
    } else {
      return lastSubjectUrl
    }
}

const chooseNewSubject = (lastSubjectUrl) => {
  loginFirst(lastSubjectUrl)
    .then(() => {
      autoVisit(browser2, lastSubjectUrl).then(() => consoleText('elnur.maharramov.e@asoiu.edu.az selected subject successfully'));
      autoVisit(browser1, lastSubjectUrl).then(() => consoleText('azad.kichibayov.y@asoiu.edu.az selected subject successfully'));
    })
}

const loginFirst = () => new Promise(resolve => {
  autoLogin(browser2, 'elnur.maharramov.e@asoiu.edu.az', 'FPDydxBI')
    .then(() => {
      resolve();
    });
})
 
//logines while error doesn't pressent
const autoLogin = (browser, log, pass, hasAutoCheck) => new Promise(resolve => {
  login(browser, log, pass)
    .then(() => {
      if (hasAutoCheck) autoCheckSubject(browser);
      resolve()
      consoleText(`${log} successfully logged in`);
    })
    .catch((status) => {
      consoleText(`error status', ${status}, 'rerunning...', ${log}`);
      setTimeout(() => {
        autoLogin(browser, log, pass, hasAutoCheck);
      }, 4000);
    })
})

const autoVisit = (browser, url) => new Promise(resolve => {
  visit(browser, url)
    .then((html) => resolve(html))
    .catch((html) => {
      consoleText(`error status, auto visit visit', 'rerunning...', ${url}`);
      setTimeout(() => {
        autoVisit(browser, url);
      }, 4000);
    })
})

autoLogin(browser1, 'azad.kichibayov.y@asoiu.edu.az', 'BdH5XEUf', true)  //first logines and starting monitoring of changes in subjects

const consoleText = (text) => {
  console.log(`\n*-----------------------------------------------------------------*\n ${text}\n*-----------------------------------------------------------------*`);
}