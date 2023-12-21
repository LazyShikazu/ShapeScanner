const express = require('express')
const multer = require('multer');
const path = require('path');
const port = 5000;

const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
 
mongoose.connect('mongodb://127.0.0.1/node_auth', {
    useNewUrlParser: true,
    // useUnifiedTopology: true
})
.then(()=>{
    console.log("connected to database")

    app.listen(5000,()=>{
        console.log("App is listening on the port 5000")
    })

})
 
const routes = require('./routes/routes')
 
app = express()
 
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}))
 
app.use(express.json())
 
app.use('/api', routes)
 
app.listen(8000)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Uploads will be stored in the 'uploads' folder
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
  
  const upload = multer({ storage });
  
  // Handle image upload endpoint
  app.post('/upload', upload.single('image'), (req, res) => {
    res.json({ message: 'Image uploaded successfully' });
  });
  
//   app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });