const express = require('express');
const cors=require('cors');
const dotenv=require("dotenv").config();
const mongoose=require("mongoose");
const userRouter=require("./routers/user");

const app = express();

app.use(express.json())
app.use(cors());
app.use("/user",userRouter)

const PORT=process.env.PORT || 5000; 
const CONNECTION_URL = process.env.CONNECTION_URL;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));