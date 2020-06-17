const Browser = require('zombie');
const nodemailer = require('nodemailer');

const LOGIN_URL = 'http://exam.asoiu.edu.az/studentLogin';
const PROFILE_URL = 'http://exam.asoiu.edu.az/studentProfile'
const CHECK_TIME = 100000;
const CHOOSE_DELAY = 1000;
let urlValue = undefined;

//require('events').EventEmitter.defaultMaxListeners = Infinity;
const browser1 = new Browser();
const browser2 = new Browser();

const sendMail = () => {
  let transport = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 2525,
    auth: {
       user: 'auto.mailing@mail.ru',
       pass: 'nodeMAILER'
    }
  });
  
  const message = {
    from: 'auto.mailing@mail.ru', // Sender address
    to: 'azad.kichibekov@gmail.com',         // List of recipients
    subject: 'ASOIU EXAM', // Subject line
    text: 'a new subject has been added!' // Plain text body
  };
  transport.sendMail(message, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
  });
}

const login = (browser, log, pass) => new Promise((resolve, reject) => {
  browser.visit(LOGIN_URL, () => {
    const url = browser.response.url;
    const status = browser.response.status;

    if ((status === 200) && (url === LOGIN_URL)) {
      browser.fill('input[name=studentLogin]', log);
      browser.fill('input[name=studentPassword]', pass);
      browser.pressButton('input[name=studentSubmit]');
      
      browser.wait().then(() => {
        resolve()
      }, () => {      
        resolve()
      })
    } else {
      reject(status)
    }
  })
})
 
const autoVisit = (browser) => {
  //check in one profile subjects
  browser.visit(PROFILE_URL, () => {
    browser.wait().then(function() {
      const html = browser.response.body;
      const url = browser.response.url;
      const status = browser.response.status;
      
      if ((status === 200) && (url === PROFILE_URL)) checkSubjects(html)
    }, () => {
      if ((status === 200) && (url === PROFILE_URL)) {
        const lastSubjectUrl = checkSubjects(html);
        
        
        if (lastSubjectUrl) {    
          //console.log('TTTTTTTTTTTT\nTTTTTTTTTTTTTTT\nTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT\nTTTTTTTTTTTTT');         
          setTimeout(() => {
            
            
            chooseNewSubject(lastSubjectUrl);
          }, CHOOSE_DELAY);
          
          sendMail()
          console.log('------------------------------------------------------------------------------------changed');
          
        } else {
          console.log('------------------------------------------------------------------------------------none');
        }
        
      };
      console.log('------------------------------------------------------------------------------------error in autovisit');
    })
  })

  setTimeout(() => {
    autoVisit(browser)
  }, CHECK_TIME);
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
      return lastSubjectUrl
    } else {
      return lastSubjectUrl
    }
}

const chooseNewSubject = (lastSubjectUrl) => {
  choose(browser1, lastSubjectUrl);
  autoLogin(browser2, 'elnur.maharramov.e@asoiu.edu.az', 'FPDydxBI', true).then(() => choose(browser2, lastSubjectUrl))
  //choose(browser2, lastSubjectUrl);
}

const choose = (browser, lastSubjectUrl) => {
  browser.visit(lastSubjectUrl, () => {
    browser.wait().then(() => {
      console.log(browser.response);
      
      // if ((browser.response.status !== 200) || (url !== PROFILE_URL)) {
      //   console.log('------------------------------------------------------------------------------------error in chosing in one of acc');

      //   setTimeout(() => {
      //     choose(browser, lastSubjectUrl)
      //   }, 8000);
      // }
    }, () => {
      // if ((browser.response.status !== 200) || (url !== PROFILE_URL)) {
      //   console.log('------------------------------------------------------------------------------------error in chosing in one of acc');

      //   setTimeout(() => {
      //     choose(browser, lastSubjectUrl)
      //   }, 8000);
      // }
    })
  })
}

//logines while error doesn't pressent
autoLogin = (browser, log, pass, hasAutoVisit) => new Promise(resolve => {
  login(browser, log, pass)
    .then(() => {
      if (hasAutoVisit) autoVisit(browser);
      
      resolve()
      console.log(log, '\n ------------------------------------------------------------------------------------successfully logged in');
    })
    .catch((status) => {
      console.log('\n ------------------------------------------------------------------------------------error status', status, 'rerunning...', log);
      setTimeout(() => {
        autoLogin(browser, log, pass, hasAutoVisit);
      }, 8000);
    })
})


autoLogin(browser1, 'azad.kichibayov.y@asoiu.edu.az', 'BdH5XEUf', true)  //first logines and starting monitoring of changes in subjects