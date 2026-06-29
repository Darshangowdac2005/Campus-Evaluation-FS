// handles token management with the AffordMed API
// caches the token so we don't request a new one every time

let cachedToken = null;
let tokenExpiry = 0;

async function getAuthToken() {
    // return cached token if still valid
    if (cachedToken && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    try {
        const response = await fetch('http://20.244.56.144/test/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                companyName: 'Campus Notifications',
                clientID: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                ownerName: process.env.AFFORDMED_NAME,
                ownerEmail: process.env.AFFORDMED_EMAIL,
                rollNo: process.env.AFFORDMED_ROLL,
            }),
        });

        const data = await response.json();
        cachedToken = data.access_token;
        // expire 5 minutes early to be safe
        tokenExpiry = Date.now() + (data.expires_in * 1000) - (5 * 60 * 1000);

        return cachedToken;
    } catch (err) {
        console.error('Failed to get auth token:', err.message);
        throw new Error('Authentication failed');
    }
}

module.exports = { getAuthToken };
