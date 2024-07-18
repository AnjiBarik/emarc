# eMarc

Welcome to the eMarc project! Explore our [live demo](https://anjibarik.github.io/emarc/) to see the application in action.

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

## Example
For an example of Google Sheets scripts and tables for deployment, see the samples folder of the project repository

## Program Description: Language Selection and Admin Panel
When a user performs a triple click on the globe during language selection, an Admin Panel appears. This Admin Panel serves two main functions:

Key Generation:
The Admin Panel allows users to generate keys.
Two public keys (Key1 and Key2) are required for encryption using the RCA (Randomized Cipher Algorithm).
Users can insert these public keys into the corresponding cells of the price table.
These keys play a crucial role in securing sensitive data during communication or data storage.
Order Decryption and Filtering:
The Admin Panel provides tools for order management.
Users can decrypt and filter orders based on specific criteria.
Decryption ensures that authorized personnel can access order details securely.
Filtering options allow users to narrow down orders based on relevant parameters.
By combining language selection with administrative functionality, this program enhances security and streamlines order processing.

## Configuration file example explanationExample 
"tuning": [
    {
        "id": 1, // unique sequential record number
        "author": "David Flanagan", // organization name of the price author
        "type": "start", // type start initial record display can be multiple but with different language values
        "lang": "en", // price language in the standard returned by the browser
        "loadprice": "true", // when true - ability to load additional price from current (Urprice link in the current price), false - do not load if additional price exists
        "fone": "(044)235-78-96", // contact phone link in the header if available
        "card": "09990000023232", // link to contact bank account in the header if available
        "inst": "hfgfhfh", // Instagram link in the header if available
        "location": "Your address", // address link in maps in the header if available
        "email": "example@gmail.com", // contact email link in the header if available
        "logo": "https://***.jpg", // company logo image if available, displays title if absent
        "title": "***", // name of the author's company
        "UrFrame": "https://***", // link to the author's company website (must allow opening in a frame)
        "Urprice": "https://script.google.com/macros/***", // link to the price script or screening
        "Urregform": "https://script.google.com/macros/***", // link to the registration script or screening
        "Urorder": "https://script.google.com/macros/s/***", // link to the order script or screening
        "order": "rsa", // if present, encrypts customer contact data
        "shopping": "To shopping", // alternative button title to enter shopping for the current price if available
        "logopablic": "lang.png", // author's company logo from a public folder (preferred over logo if available)
        "langstart": "auto", // if present, automatically selects language based on browser default
        "orderform": "FirstName,MiddleName,LastName,Email,Phone,Address,Message" // if present, list of displayed customer contact fields; all except Message are mandatory, all are displayed if absent
    }
]

