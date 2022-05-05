var express = require('express')
const app = express()

require('dotenv').config()

app.use(express.json())

// Auth Route
const authRoute = require('./routes/authRoute')
app.use('/', authRoute)

// Google Sheets Route
const gsheetRoute = require('./routes/gsheetRoute')
app.use('/', gsheetRoute)

// Starting the server
const port = process.env.PORT || 80
app.listen(port, ()=>{
    console.log('Server is running at port ', port)
})