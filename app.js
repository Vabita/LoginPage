const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/',(req, res) => {
    res.render('index')
})

app.post('/register', (req, res) => {
    const { email, username, password } = req.body;
    const user = { email, username, password };

    fs.appendFile('users.txt', JSON.stringify(user) + '\n', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            res.sendStatus(500);
        } else {
            console.log('User registered:', user);
            res.send(`<h1>${user.username} Dasboard <h1/>`);
        }
    });
});

app.get('/login',(req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    fs.readFile('users.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.sendStatus(500);
        } else {
            const users = data.trim().split('\n').map(JSON.parse);
            const user = users.find((u) => u.username === username && u.password === password);
            if (user) {
                console.log('User logged in:', user);
                res.send(`<h1>${user.username} Dasboard <h1/>`);
            } else {
                console.log('Login failed for:', username);
                res.send('Invalid username or password.');
            }
        }
    });
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
