var http = require('http'),
    express = require('express'),
    app = express(),
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database('./db/ddm.db');

/* We add configure directive to tell express to use Jade to
   render templates */
app.configure(function() {
    app.set('views', __dirname + '/public');
    app.engine('.html', require('jade').__express);

    // Allows express to get data from POST requests
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/public'));
});

// Database initialization
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='donations'", function(err, row) {
    if(err !== null) {
        console.log(err);
    }
    else if(row == null) {
        db.run('CREATE TABLE "donations" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "name" VARCHAR(255), "status" INTEGER)', function(err) {
            if(err !== null) {
                console.log(err);
            }
            else {
                console.log("SQL Table 'donations' initialized.");
            }
        });
    }
    else {
        console.log("SQL Table 'donations' already initialized.");
    }
});

// We render the templates with the data
app.get('/', function(req, res) {

    db.all('SELECT * FROM donations WHERE status = 1 ORDER BY name', function(err, row) {
        if(err !== null) {
            res.send(500, "An error has occurred -- " + err);
        }
        else {
            var all = [];
            var r = [];
            for (var i = 0; i < row.length; i++) {
                if (i % 5 == 0 && r.length > 0) {
                    all.push(r.slice());
                    r = [];
                }
                r.push(row[i]);
            }
            all.push(r.slice());
            res.render('index.jade', {donations: all}, function(err, html) {
                res.send(200, html);
            });
        }
    });
});

app.get('/edit', function(req, res) {

    db.all('SELECT * FROM donations WHERE status = 1 ORDER BY name', function(err, row) {
        if(err !== null) {
            res.send(500, "An error has occurred -- " + err);
        }
        else {
            res.render('edit.jade', {donations: row}, function(err, html) {
                res.send(200, html);
            });
        }
    });
});

// We define a new route that will handle bookmark creation
app.post('/add', function(req, res) {
    name = req.body.Name;
    sqlRequest = "INSERT INTO 'donations' (name, status) VALUES('" + name + "', 1)"
    db.run(sqlRequest, function(err) {
        if(err !== null) {
            res.send(500, "An error has occurred -- " + err);
        }
        else {
            res.redirect('back');
        }
    });
});

// We define another route that will handle bookmark deletion
app.get('/delete/:id', function(req, res) {
    db.run("UPDATE donations SET status = 0 WHERE id='" + req.params.id + "'", function(err) {
        if(err !== null) {
            res.send(500, "An error has occurred -- " + err);
        }
        else {
            res.redirect('back');
        }
    });
});

/* This will allow Cozy to run your app smoothly but
 it won't break other execution environment */
var port = process.env.PORT || 9250;
var host = process.env.HOST || "127.0.0.1";

// Starts the server itself
var server = http.createServer(app).listen(port, host, function() {
    console.log("Server listening to %s:%d within %s environment",
                host, port, app.get('env'));
});