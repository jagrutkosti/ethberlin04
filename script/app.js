const express = require('express')
const app = express()

// Create a web server to provide API to fetch address and its corresponding gasUsage, and generate Proof
app.get('/', (req, res) => {
    res.send('Successful response.')
})
  
app.listen(3000, () => console.log('Example app is listening on port 3000.'))