const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");
const User = require("./models/User");

dotenv.config({ path: path.join(__dirname, ".env") });

const seedAdmin = async (password) => {
    if (!password) {
        console.error("Error: Password is required to seed the admin account.");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB.");

        const adminEmail = "admin@tarufoundation.org";
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log(`Admin account already exists: ${adminEmail} (Role: ${existingAdmin.role})`);
            await mongoose.disconnect();
            return existingAdmin;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const adminUser = await User.create({
            name: "Taru Admin",
            email: adminEmail,
            password: hashedPassword,
            phone: "+91 99999 99999",
            address: "Taru Foundation Central Office, New Delhi",
            role: "admin"
        });

        console.log("Permanent Main Admin account created successfully:");
        console.log({
            id: adminUser._id,
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role
        });

        await mongoose.disconnect();
        return adminUser;
    } catch (error) {
        console.error("Failed to seed admin account:", error.message);
        process.exit(1);
    }
};

module.exports = seedAdmin;

if (require.main === module) {
    const password = process.argv[2];
    seedAdmin(password);
}
