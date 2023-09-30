const express = require('express');
const app = express(); //Creates our Express application
const port = 5000;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cors = require('cors')
//const router = express.Router();
const axios = require("axios"); 

app.use(cors()); // Use cors as middleware
app.use(express.json());

const url = 'mongodb://0.0.0.0:27017/MyDB';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const JournalEntrySchema = new Schema({
    date: { type: Date, default: Date.now },
    gratitude: String,
    anticipation: String,
    accomplishment: String
});

const Entry = mongoose.model('Entry', JournalEntrySchema);


// Endpoint to get all journal entries
app.get('/entries', (req, res) => {

    Entry.find({})
    .then(entries => {
        res.status(200).json(entries);// the data is contained in the body, it doenst happen automatically
    })
    .catch(err => {
        console.log('Error in retrieving entries:', err);
        res.status(500).send('Error in retrieving entries');
    });
});

// Endpoint to create a new journal entry
app.post('/entries', (req, res) => {
    const entryData = req.body;

    const newEntry = new Entry(entryData); // Changed variable name here

    newEntry.save() // And here
    .then(doc => {
        console.log('Journal entry saved:', doc);
        res.status(200).send(doc);
    })
    .catch(err => {
        console.log('Error in saving entry:', err);
        res.status(500).send('Error in saving entry');
    });
});

//Endpoint for DELETE
app.delete('/entries/id', (req,res) => {
    const { id } = req.params;
    
    Entry.deleteOne({ _id: id })
    .then(result => {
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Entry not found' });
        }

        res.status(200).json({ message: 'Entry deleted successfully' });
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    });
});

//EndPoint for API qoutes
const api_url = "https://zenquotes.io/api/quotes";

app.get("/api/quote", async (req, res) => {
    //try {
    //    const response = await fetch(api_url);
    //    if (!response.ok) {
    //        throw new Error(`HTTP error! status: ${response.status}`);
    //    }
    //    const data = await response.json();
    //    res.status(200).json(data);
    //}
    //catch (error) {
    //    console.log('Failed to make fetch request');
    //    console.error(error);
    //    res.status(500).json({ error: "An error occurred while fetching the quote" });
    //}

    fetch(api_url)
    .then(response => response.json())
    .then(data => {
       let quotes = data.map(quoteObject => quoteObject.q); // Extracts the quote text
       res.send(quotes); // Sends the quotes back to the frontend
    })
    .catch(error => {
        console.error('An error occurred:', error);
        res.status(500).send('An error occurred while fetching quotes');
    });
});



//lets create an endpoint for Authentications


app.listen(port,()=>
{
    console.log(`server running at http://localhost:${port}`)
});
