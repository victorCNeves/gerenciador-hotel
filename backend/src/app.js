const express = require('express');
const routes = require('./routers/route');
const app = express();
const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use('/api', routes);

app.use(
    express.urlencoded({
        extended: true,
    })
)

app.listen(8081, ()=>{
    console.log("Servidor na porta 8081");
})