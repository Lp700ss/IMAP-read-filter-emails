const Imap = require('imap');
const {simpleParser} = require('mailparser');


const imapConfig = {
  user: 'siddhantsaikia@gmail.com',
  password: 'ufugopwienxhwouj',
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: {
    rejectUnauthorized: false }
};

const getEmails = () => {
    try {
      const imap = new Imap(imapConfig);
      imap.once('ready', () => {
        imap.openBox('INBOX', false, () => {
          imap.search(['ALL', ['FROM', 'amazon.in']], (err, results) => {
                                //['FROM', 'flipkart.com']
            const f = imap.fetch(results, {bodies: ''});
            f.on('message', msg => {
              msg.on('body', stream => {
                simpleParser(stream, async (err, parsed) => {
                  const {from, subject, textAsHtml, text} = parsed;
                  console.log(parsed);
                 //API to post Emails into mysql Database.
                });
              });
              let all_emails = [];
                f.on("message", function(msg, seqno) {
                    let move_email_to_ECOM = 0;
                    function move_email(uid){
                        imap.move(uid, "Ecom-Receipt", function(err) {
                            if( !err ){
                                console.log(uid+": move success");
                            } else if( err && move_email_fn_calls < 3 ){
                                move_email_fn_calls++;
                                move_email(uid);
                                console.log(uid+": " + err);
                            } else if( err && move_email_fn_calls >= 3){
                                console.log(uid+": Unable to move");
                            }
                            console.log(move_email_to_ECOM);
                        });
                    } 
                    move_email(seqno);
                });
                f.once("error", function(err) {
                    console.log(err);
                });
                f.once("end", function() {
                    imap.end();
                });
              msg.once('attributes', attrs => {
                const {uid} = attrs;
                imap.addFlags(uid, ['\\Seen'], () => {
                  // Mark the email as read after reading it
                  console.log('Marked as read!');
                });
              });
            });
            f.once('error', ex => {
              return Promise.reject(ex);
            });
            f.once('end', () => {
              console.log('Done fetching all messages!');
              imap.end();
            });
          });
        });
      });
  
      imap.once('error', err => {
        console.log(err);
      });
  
      imap.once('end', () => {
        console.log('Connection ended');
      });
  
      imap.connect();
    } catch (ex) {
      console.log('an error occurred');
    }
  };
  
  getEmails();