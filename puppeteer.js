const puppeteer = require("puppeteer");
class TweetWiper {
  async run() {
    this.browser = await puppeteer.launch({ headless: false });
    this.page = await this.browser.newPage();
    this.count = 0;
    const { page } = this;
    const navigationPromise = page.waitForNavigation();

    await page.goto("https://twitter.com/r_18/media"); //Replace with your media url

    await page.setViewport({ width: 1536, height: 731 });
    
    //Login   
    await page.waitForSelector(
      "#signin-dropdown > .signin-dialog-body > .LoginForm > .LoginForm-username > .text-input"
    );

    await page.waitForSelector(
      ".pull-right > #session > .dropdown > #signin-link > .emphasize"
    );

    await page.waitFor(1000);
    await page.type(
      "#signin-dropdown > .signin-dialog-body > .LoginForm > .LoginForm-username > .text-input",
      "YOUR TWITTER ACCOUNT"
    );
    await page.type(
      "#signin-dropdown > .signin-dialog-body > .LoginForm > .LoginForm-password > .text-input",
      "YOUR PASSWORD"
    );

    await page.waitForSelector(
      ".dropdown > #signin-dropdown > .signin-dialog-body > .LoginForm > .EdgeButton"
    );
    await page.click(
      ".dropdown > #signin-dropdown > .signin-dialog-body > .LoginForm > .EdgeButton"
    );

    await navigationPromise;

    console.log("Wiping started....");
    
    for (let i = 0; i <= 100; i++) { //FIXME: Every 115 attempts the function stops working
      await page.waitFor(1000);
      console.log(`Started: ${i}`)
      if (i % 19 === 1) await page.reload(); // Page needs to be reloaded every 20 deletions, otherwise the page will no more display tweets.
      try {
        await this.wiper();
      } catch (e) {
        console.error(`${e}`)
        await page.reload();
        console.log("Page reloaded")
        await page.waitFor(2000);
      }
    }

    await this.browser.close();
    console.log("Wipe completed!");
  }

  async wiper() {
    const { page } = this;
    await page.waitForSelector(".stream > ol.stream-items");
    await page.waitForSelector(
      ".stream ol.stream-items li.js-stream-item .content .dropdown .dropdown-toggle"
    );
    await page.click(
      ".stream ol.stream-items li.js-stream-item .content .dropdown .dropdown-toggle"
    );

    await page.waitForSelector(
      ".stream > ol.stream-items > li.js-stream-item .content .dropdown li.js-actionDelete > .dropdown-link"
    );
    await page.click(
      ".stream > ol.stream-items > li.js-stream-item .content .dropdown li.js-actionDelete > .dropdown-link"
    );

    await page.waitForSelector(
      "#delete-tweet-dialog > #delete-tweet-dialog-dialog > .modal-content > .modal-footer > .EdgeButton--danger"
    );
    await page.click(
      "#delete-tweet-dialog > #delete-tweet-dialog-dialog > .modal-content > .modal-footer > .EdgeButton--danger"
    );
    console.log(`Succeeded: ${this.count++}`);
  }
}

new TweetWiper().run();
