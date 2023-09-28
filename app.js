const express = require('express');
const app = express();//Creates our Express application
const port = 3000;

app.get('/',(req,res) =>
{
    res.send("hellow n world")
})

app.listen(port,()=>
{
    console.log(`server running at http://localhost:${port}`)
})