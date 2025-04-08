const express = require('express'); // 載入express於npm中
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");  // 載入body-parser於npm中

const app = express();
app.use(express.json()); // 用於解析 JSON 請求體

// 設定靜態檔案路徑
app.use('/html', express.static('html'));
app.use('/css', express.static('css'));
app.use('/img', express.static('img'));
app.use('/js', express.static('js'));

// 設定跟目錄的主頁
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/workplace.html');
});

// 接收資料的路由
app.get('/data/ts', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'ts.json'));
});

app.get('/data/info', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'info.json'));
});

app.get('/clearClients', (req, res) => {
    clearClients();
    res.send('Clients cleared');
});

// 添加一個新的路由來處理跳轉

app.get('/gotoSourcePage', (req, res) => {
    // 重定向到 area_source.html
    res.redirect('/html/area_source.html');
});

app.get('/gotoMenuPage', (req, res) => {
    // 重定向到 area_source.html
    res.redirect('/html/menu_page.html');
});

app.get('/gotoWorkPage', (req, res) => {
    // 重定向到 area_source.html
    res.redirect('/');
});

app.get('/gotobig_mac', (req, res) => {
    // 重定向到 area_source.html
    res.redirect('/html/big_mac_overall.html');
});

app.get('/gotoMc_ch', (req, res) => {
    // 重定向到 area_source.html
    res.redirect('/html/Mc_ch_overall.html');
});

app.get('/gotocatch_game', (req, res) => {
    // 重定向到 area_source.html
    res.redirect('/html/catch_game.html');
});

const INFO_FILE = path.join(__dirname, 'data', 'info.json');

app.get('/getinfoData', (req, res) => {
    fs.readFile(INFO_FILE, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Server error');
            return;
        }
        let json = JSON.parse(data);
        res.json(json);
    });
});

// 初始化資料庫
app.post('/updateinitialData', (req, res) => {
    const updatedInfo = req.body.info;
    const updatedMerchendise = req.body.merchendise;
    const updatedMaterial = req.body.material;

    fs.readFile(INFO_FILE, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('伺服器錯誤');
            return;
        }

        let json = JSON.parse(data);
        json.info[0] = updatedInfo;
        json.merchendise[0] = updatedMerchendise;
        json.material[0] = updatedMaterial;

        fs.writeFile(INFO_FILE, JSON.stringify(json, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                res.status(500).send('寫入文件時出錯');
                return;
            }
            res.send('信息更新成功');
        });
    });
});

// 更新製造清單
app.post('/updateInfoOverallData', (req, res) => {
    const updatedMaterial = req.body.material;
    const updatedMerchendise = req.body.merchendise;

    fs.readFile(INFO_FILE, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Server error');
            return;
        }

        let json = JSON.parse(data);
        json.material[0] = updatedMaterial;
        json.merchendise[0] = updatedMerchendise;

        fs.writeFile(INFO_FILE, JSON.stringify(json, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                res.status(500).send('Error writing to file');
                return;
            }
            res.send('Info updated successfully');
        });
    });
});


// 更新確認訂單資料
app.post('/updateConfirmData', (req, res) => {
    const updatedInfo = req.body.info;
    const updatedMerchendise = req.body.merchendise;

    fs.readFile(INFO_FILE, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('伺服器錯誤');
            return;
        }

        let json = JSON.parse(data);
        json.info[0] = updatedInfo;
        json.merchendise[0] = updatedMerchendise;

        fs.writeFile(INFO_FILE, JSON.stringify(json, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                res.status(500).send('寫入文件時出錯');
                return;
            }
            res.send('信息更新成功');
        });
    });
});

// 顧客時間到離開的info.info 更新
app.post('/updateCompensateData', (req, res) => {
    const updatedInfo = req.body.info;

    fs.readFile(INFO_FILE, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('伺服器錯誤');
            return;
        }

        let json = JSON.parse(data);
        json.info[0] = updatedInfo;

        fs.writeFile(INFO_FILE, JSON.stringify(json, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                res.status(500).send('寫入文件時出錯');
                return;
            }
            res.send('信息更新成功');
        });
    });
});


//處理post的資料
const DATA_FILE = path.join(__dirname, 'data', 'ts.json');

// 更新時間資訊
app.post('/updateTimeData', (req, res) => {
    const updatedclient_time = req.body.client;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('伺服器錯誤');
            return;
        }

        let json = JSON.parse(data);
        json.client = updatedclient_time;

        fs.writeFile(DATA_FILE, JSON.stringify(json, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                res.status(500).send('寫入文件時出錯');
                return;
            }
            res.send('信息更新成功');
        });
    });
});

// 清除顧客訂單(剛載入時)
app.post('/clearClients', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading ts.json:', err);
            return;
        }

        let json = JSON.parse(data);
        json.client = []; // 清空 client 數組

        fs.writeFile(DATA_FILE, JSON.stringify(json, null, 2), 'utf8', err => {
            if (err) {
                console.error('Error writing to ts.json:', err);
                res.status(500).send('Error writing to file');
                return;
            }
            res.send('Client data cleared successfully');
        });
    });
});


// API 端點，用於刪除 ts.json 中的特定資料
app.post('/finish_client', (req, res) => {
    const clientIdToRemove = req.body.id;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Server error');
        }

        let json = JSON.parse(data);
        json.client = json.client.filter(client => client.id !== clientIdToRemove);

        // 重新分配 id
        json.client.forEach((client, index) => {
            client.id = (index + 1).toString();
        });

        fs.writeFile(DATA_FILE, JSON.stringify(json, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Server error');
            }

            res.send('Client removed and ids rearranged successfully');
        });
    });
});

// API 端點，用於新增 ts.json 中的特定資料
app.post('/insert_json', (req, res) => {
    const newClientData = req.body; // 從請求體中獲取新客戶數據

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Server error');
        }

        let json = JSON.parse(data);
        json.client.push(newClientData); // 將新數據添加到 client 陣列中

        fs.writeFile(DATA_FILE, JSON.stringify(json, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Server error');
            }

            res.send('New client added successfully');
        });
    });
});


// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
