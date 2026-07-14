const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hola desde Express");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});