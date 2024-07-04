
const pino = require('pino');
const {
  default: makeWASocket,
  useMultiFileAuthState
} = require('@whiskeysockets/baileys');

var socket;










async function connectWhatsApp() {
    
    const auth = await useMultiFileAuthState('session');
    socket = makeWASocket({
        printQRInTerminal: true,
        browser: ["thiloina", 'safari', "1.0.0"],
        auth: auth.state,
        logger: pino({ level: 'silent' })
    });
    socket.ev.on('creds.update', auth.saveCreds);
    socket.ev.on('connection.update', async ({ connection }) => {
        if (connection === 'open') {

            
            

            
           
        
            
            await socket.sendMessage('94740945396@s.whatsapp.net', { text: "\n\nBot is connected👋\n\n" });
            await socket.sendPresenceUpdate("unavailable");
            console.log('bot start');
        } else if (connection === 'close') {
            await connectWhatsApp();
        }
    });

    async function sendsms(text) {
        try {
            const fetch = await import('node-fetch');

            // URL encode the text parameter
            const urlEncodedText = encodeURIComponent(text);

            // Construct the URL with parameters
            console.log(text)
            const url = `https://app.notify.lk/api/v1/send?user_id=27371&api_key=Te5xPOZS8x1UqrC8SdS0&sender_id=NotifyDEMO&to=94719036042&message=${urlEncodedText}`;

            // Perform the fetch request
            let response = await fetch.default(url);

            // Check if the response is okay
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Parse the JSON response
            let data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }
    var data = {sms:true};
    socket.ev.on('messages.upsert', async ({ messages, type }) => {
        try {
               
            if(messages[0].key.fromMe){
                data.time =  messages[0].messageTimestamp;
                if(messages[0].message.conversation == '.on'){
                    data.sms = true;
                }
                if(messages[0].message.conversation == '.off'){
                    data.sms = false;
                }
            }
            else{
                
                //94789496778@s.whatsapp.net
                if(messages[0].key.remoteJid == '94789496778@s.whatsapp.net' && data.sms){
                    if(data.time){
                        console.log(Math.floor(parseInt(data.time) + 60),messages[0].messageTimestamp)
                                  
                        if(Math.floor(parseInt(data.time) + 60) < messages[0].messageTimestamp){
                            console.log('done')
                            sendsms(messages[0].message.conversation)
                        }else{
                            console.log('no')
                        }
                    }else{
                        console.log('done')
                        sendsms(messages[0].message.conversation)
                    }
                    //data.time
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    });
    //get file. button sender
    
    //button sender
    

    
    
}

connectWhatsApp();











