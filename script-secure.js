var CLIENT_ID = '696322707649-3gnikiu5r2hbbjq9dgimrjrjub8b5a40.apps.googleusercontent.com'; // Your client ID
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }, function(error) {
        console.log(JSON.stringify(error, null, 2));
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        document.getElementById('auth-button').style.display = 'none';
        document.getElementById('lookup-form').style.display = 'block';
    } else {
        document.getElementById('auth-button').style.display = 'block';
        document.getElementById('lookup-form').style.display = 'none';
    }
}

function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

function fetchData(certificateId) {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1TduMRKwJxD3VAOfLDh2zz4rKhRVWCJPouOt7DeW-l0c', // Your Google Sheet ID
        range: 'Sheet1!A1:C', // Adjust the range as needed
    }).then(function(response) {
        var range = response.result;
        console.log(range);
        const result = document.getElementById('result');
        result.innerHTML = ''; // Clear previous results
        if (range.values.length > 0) {
            const rows = range.values.slice(1); // Skip header row
            let found = false;
            rows.forEach(row => {
                const [id, name, link] = row;
                if (id.trim() === certificateId.trim()) {
                    result.innerHTML = `
                        <h2>Recommendation Details</h2>
                        <p><strong>ID:</strong> ${id}</p>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Recommendation Link:</strong> <a href="${link.trim()}" target="_blank">View Recommendation</a></p>
                    `;
                    found = true;
                }
            });
            if (!found) {
                result.innerHTML = '<p>Recommendation not found. Please check the ID and try again.</p>';
            }
        } else {
            result.innerHTML = '<p>No data found.</p>';
        }
    }, function(response) {
        console.log('Error: ' + response.result.error.message);
        document.getElementById('result').innerHTML = '<p>There was an error fetching the recommendation data. Please try again later.</p>';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('lookup-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const certificateId = document.getElementById('certificate-id').value;
        fetchData(certificateId);
    });
});
