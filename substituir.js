const axios = require('axios');
const fs = require('fs');
const rp = require('request-promise');
const request = require('request');
const puppeteer = require("puppeteer-extra");

const recaptchaSolve = async (url) => {
    try{
        const teste = () =>{
            return new Promise( (resolve, reject) => {
                request.get(url)
                    .on('error', function(err) {
                        reject(err)
                        // handle error
                    })
                    .pipe(fs.createWriteStream('teste114.mp3'))
                    .on('finish', function() {
                        console.log('fim');
                        resolve('ROLA')
                    });
            })
        }
            console.log('comeou')
            await teste();
            console.log("OI");
            function base64_encode(file){
                var bitmap = fs.readFileSync(file);
                return new Buffer(bitmap).toString('base64');
            }
    
    
            var options = {
              "uri": 'https://us-central1-agent-pjbank.cloudfunctions.net/api/speechtotext',
              "json": true,
              "body": {
                "lang": 'en-US',
                "audio": base64_encode('./teste114.mp3')
            },
            };
            
            const translated = await rp.post(options)
            console.log(translated)
            const audioTranscrito = translated.textDataUri[0].transcript
            console.log(audioTranscrito)
            return audioTranscrito
    }catch(e) {
        throw e
    }
}
const executeAudioTest = async (page, audioTranscrito) => {
    await page.evaluate( function(audioTranscrito) {
        console.log('audioTranscrito', audioTranscrito)

        document.querySelector('body > div:nth-child(4) > div:nth-child(4) > iframe').contentWindow.document.querySelector('#audio-response').value = audioTranscrito
    }, audioTranscrito)
    await page.waitFor(1500);

    await page.evaluate(() => {
        document.querySelector('body > div:nth-child(4) > div:nth-child(4) > iframe').contentWindow.document.querySelector('#recaptcha-verify-button').click()
    })
}
(async () => {
    puppeteer.use(require("puppeteer-extra-plugin-stealth")())
    const browser = await puppeteer.launch({headless: true, args: [
        '--disable-web-security', '--incognito',  '--no-sandbox'], slowMo: 10})
    try {
      const userAgent = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
        'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36',
        'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36'    
    ]

    const context = await browser.createIncognitoBrowserContext();

    const randomNum = Math.floor(Math.random() * 3);
    const page = await context.newPage();
    console.log(userAgent[randomNum])
    // await page.setUserAgent(userAgent[randomNum]);

    const navigationPromise = page.waitForNavigation({waitUntil: 'domcontentloaded', timeout: 5000})
    const pageUrl = 'https://patrickhlauke.github.io/recaptcha'
    await page.goto(pageUrl)
    await navigationPromise;

    await page.waitForSelector('[role="presentation"]')
    await page.waitFor(1000);
    await page.click('[role="presentation"]')
    await page.waitForSelector('body > div:nth-child(4) > div:nth-child(4) > iframe')
    console.log('eu escolhi esperar')
    await page.waitFor(2000);
    console.log('esperei')
    
    await page.evaluate(() => {
        document.querySelector('body > div:nth-child(4) > div:nth-child(4) > iframe').contentWindow.document.getElementById("recaptcha-audio-button").click()
    })
    await page.waitFor(3000);
    const url = await page.evaluate(() => {
        return document.querySelector('body > div:nth-child(4) > div:nth-child(4) > iframe').contentWindow.document.querySelector('.rc-audiochallenge-tdownload-link').href
    })
    console.log('URL AKIII', url)

    await page.evaluate(() => {
        document.querySelector('body > div:nth-child(4) > div:nth-child(4) > iframe').contentWindow.document.querySelector('.rc-button-default').click()
    })

    const audioTranscrito = await recaptchaSolve(url)
        await page.waitFor(500);
        await executeAudioTest(page, audioTranscrito)
        await page.waitFor(1500);

        const secondTest = await page.evaluate(() => {
            const display = document.querySelector('body > div:nth-child(4) > div:nth-child(4) > iframe').contentWindow.document.querySelector('.rc-audiochallenge-error-message').style.display
            if(display != 'none') {
                const url = document.querySelector('body > div:nth-child(4) > div:nth-child(4) > iframe').contentWindow.document.querySelector('.rc-audiochallenge-tdownload-link').href
                return url
            } else {
                return false
            }
        })
        console.log(secondTest)

        if(secondTest) { 
            const textAudio = await recaptchaSolve(secondTest);
            await executeAudioTest(page, textAudio)
            await page.waitFor(1500);
        }
        await page.screenshot({path: './captcha.png'})
        await browser.close();
    }catch(e) {
        console.log(e)
        browser.close()
    }
    // console.log(textContent)
})();