const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoosta = require('mongoose');

let app = express();
let userSchema = mongoosta.Schema({
    userId: String,
    name: String,
    age: Number,
    email: String,
    id: String
});
let User = mongoosta.model('User', userSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let usersStatic = [
    {userId: "Ammon234", name: "B", age: 65, email: "321", id: createId()},
    {userId: "Jared4323", name: "D", age: 69, email: "321", id: createId()},
    {userId: "Emily123", name: "Ce", age: 18, email: "321", id: createId()},
    {userId: "Ammon43", name: "C", age: 96, email: "321", id: createId()},
    {userId: "Ammon76", name: "A", age: 12, email: "321", id: createId()},
];

mongoosta.connect('mongodb://localhost/users');
let db = mongoosta.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    // we're connected!
    User.remove({}, (err) => {
        if (err) return err;
    }).then(User.find((err) => {
        if (err) return err;
        for (let i = 0; i < usersStatic.length; i++){
            let user = new User(usersStatic[i]);
            console.log(i, ": ", user.name);
            user.save((err, person) => {
                if (err) return err;
                console.log(person.name, " Saved!");
            });
        }
    }));

});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('form', {title: "Add User"});
});

//deleting a user
app.get('/users/:id', (req, res) => {
    console.log("Removing User...");
    User.remove({id: req.params.id}, (err) => {
        if (err) return err;
        User.find((err, users) => {
            if (err) return err;
            orderList(users, res);
        });
        console.log("User Removed!!");
    });
});

//creating and displaying users
app.post('/users', (req, res) => {
    let user = new User({
        name: req.body.name,
        userId: req.body.userId,
        age: req.body.age,
        email: req.body.email,
        id: createId()
    });
    user.save((err, person) => {
        if (err) return err;
        console.log(person.name, " Saved!");
        User.find((err, users) => {
            if (err) return err;
            orderList(users, res);
        })
    });
});

//updating a user      NOT WORKING (just displaying this one user)
app.post('/newUser/:id', (req, res) => {
    User.findOne({id: req.params.id}, (err, user) => {
        if (err) return err;
        user.name = req.body.name;
        user.userId = req.body.userId;
        user.age = req.body.age;
        user.email = req.body.email;
        User.find((err, users) => {
            if (err) return err;
            orderList(users, res);
        });
    });
});

app.get('/edit/:id', (req, res) => {
    console.log("Running: ", req.params.id);
    User.findOne({id: req.params.id}, (err, user) => {
        if (err) return err;
        res.render("edit", {user: user});
    });
});

app.listen(3300, () => {
    console.log('listening on port 3300')
});

function createId(){
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i = 0; i < 9; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function orderList(a, res){
    let list = [];
    let listActual = [];
    for (let i = 0; i < a.length; i++){
        list.push(a[i].name.toLowerCase());
        listActual.push(a[i].name)
    }
    list.sort();
    for (let i = 0; i < a.length; i++){
        for (let j = 0; j < a.length; j++){
            if (a[j].name === list[i]){
                list[i] = a[j];
                //a.splice(j, 1);
                j = a.length;
                for (let k = 0; k < a.length; k++){
                    if (list[k].name = listActual[j].name.toLowerCase()){
                        list[k].name = listActual[j].name
                    }
                }
            }
        }
    }
    console.log(list);
    res.render('users', {users: list});
}