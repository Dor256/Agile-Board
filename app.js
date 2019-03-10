import express from "express";
import path from "path";

const app = express();
app.use(express.static(path.join(__dirname, './public')));

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, './public', 'agile.html'));
    // res.sendFile("C:/Users/Dor/VsWorkspace/Udemy/Agile/public/agile.html");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is up");
});