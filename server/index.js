import express from "express";
import dotenv from 'dotenv';

dotenv.config();

const app = express()
const port = process.env.PORT
app.get('/', (req, res) => {
    console.log('Hello world')
    res.json({ msg: "Hello" })
})
app.listen(port, () => {
    console.log(`server is listenng ${port}`)
})