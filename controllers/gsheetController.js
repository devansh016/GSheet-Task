const { google } = require("googleapis");
const sheets = google.sheets('v4');



async function fetchData({spreadsheetId}){
    // Getting Stored Credentials
    const credentials = require("../credential.json");

    try{
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'http://localhost/googleauth'
        )
            
        oauth2Client.setCredentials(credentials)
        const googleSheets = google.sheets({ version: "v4", auth: oauth2Client })
        const metaData = await googleSheets.spreadsheets.get({ auth: oauth2Client, spreadsheetId,})
        var resData = new Object
    
        for(const sheets of  metaData.data.sheets) {
            const getRows = await googleSheets.spreadsheets.values.get({ auth: oauth2Client, spreadsheetId, range: sheets.properties.title});
            var sheet_id = sheets.properties.sheetId;
            resData["sheet_id_"+sheet_id] = []
            for(const row of getRows.data.values) {
                var key = 0
                var jsonobj = new Object
                row.forEach(function(cell) {
                    jsonobj[key] = cell
                    key = key +1
                })
                resData["sheet_id_"+sheet_id].push(jsonobj)
            }
        }
        return {resData, status: 200}
    } catch(error){
        return { 'error': error.message , status: 400}
    }
}

async function updateData({spreadsheet_id, sheet_id, row_number, column_number, value}){
    // Getting Stored Credentials
    const credentials = require("../credential.json");
    try{
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'http://localhost/googleauth'
        )
            
        oauth2Client.setCredentials(credentials);
        var sheet_title;
        const googleSheets = google.sheets({ version: "v4", auth: oauth2Client })
        const metaData = await googleSheets.spreadsheets.get({ auth: oauth2Client, spreadsheetId: spreadsheet_id,})
        for(const sheet of  metaData.data.sheets) {
            if(sheet.properties.sheetId == sheet_id )
                sheet_title = sheet.properties.title
        }

        if(sheet_title == undefined){
            return { 'error': 'SheetID not found.' , status: 400}      
        }

        const response = await googleSheets.spreadsheets.values.update({
            auth: oauth2Client,
            'spreadsheetId': spreadsheet_id,
            range: sheet_title + "!"+ column_number + row_number,
            valueInputOption: 'USER_ENTERED',
            resource: {
              'values': [[value]]
            }
        })

        if(response.statusText == "OK")
            return { sucess: true, status: response.status }
        else 
            return { sucess: false, status: response.status }

    } catch(error){
        return { 'error': error.message , status: 400}
    }
    
}

module.exports = {
    fetchData,
    updateData
}