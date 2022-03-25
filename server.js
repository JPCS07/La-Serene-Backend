const express = require("express");
const app = express();
const connectDB = require("./config/db");
const cors = require("cors");

//Connect Database
connectDB();

//Started Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started On Port ${PORT}`));

//Init Middelware allow us to get the data
app.use(cors());

app.use(express.json({ extended: false }));

//Singel endpoint for test out
// app.get('/' ,(req, res) => res.send('API Running'));

//Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

