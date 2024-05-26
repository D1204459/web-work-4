var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//在 express.js 中，使用 sqlite3 來操作數據庫，並開啟位置在 db/sqlite.db 的資料庫，需要確認是否成功打開資料庫
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/sqlite.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
});

db.run('CREATE TABLE IF NOT EXISTS drinks (id INTEGER PRIMARY KEY AUTOINCREMENT, product_name TEXT NOT NULL, product_date DATE NOT NULL, price_s_small_cup REAL NOT NULL, price_l_large_cup REAL NOT NULL, product_date_one DATE NOT NULL, price_s_small2_cup REAL NOT NULL, price_l_large2_cup REAL NOT NULL)');

//撰寫 /api/drinks 路由，使用 SQL 來查詢 drinks 所有的資料，回傳 json 格式的資料就好
app.get('/api/drinks', (req, res) => {
    db.all('SELECT * FROM drinks', (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(rows);
    });
});


//撰寫 post /api/insert 路由，使用 SQLite 新增一筆飲料資料 (product_name ,product_date , price_s_small_cup ,price_l_large_cup , product_date_one ,price_s_small2_cup,price_l_large2_cup )，drinks 中，回傳文字的訊息，不要 json
app.post('/api/insert', (req, res) => {
    const { product_name ,product_date , price_s_small_cup ,price_l_large_cup , product_date_one ,price_s_small2_cup,price_l_large2_cup } = req.body;
    db.run('INSERT INTO drinks (product_name ,product_date , price_s_small_cup ,price_l_large_cup , product_date_one ,price_s_small2_cup,price_l_large2_cup) VALUES (?, ?, ?, ?, ?, ?, ?)', [product_name ,product_date , price_s_small_cup ,price_l_large_cup , product_date_one ,price_s_small2_cup,price_l_large2_cup], function(err) {
        if (err) {
            res.send('新增失敗');
            return console.error(err.message);
        }
        res.send('succes新增成功');
    });
});
module.exports = app;
