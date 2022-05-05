const {google} = require('googleapis')
var fs = require('fs')

require('dotenv').config()

function getauthorizationUrl (){
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'http://localhost/googleauth'
    )

    const scopes = [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
    ]

    const authorizationUrl =  oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        include_granted_scopes: true
    })
    
    return authorizationUrl
}

async function getaccesstoken(code){
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'http://localhost/googleauth'
    )

    //Exchanging authcode to get Tokens
    const {tokens} = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens);

    // Storing Access Tokens in Credential.json File
    fs.writeFile('credential.json', JSON.stringify(tokens), function (err) {
        if (err) throw err;
    })
    return tokens;

}

module.exports = {
    getauthorizationUrl,
    getaccesstoken
}