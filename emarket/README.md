# Project Description

<p>
  The project is a web application built with React for interaction with Google Sheets via forms and scripts. Google Sheets is used for data storage, while Google Apps Script handles processing and interaction. The primary goal of the project is standardization, simplification, and code reduction.
</p>

## Main Features

1. **Frontend in React:**
    - Built-in browser features for language detection, timezone determination, hash generation, key encryption, and decryption.
    - Using a configuration JSON file from the project's public directory to modify primary settings without rebuilding the project.
    - Uploading icons and images (logos and products) from the repository is a priority (support for cloud storage uploads is provided).

2. **Google Sheets and Scripts:**
    - Using Google Sheets for data storage and Google Apps Script for processing.
    - Interaction through forms for standardization, simplification of deployment, and maintenance.

## Deployment Instructions

1. **Preparation of Google Sheets and Scripts:**
    - Create or upload templates for Google Sheets.
    - Create or upload templates for Google Scripts.
    - Grant general access to Google Scripts (it is recommended to grant access only to the administrator and create a proxy script that references the main handler script).

2. **Frontend Configuration:**
    - Create or modify the configuration JSON file with paths to the proxy and executable scripts.
    - If necessary, add logo and product images to the repository and replace icons.

3. **Data Entry:**
    - Fill in the Google Sheet with the price list.

4. **Launch and Maintenance:**
    - Ensure the functionality of the Google account (the ability to add a counter with reset and/or redirection to the proxy or main script to track requests, prevent overflows of free/paid tariffs, and block potential DDoS attacks).

## Benefits

- **Standardization:** Using a unified approach to interact with data through Google Sheets and scripts.
- **Simplified Deployment:** Easy deployment and configuration through public directories and repositories.
- **Code Minimization:** Reducing the amount of code by using built-in browser features and external configuration files.

<p>
  The project aims to ensure flexibility and ease of use, as well as to facilitate the process of maintenance and updates.
</p>
## Example of Google Sheets Scripts


