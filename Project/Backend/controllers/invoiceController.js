const PDFDocument = require("pdfkit");
const Order = require("../models/Order");

const generateInvoice = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            buyer: req.user.id
        }).populate(
            "items.product",
            "name"
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        const doc = new PDFDocument();

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=invoice-${order._id}.pdf`
        );

        doc.pipe(res);

        doc
            .fontSize(22)
            .text("Taru Foundation", {
                align: "center"
            });

        doc.moveDown();

        doc
            .fontSize(16)
            .text("INVOICE", {
                align: "center"
            });

        doc.moveDown();

        doc.fontSize(11);

        doc.text(`Order ID: ${order._id}`);
        doc.text(`Date: ${order.createdAt.toDateString()}`);
        doc.text(`Payment Status: ${order.paymentStatus}`);
        doc.text(`Order Status: ${order.orderStatus}`);

        doc.moveDown();

        doc.text(`Shipping Address: ${order.shippingAddress}`);

        doc.moveDown();

        doc.text("----------------------------------------");

        order.items.forEach((item) => {

            const itemTotal =
                item.price * item.quantity;

            doc.text(
                `${item.product.name} | ₹${item.price} x ${item.quantity} = ₹${itemTotal}`
            );
        });

        doc.text("----------------------------------------");

        doc.moveDown();

        doc
            .fontSize(14)
            .text(
                `Total Amount: ₹${order.totalAmount}`,
                {
                    align: "right"
                }
            );

        doc.moveDown();

        doc
            .fontSize(10)
            .text(
                "Thank you for supporting rural SHG products.",
                {
                    align: "center"
                }
            );

        doc.end();

    } catch (error) {

        console.error(
            "Invoice generation error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    generateInvoice
};