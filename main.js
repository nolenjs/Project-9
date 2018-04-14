const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let users = [
    {userId: "Ammon234", name: "D", age: 65, email: "321", number: 1},
    {userId: "Jared4323", name: "Da", age: 69, email: "321", number: 2},
    {userId: "Emily123", name: "Dall", age: 18, email: "321", number: 3},
    {userId: "Ammon43", name: "Dal-i", age: 96, email: "321", number: 4},
    {userId: "Ammon76", name: "Dal-in", age: 12, email: "321", number: 5},
        ];

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('form', {title: "Add User"});
});

app.get('/users/:id', (req, res) => {
    for (let i = 0; i < users.length; i++){
        console.log(users[i].number, +req.params.id);
        if (+req.params.id === users[i].number){
            users.splice(i, 1);
            console.log(users, `User[${i}] is deleted`);
            break;
        }
        //yo moms got aids
    }
    console.log(users);
    console.log(users.length);
    res.render('users', {users: users});
});

app.post('/users', (req, res) => {
    let user = {
        name: req.body.name,
        userId: req.body.userId,
        age: req.body.age,
        email: req.body.email,
        number: users.length + 1
    };
    users.push(user);
    console.log("Created Users: ", users);
    console.log(users.length);
    res.render('users', {users: users});
});

app.post('/newUser/:id', (req, res) => {
    for (let i = 0; i < users.length; i++){
        console.log(users[i].number);
        if (+req.params.id === users[i].number){
            users[i] = {
                name: req.body.name,
                userId: req.body.userId,
                age: req.body.age,
                email: req.body.email,
                number: +req.params.id
            };
            console.log(users[i]);
            res.render("users", {users: users});
            break;
        }
    }
});

app.get('/edit/:id', (req, res) => {
    console.log("Running: ", +req.params.id);
    for (let i = 0; i < users.length; i++){
        console.log(users[i].number);
        if (+req.params.id === users[i].number){
            res.render("edit", {user: users[i]});
            break;
        }
    }
});

app.listen(3300, () => {
    console.log('listening on port 3300')
});