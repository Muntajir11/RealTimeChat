import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"


const app= express();
const PORT =process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Server is ready");
});

app.use("/api/auth", authRoutes)




app.listen(PORT,() => console.log(`Server running on port ${PORT}`));