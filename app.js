
const express = require('express');
const path = require('path')
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const app = express();
const port = 8275;
const jwtSecret = '4715aed3c946f7b0a38e6b534a9583628d84e96d10fbc04700770d572af3dce43625dd'
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  userImage: String
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './assets')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
const upload = multer({ storage: storage })
const User = mongoose.model('User', userSchema);
const uri = "mongodb+srv://shubham8275:Cy3w8PC3iWRC2wXd@cluster0.2wauy4b.mongodb.net/?retryWrites=true&w=majority";

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(uri).then((resp) => {
    console.log("mongoDB is Connected");
  });
}

app.use(cors());
app.use(bodyParser.json());
app.use('/static', express.static(path.join(__dirname, 'assets')))
app.get('/', async (req, res) => {

});
app.post('/register', upload.single('userImage'), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const  userImage = req.file.filename
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    await bcrypt.hash(password, 10).then(async (hash) => {
      const newUser = new User({ username, email, password: hash, userImage });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    })


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.post('/login', async (req, res, next) => {
  const { username, password } = req.body
  // Check if username and password is provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Username or Password not present",
    })
  }
  try {
    const user = await User.findOne({ username })
    if (!user) {
      res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      })
    } else {
      // comparing given password with hashed password
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const token = jwt.sign(
            { id: user._id, username },
            jwtSecret
          );
          res.status(200).json({
            message: "Login successful",
            user,
            token
          })
        } else {
          res.status(400).json({
            error: "Incorrect Password",
            message: "Login not succesful"
          })
        }

      })
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    })
  }
})
app.get("/getUserDetail", async (req, res, next) => {
  User.find({}).then((user) => {
    console.log("user=>", user);
    res.json({user:user})
  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});