import XD from '../index.js';

// Async function to run the test
async function runTest() {
    const url = 'https://x.com/Eveveb_414/status/20175647303833277?s=20'; // Example X post URL
    const config = {
        cookie: "", //set your cookie or leave it empty
        authorization: "", //set your authorization or leave it empty
        userAgent: "", //set your user agent or leave it empty
    };
    const proxy = null; // No proxy for this test
    const result = await XD(url, config, proxy);
    if (result.status === "error") {
        console.error("Error:", result);
        return;
    }
    console.log(result);
}

// Run the test
runTest();