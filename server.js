require("dotenv").config()
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const cookieParser=require('cookie-parser');
const  upload  = require("./middlewares/multer.middleware");
const  uploadToCloudinary  = require("./utils/cloudinary");
const cloudinary=require("cloudinary").v2




// console.log(upload,uploadToCloudinary);
app.use(cors());
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Add image route
app.post('/add-image',upload.single("photo"),async(req,res)=>{
    // console.log(req.file);
    
    if(!req.file){
        return res.status(404).json("file required")
    }
    
    const image=req.file?.path
    const response =await uploadToCloudinary(image)

    res.status(201).json({response})

})
// update image route
app.post('/update-image/:public_id',upload.single("photo"),async(req,res)=>{
    // console.log(req.file);
    
    if(!req.params.public_id){
      return res.status(404).json("path required")
    }
    if(!req.file){
        return res.status(404).json("file required")
    }

    // deleting an existing image and uploading new one
    const image=req.file?.path

    try {
      await cloudinary.uploader.destroy(req.params.public_id);
      
      const response = await uploadToCloudinary(image)

      res.status(201).json({ response });
    } catch (error) {

      res.status(500).json({ error: "An error occurred while deleting the image", message: error.message });

    }

})
//delete image route
app.delete('/delete-image/:public_id', async (req, res) => {
    
    try {
      const response = await cloudinary.uploader.destroy(req.params.public_id);
      res.status(200).json({ message: "Image deleted successfully", response });
    } catch (error) {
      res.status(500).json({ error: "An error occurred while deleting the image", message: error.message });
    }
  });
  
  const form = new FormData()
 
  



app.listen(port, () => console.log(`listening to the port 5000`));