```javascript
// Urprice script
// Price sheet! Replace Url "Sheet*" with your actual sheet name
const sheets = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/***/edit#gid=0");

function doPost(e) {
  // Read data from Sheet1 and Sheet2
  const sheet1 = sheets.getSheetByName("Sheet1");
  const sheet2 = sheets.getSheetByName("Sheet2"); // Replace "Sheet2" with your actual sheet name

  const headers1 = sheet1.getRange(1, 1, 1, sheet1.getLastColumn()).getValues()[0];
  const data1 = sheet1.getRange(2, 1, sheet1.getLastRow() - 1, sheet1.getLastColumn()).getValues();
  const jsonData1 = data1.map((row) => {
    const obj = {};
    for (let i = 0; i < headers1.length; i++) {
      obj[headers1[i]] = row[i];
    }
    return obj;
  });

  const headers2 = sheet2.getRange(1, 1, 1, sheet2.getLastColumn()).getValues()[0];
  const data2 = sheet2.getRange(2, 1, sheet2.getLastRow() - 1, sheet2.getLastColumn()).getValues();
  const jsonData2 = data2.map((row) => {
    const obj = {};
    for (let i = 0; i < headers2.length; i++) {
      obj[headers2[i]] = row[i];
    }
    return obj;
  });

  // Combine data from both sheets (modify logic as needed)
  const combinedData = [...jsonData1, ...jsonData2]; // Simple concatenation for now  

  // Return JSON response
  return ContentService.createTextOutput(JSON.stringify(combinedData));
}
// Urregform script
// Verification sheet
const sheets = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/***/edit#gid=0");
const sheet = sheets.getSheetByName("Page1");

function doPost(e) {
  let data = e.parameter;
  let isVerification = parseInt(data.isVerification);

  if (isVerification === 1) {
    const existingUser = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues().flat().includes(addApostropheIfNotEmpty(data.Name));

    if (existingUser) {
      return ContentService.createTextOutput("This username already exists. Please choose another one.");
    }

    const currentDate = new Date();
    const formattedDate = Utilities.formatDate(currentDate, "GMT+3", "yyyy-MM-dd HH:mm:ss");
    const rowValues = [formattedDate, addApostropheIfNotEmpty(data.Name), addApostropheIfNotEmpty(data.Password)];
    sheet.appendRow(rowValues);
    return ContentService.createTextOutput("Thank you for successful registration!");
  } else if (isVerification === 2) {
    const userData = sheet.getRange(2, 2, sheet.getLastRow() - 1, 3).getValues();

    const userIndex = userData.findIndex(user => user[0] === data.Name && user[1] === data.Password);

    if (userIndex !== -1) {
      const message = (sheet.getRange(userIndex + 2, 4).getValue() ?? '') || '';
      const promo = (sheet.getRange(userIndex + 2, 5).getValue() ?? '') || '';
      const order = (sheet.getRange(userIndex + 2, 6).getValue() ?? '') || '';

      return ContentService.createTextOutput(`Successful login! Message: ${message}, Promo: ${promo}, Order: ${order}`);
    } else {
      return ContentService.createTextOutput("Incorrect username or password.");
    }
  } else if (isVerification === 3) {
    const userData = sheet.getRange(2, 2, sheet.getLastRow() - 1, 3).getValues();

    const userIndex = userData.findIndex(user => user[0] === data.Name && user[1] === data.Password);

    if (userIndex !== -1) {
      sheet.getRange(userIndex + 2, 6).setValue(addApostropheIfNotEmpty(data.Order));
      return ContentService.createTextOutput("Order updated successfully!");
    } else {
      return ContentService.createTextOutput("Incorrect username or password.");
    }
  } else {
    return ContentService.createTextOutput("Invalid isVerification value.");
  }
}

function addApostropheIfNotEmpty(value) {
  return value ? "'" + value : "";
}
// Urorder script
const sheets = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/***/edit#gid=0");
const sheet = sheets.getSheetByName("Page1");
const allowedUserIds = ["d123", "manager1", "manager2"]; // Add all valid userIds here

function doPost(e) {
  let data = e.parameter;

  if (!data.userid && data.Zakaz) {
    // Determine the order number as the previous number + 1
    let lastRow = sheet.getLastRow();
    let lastOrderNumber = lastRow > 1 ? sheet.getRange(lastRow, 1).getValue() : 0;
    let orderNumber = lastOrderNumber + 1;

    // Get the current date and time
    let currentDate = new Date();
    let currentDateTime = currentDate.toISOString(); // ISO format

    // Add the data to the spreadsheet, adding apostrophe to non-empty fields
    sheet.appendRow([
      orderNumber,
      addApostropheIfNotEmpty(data.Name),
      addApostropheIfNotEmpty(data.FirstName),
      addApostropheIfNotEmpty(data.MiddleName),
      addApostropheIfNotEmpty(data.LastName),
      addApostropheIfNotEmpty(data.Email),
      addApostropheIfNotEmpty(data.Phone),
      addApostropheIfNotEmpty(data.Address),
      addApostropheIfNotEmpty(data.Message),
      addApostropheIfNotEmpty(data.FirstName1),
      addApostropheIfNotEmpty(data.MiddleName1),
      addApostropheIfNotEmpty(data.LastName1),
      addApostropheIfNotEmpty(data.Email1),
      addApostropheIfNotEmpty(data.Phone1),
      addApostropheIfNotEmpty(data.Address1),
      addApostropheIfNotEmpty(data.Message1),
      addApostropheIfNotEmpty(data.FirstName2),
      addApostropheIfNotEmpty(data.MiddleName2),
      addApostropheIfNotEmpty(data.LastName2),
      addApostropheIfNotEmpty(data.Email2),
      addApostropheIfNotEmpty(data.Phone2),
      addApostropheIfNotEmpty(data.Address2),
      addApostropheIfNotEmpty(data.Message2),
      addApostropheIfNotEmpty(data.Zakaz),
      addApostropheIfNotEmpty(data.Idprice),
      currentDateTime
    ]);

    // Create a response message
    let response = "Your message was successfully sent. Order Number: " + orderNumber;
    return ContentService.createTextOutput(response);
  }

  if (data.userid) {
    if (allowedUserIds.includes(data.userid)) {
      const headers1 = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const data1 = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
      const jsonData1 = data1.map((row) => {
        const obj = {};
        for (let i = 0; i < headers1.length; i++) {
          obj[headers1[i]] = row[i];
        }
        return obj;
      });

      // Filter by idprice if provided
      let filteredData = jsonData1;
      if (data.idpric && data.idpric !== "") {
        filteredData = filteredData.filter((item) => String(item.Idprice) === String(data.idpric));
      }

      // Filter by date range if provided
      if (data.startdate && data.enddate) {
        try {
          const startDate = new Date(data.startdate);
          const endDate = new Date(data.enddate);
          filteredData = filteredData.filter((item) => {
            const itemDate = new Date(item.currentDateTime);
            return itemDate >= startDate && itemDate <= endDate;
          });
        } catch (error) {
          return ContentService.createTextOutput(JSON.stringify("Incorrect username or password."));
        }
      }

      // Return JSON response
      return ContentService.createTextOutput(JSON.stringify(filteredData));
    } else {
      return ContentService.createTextOutput(JSON.stringify("Incorrect username or password."));
    }
  }
}

// Function to add apostrophe if the string is not empty
function addApostropheIfNotEmpty(value) {
  return value ? "'" + value : "";
}
// Simplest example script
// Intermediate script (escaping script) to protect against exceeding the request limit

const MAX_REQUESTS_PER_MINUTE = 60; // Maximum number of requests per minute
const SCRIPT_URL = "https://script.google.com/macros/s/your_script_id/exec"; // URL of your working table script

let requestCount = 0;

function handleRequest(e) {

  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    // Action if the limit is exceeded
    return ContentService.createTextOutput(JSON.stringify({ error: "Request blocked. Limit exceeded." }));
  }


  requestCount++;

  // We pass the request to the working script of the table
  let params = {
    method: "POST",
    payload: e.postData.contents,
    muteHttpExceptions: true
  };

  let response;
  try {
    response = UrlFetchApp.fetch(SCRIPT_URL, params);
  } catch (error) {
    requestCount--;
    return ContentService.createTextOutput(JSON.stringify({ error: "Error contacting the backend script." }));
  }


  requestCount--;

  // Checking the content type of the response (text or JSON)
  let contentType = response.getHeaders()["Content-Type"];
  if (contentType && contentType.indexOf("application/json") !== -1) {

    return ContentService.createTextOutput(response.getContentText()).setMimeType(ContentService.MimeType.JSON);
  } else {

    return ContentService.createTextOutput(response.getContentText());
  }
}
