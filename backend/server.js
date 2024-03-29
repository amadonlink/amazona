import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import process from "process";
import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import orderRouter from "./routers/orderRouter.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection is successful"))
  .catch(() => console.log("Not connected to database"));

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});
// app.get('/', (req, res) =>{
//     res.send('Server is ready');
// });

// This middleware sends the error gotten from the userRoute to user
app.use((error, seq, res, next) => {
  res.status(500).send({ message: error.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
