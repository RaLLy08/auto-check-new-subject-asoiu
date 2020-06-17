const Browser = require('zombie');
const nodemailer = require('nodemailer');

const url = 'http://asoiuexam.com/studentLogin';
let lengthOfTable = undefined;
//require('events').EventEmitter.defaultMaxListeners = Infinity;
const browser = new Browser();

setInterval(() => {
  visit()
}, 60000);

const sendMessage = () => {
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

const visit = () => {
  browser.visit(url, () => {
    browser.fill('input[name=studentLogin]', 'azad.kichibayov.y@asoiu.edu.az');
    browser.fill('input[name=studentPassword]', 'BdH5XEUf');
    browser.pressButton('input[name=studentSubmit]');
  
    browser.wait().then(function() {
      checkSubjects();
    }, () => checkSubjects())
   
    const checkSubjects = () => {
      console.log(new Date());
      
      const str = browser.response.body;
      //let table = str.match(/(?<=<tbody>)(.*\n?)(?=<\/tbody>)/);
      const tableFrom = str.indexOf('<tbody>')
      const tableEnd = str.indexOf('</tbody>')
      const table = str.slice(tableFrom, tableEnd).replace(/ +/g, ' ').trim();
      //table.replace(/(?<=<tbody>)(.*\n?)(?=<!-- -->)/,'')
      console.log(table.length);
      if ((table.length === lengthOfTable) || !lengthOfTable) {
        console.log('none');
        lengthOfTable = table.length;
      } else {
        console.log('changed'); 
        const urlArr = table.match(/(?:https?:\/\/)?(?:[\w\.]+)\.(?:[a-z]{2,6}\.?)(?:\/[\w\.]*)*\/?/g);
        const lastSubjectUrl = urlArr[urlArr.length - 1];

        setTimeout(() => {
          browser.visit(lastSubjectUrl, () => {
            browser.wait().then(function() {
              console.log(browser.response);
            }, () => console.log(browser.response))
        })
        }, 180000);
      
        sendMessage()
      }
    }
  })
}

visit()