const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password', // use your MySQL password if needed
    database: 'chatDB',
    dateStrings: true
});

// POST route for login
app.post('/login', (req, res) => {
    const username = req.body.username;
    const hashedPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');

    const sql = 'SELECT * FROM user WHERE username = ? AND password = ?';
    db.query(sql, [username, hashedPassword], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Server error');
        }

        if (results.length > 0) {
            req.session.isLoggedIn = true;
            req.session.username = username;
            req.session.user_id = results[0].id;
            res.redirect('/index.html');
        } else {
            res.redirect('/login.html');
        }
    });
});

app.post('/register', (req, res) => {
    const username = req.body.username;
    const hashedPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');
    const email = req.body.email;
    const profilePhoto = "profile.png";

    const sql = `
        INSERT INTO user (username, password, email, profile_photo)
        SELECT ?, ?, ?, ?
        FROM DUAL
        WHERE NOT EXISTS (
            SELECT 1 FROM user WHERE username = ?
        )
    `;
    db.query(sql, [username, hashedPassword, email, profilePhoto, username], (err, results) => {
        if(err) {
            console.error('Database error:', err);
            return res.status(500).send('Server error');
        }
        if(results.affectedRows === 0)
            return res.status(409).send('Username already taken');
        
        res.redirect('/login.html');
        
    });
});

app.post('/logout', (req, res) => {
   req.session.destroy((err) => {
       if(err) {
           console.error('Logout error:', err);
        }
        res.end();
    });
});

app.post('/createroom', (req, res) => {
    if(req.session.username && req.session.user_id) {
        const roomname = req.body.name;
        const ownerid = req.session.user_id;

        const sql = 'INSERT INTO room (name, owner_id) VALUES (?, ?)';
        db.query(sql, [roomname, ownerid], (err, results) => {
            if(err) {
                console.error('Database error:', err);
            }
        });
        res.redirect('/rooms.html');
    }
});

app.post('/createboard', (req, res) => {
    if(req.session.username && req.session.user_id) {
        let ownerid = req.session.user_id;
        let name = req.body.name;
        
        const sql = 'INSERT INTO board (name, owner_id) VALUE (?, ?)';
        db.query(sql, [name, ownerid], (err, results) => {
            if(err) {
                console.error('Database error:', err);
            }
        });
    }
});

app.get('/loggedin', (req, res) => {
    if(req.session.username) {
        res.json({loggedIn: true, username: req.session.username, user_id: req.session.user_id});
    } else {
        res.json({loggedIn: false});
    }
});

