const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Connect to database
const db = new sqlite3.Database('./db/election.db' , err => {
    if (err) {
        return console.log(err.message);
    }

    console.log('Connected to election database');
});
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;
    const params = [];
    db.all(sql, params, (err, rows) => {
        if(err) {
            res.status(500).json( { error: err.message });
        }

        res.json({
            message: 'success',
            data: rows
        });
    });
});
//how does it get ID from params into ?
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if(err){
            res.status(400).json({ error: err.message});
        }

        res.json({
            message: 'success',
            data: row
        });
    });
});
//delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function(err, result) {
        if(err) {
            res.status(400).json({ error: res.message });
        }

        res.json({
            message: 'successfully deleted',
            changes: this.changes
        });
    });
});
//create a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
//                 VALUES(?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];
// db.run(sql, params, function(err, result) {
//     if(err) {
//         console.log(err);
//     }
//     console.log(result, this.lastID);
// });
//Default response for any other request (not found) Catchall route
app.use((req, res) => res.status(404).end())
//Start server after DB connection
db.on('open', () => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});