import express from "express";

const app = express();
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile("C:/Users/Dor/VsWorkspace/Udemy/Agile/public/agile.html");
});

app.listen(3000, () => {
    console.log("Server is up");
});