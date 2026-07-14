const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hola desde Express");
});

app.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${process.env.PORT}`);
});