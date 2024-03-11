const puppeteer = require("puppeteer");
const Api_access = require("./Api_access");

// Function to authenticate and scrape data
async function authenticateAndScrapeData() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    // Navigate to the login page
    await page.goto("https://authn.matterport.com/login");

    // Wait for the email input field to be available
    await page.waitForSelector("#email");

    // Fill in the login form
    await page.type("#email", process.env.LOGIN_EMAIL);
    await page.type("#password", process.env.LOGIN_PASSWORD);

    // Click the submit button
    await page.click('button[type="submit"]');

    // Wait for navigation after login
    await page.waitForNavigation({
      waitUntil: "networkidle0",
    });
    // Now you are logged in, you can scrape the data
    const userData = await scrapeUserData(page);
    return userData;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
}
// Function to scrape user data
async function scrapeUserData(page) {
  try {
    const models = await Api_access.getModels();
    let info = [];
    for (let i = 0; i < models.length; i++) {
      const id = models[i].id;
      const name = models[i].name;
      const created = models[i].created;
      const expired = addThreeMonths(models[i].created);
      await page.goto(
        `https://my.matterport.com/models/${id}?section=details`,
        {
          waitUntil: "domcontentloaded",
        }
      );
      await page.waitForSelector("#input_5");
      // Extract necessary data
      const emailValue = await page.evaluate(() => {
        // Use appropriate selectors or logic to access the desired data
        const email = document.querySelector("#input_5");
        return email.value;
      });
      info.push({ id, name, emailValue, created, expired });
    }

    return info;
    //
  } catch (error) {
    throw new Error("Error scraping user data:", error);
  }
}
function addThreeMonths(dateString) {
  // Create a Date object from the given string
  const currentDate = new Date(dateString);

  // Add 3 months to the current date
  currentDate.setUTCMonth(currentDate.getUTCMonth() + 3);

  // Convert the updated date back to string format
  const updatedDateString = currentDate.toISOString();

  return updatedDateString;
}

module.exports = { authenticateAndScrapeData };
