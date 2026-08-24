const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const cors = require("cors");
dotenv.config();

app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.send("Api is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use(errorMiddleware);
app.use(cors());

app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
});