app.get('/getrooms', (req, res) => {
    const sql = "SELECT name FROM room";

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

app.get('/threads/:name', (req, res) => {
    const postsql = `
        WITH latest_post AS (
            SELECT
                t.id AS thread_id,
                p.id AS post_id,
                p.user_id,
                p.creation_date AS date
            FROM thread t
            JOIN post p ON p.thread_id = t.id
            WHERE t.board_id = (SELECT id FROM board WHERE name = ?)
            AND (p.creation_date, p.id) IN (
                SELECT MAX(p2.creation_date), MAX(p2.id)
                FROM post p2
                JOIN thread t2 ON p2.thread_id = t2.id
                WHERE t2.board_id = (SELECT id FROM board WHERE name = ?)
                GROUP BY t2.id
            )
        )
        SELECT 
            t.title AS title,
            t.id AS thread_id,
            COUNT(p.id) AS post_count,
            lp.date AS last_posted,
            u.username AS last_user
        FROM thread t
        LEFT JOIN post p on p.thread_id = t.id
        LEFT JOIN latest_post lp on lp.thread_id = t.id
        LEFT JOIN user u ON lp.user_id = u.id
        WHERE t.board_id = (SELECT id FROM board WHERE name = ?)
        GROUP BY t.id, lp.date, u.username
    `;

    db.query(postsql, [req.params.name, req.params.name, req.params.name], (err, results) => {
        if(err) {
            console.error('Database error:', err);
            return res.status(500).json( {error: 'Database query failed'});
        }
        
        console.log(results);
        
        res.json(results);
    });
});

app.get('/getboards', (req, res) => {
    const sql = `
        WITH board_posts AS (
            SELECT 
            b.id AS board_id,
            p.id AS post_id,
            p.user_id,
            p.creation_date AS date
            FROM board b
            JOIN thread t ON t.board_id = b.id
            JOIN post p ON p.thread_id = t.id
        ),
        latest_post AS (
            SELECT bp.*
            FROM board_posts bp
            JOIN (
                SELECT board_id, MAX(date) AS max_date
                FROM board_posts
                GROUP BY board_id
            ) latest ON bp.board_id = latest.board_id AND bp.date = latest.max_date
        )
        SELECT
        b.id,
        b.name,
        COUNT(DISTINCT t.id) AS thread_count,
            COALESCE(MAX(lp.date), 'Never') AS last_post_date,
            COALESCE(MAX(u.username), 'N/A') AS last_user
            FROM board b
            LEFT JOIN thread t ON t.board_id = b.id
            LEFT JOIN latest_post lp ON lp.board_id = b.id
            LEFT JOIN user u ON lp.user_id = u.id
            GROUP BY b.id, b.name;
    `;
    
    db.query(sql, (err, results) => {
        if(err) {
            console.error('Database error:', err);
            return res.status(500).json({error: 'Database query failed'});
        }
        res.json(results);
    });
});

app.get('/room/:name', (req, res) => {
    res.sendFile(__dirname + '/public/room.html');
});

app.get('/messages/:name', (req, res) => {
    const msgsql = `
        SELECT 
            m.id,
            m.user_id,
            u.username,
            m.content,
            m.date
        FROM message m
        JOIN room r ON m.room_id = r.id
        JOIN user u ON m.user_id = u.id
        WHERE r.name = ?
        ORDER BY m.date ASC
    `;
    db.query(msgsql, [req.params.name], (err, results) => {
        if(err) {
            console.error('Database error:', err);
            return res.status(500).json( {error: 'Database query failed'});
        }
        
        res.json(results);
    });
});

app.get('/create-thread/:name', (req, res) => {
    res.sendFile(__dirname + '/public/create-thread.html');
});

app.post('/create-thread/:name', (req, res) => {
    if (!req.session.username || !req.session.user_id) {
        return res.status(401).send('Not logged in');
    }
    
    const board_name = req.params.name;
    const user_id = req.session.user_id;
    const thread_title = req.body.thread_title;
    let creation_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const post_content = req.body.post_content;
    
    const sql1 = `
    INSERT INTO thread (board_id, title, creator_id, creation_date)
    SELECT b.id, ?, ?, ?
    FROM board b
    WHERE b.name = ?
    `;
    
    const sql2 = `
    INSERT INTO post (thread_id, user_id, contents, creation_date)
    VALUES (?, ?, ?, ?)
    `;
    
    const sqlDelete = `DELETE FROM thread WHERE id = ?`;
    
    db.query(sql1, [thread_title, user_id, creation_date, board_name], (err, threadResult) => {
        if (err || threadResult.affectedRows === 0) {
            console.error('Thread insert error or board not found:', err);
            return res.status(500).send('Failed to create thread');
        }
        
        const thread_id = threadResult.insertId;
        
        db.query(sql2, [thread_id, user_id, post_content, creation_date], (err) => {
            if (err) {
                console.error('Post insert failed, deleting thread:', err);
                db.query(sqlDelete, [thread_id], deleteErr => {
                    if (deleteErr) {
                        console.error('Failed to delete thread after post failure:', deleteErr);
                    }
                    return res.status(500).send('Failed to create post');
                });
            } else {
                res.redirect(`/thread/${thread_id}`);
            }
        });
    });
});


app.get('/board/:name', (req, res) => {
    res.sendFile(__dirname + '/public/board.html');
});

app.get('/board/:bname/thread/:tid', (req, res) => {
    res.sendFile(__dirname + '/public/thread.html');
});

app.post('/message', (req, res) => {
    if(req.session.username && req.session.user_id) {
        let content = req.body.msg_txt;
        let user_id = req.session.user_id;
        let room_name = req.body.room_name;
        let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        const sql = `
            INSERT INTO message (user_id, room_id, content, date) 
            SELECT ?, r.id, ?, ?
            FROM room r
            WHERE r.name = ?
            `;
        db.query(sql, [user_id, content, date, room_name], (err, results) => {
            if(err) {
                console.error('Database error:', err);
                return res.status(500).json( {error: 'Database query failed'});
            }
        });
    }
});

// Catch-all for unknown routes
app.use((req, res) => {
    res.status(404).send('Not Found');
});

// Start server
app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}/`);
});
