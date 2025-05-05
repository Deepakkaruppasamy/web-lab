const http = require('http');
const mongoose = require("mongoose");
const { URL } = require('url');

const dbUrl = "mongodb://localhost:27017/project";

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);

const db = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(dbUrl, {
            family: 4
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log("DB Connection Error:", err);
    }
};
db();

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url.startsWith('/signup')) {
        const urlParts = new URL(req.url, `http://${req.headers.host}`);
        const username = urlParts.searchParams.get("username");
        const password = urlParts.searchParams.get("password");

        console.log(`Signup attempt: Username: ${username}, Password: ${password}`);

        res.writeHead(200, { 'Content-Type': 'text/html' });

        if (username && password) {
            try {
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    res.write("<h3>Signup Failed! Username already exists.</h3>");
                    console.log("Signup Failed! Username already exists.");
                } else {
                    const newUser = new User({ username, password });
                    await newUser.save();
                    res.write("<h3>Signup Successful!</h3>");
                    console.log("Signup Successful!");
                }
            } catch (error) {
                console.log("Signup Error:", error);
                res.write("<h3>Error during signup!</h3>");
            }
        } else {
            res.write("<h3>Signup Failed! Provide username and password.</h3>");
            console.log("Signup Failed! Provide username and password.");
        }
        res.end();
    } else if (req.method === 'POST' && req.url === '/login') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const postData = new URLSearchParams(body);
            const username = postData.get("username");
            const password = postData.get("password");

            console.log(`Login attempt: Username: ${username}, Password: ${password}`);

            res.writeHead(200, { 'Content-Type': 'text/html' });

            if (username && password) {
                try {
                    console.log("Checking login for:", username);
                    const user = await User.findOne({ username, password });

                    if (user) {
                        res.write("<h3>Login Successful!</h3>");
                        console.log("Login Successful!");
                    } else {
                        res.write("<h3>Invalid Username or Password</h3>");
                        console.log("Invalid Username or Password");
                    }
                } catch (error) {
                    console.log("Login Error:", error);
                    res.write("<h3>Error during login!</h3>");
                }
            } else {
                res.write("<h3>Login Failed! Provide username and password.</h3>");
                console.log("Login Failed! Provide username and password.");
            }
            res.end();
        });
    } else if (req.method === 'GET' && req.url.startsWith('/users')) {
        // Read all users
        try {
            const users = await User.find({});
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(users));
        } catch (error) {
            console.log("Error fetching users:", error);
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end("<h3>Error fetching users!</h3>");
        }
    } else if (req.method === 'PUT' && req.url.startsWith('/update')) {
        // Update user
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const postData = new URLSearchParams(body);
            const username = postData.get("username");
            const newPassword = postData.get("password");

            console.log(`Update attempt: Username: ${username}, New Password: ${newPassword}`);

            res.writeHead(200, { 'Content-Type': 'text/html' });

            if (username && newPassword) {
                try {
                    const user = await User.findOneAndUpdate({ username }, { password: newPassword });
                    if (user) {
                        res.write("<h3>Update Successful!</h3>");
                        console.log("Update Successful!");
                    } else {
                        res.write("<h3>User not found!</h3>");
                        console.log("User not found!");
                    }
                } catch (error) {
                    console.log("Update Error:", error);
                    res.write("<h3>Error during update!</h3>");
                }
            } else {
                res.write("<h3>Update Failed! Provide username and new password.</h3>");
                console.log("Update Failed! Provide username and new password.");
            }
            res.end();
        });
    } else if (req.method === 'DELETE' && req.url.startsWith('/delete')) {
        // Delete user
        const urlParts = new URL(req.url, `http://${req.headers.host}`);
        const username = urlParts.searchParams.get("username");

        console.log(`Delete attempt: Username: ${username}`);

        res.writeHead(200, { 'Content-Type': 'text/html' });

        if (username) {
            try {
                const user = await User.findOneAndDelete({ username });
                if (user) {
                    res.write("<h3>Delete Successful!</h3>");
                    console.log("Delete Successful!");
                } else {
                    res.write("<h3>User not found!</h3>");
                    console.log("User not found!");
                }
            } catch (error) {
                console.log("Delete Error:", error);
                res.write("<h3>Error during delete!</h3>");
            }
        } else {
            res.write("<h3>Delete Failed! Provide username.</h3>");
            console.log("Delete Failed! Provide username.");
        }
        res.end();
    } else {
        res.write("<h3>Invalid Request</h3>");
        res.end();
    }
});

server.listen(5010, () => {
    console.log('Server running on port 5010');
});