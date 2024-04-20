import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js"
import connectToMongoDB from "./db/connectToMongoDB.js";

const app= express();
const PORT =process.env.PORT || 3000;

dotenv.config();

app.use(express.json());

app.use("/api/auth", authRoutes)


// app.get("/", (req, res) => {
//     res.send("Server is ready");
// });



app.listen(PORT,() => {
    connectToMongoDB();
    console.log(`Server running on port ${PORT}`);

});