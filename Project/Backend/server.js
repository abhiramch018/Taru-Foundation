const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const emailRoutes = require("./routes/emailRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");
const cors = require("cors");

// Temporary diagnostic checks
console.log("MAIL_USER exists:", !!process.env.MAIL_USER);
console.log("MAIL_PASSWORD exists:", !!process.env.MAIL_PASSWORD);

// Enable CORS
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.send("Api is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/invoices", invoiceRoutes);

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
});