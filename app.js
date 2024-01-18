const port = 8275;
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const kittySchema = new mongoose.Schema({
    name: String
});
const Kitten = mongoose.model('Kitten', kittySchema);

const uri = "mongodb+srv://shubham8275:Cy3w8PC3iWRC2wXd@cluster0.2wauy4b.mongodb.net/?retryWrites=true&w=majority";

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(uri);
}


app.use(cors());

 app.get('/', async(req, res) => {
    
});
app.get('/getAllKitten', async(req, res) => {
    res.setHeader('Content-Type', 'application/json')
      
      const data = await Kitten.find()
      res.json(data);
})

// Start the server
app.listen(port, () => {


    console.log(`Server is listening at http://localhost:${port}`);
});