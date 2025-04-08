// 預設參數
const big_mac_price = 30; // 大麥克價格
const customer_time = [30,50]; // 顧客滯留時間customer_time[0]~customer_time[1]秒
const customer_freq = [10,20]; // 顧客產生時間customer_freq[0]~customer_freq[1]秒
const customer_big_mac = 5; // 顧客生成1~customer_big_mac個大麥克
const end_money = 10000; // 結束條件：金額超過10000
const end_customer = 100; // 結束條件：服務顧客數超過100

// 使用sessionStorage紀錄第一次載入狀況，如果非第一次則不執行

if (!sessionStorage.getItem('started')) {
    start();
    // 標記 start() 已經執行    
    sessionStorage.setItem('started', 'true');   
}

function start(){  
    // 向服務器發送請求以清空客戶數據
    console.log('beforeunload 事件被觸發');
    navigator.sendBeacon('/clearClients');

    // 初始化設定
    // 初始金額 = 150
    // 完成顧客數 = 0
    // 目前持有大麥克數 = 0
    // 存貨持有
    // 生菜 = 10000(沒有做獲取管道，所以設很大的數)
    // 牛肉 = 10000(沒有做獲取管道，所以設很大的數)
    // 番茄 = 0

    // 找到info.json的資料庫讀取資料
    fetch('/getinfoData')
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            // 假設只有一個玩家的數據，取info數據
            let info = data.info[0];
            let money = info.money = 150;
            let customer = info.customer = 0;
            // 取merchendise數據
            let merchendise = data.merchendise[0];
            let bigMacCount = merchendise.big_mac = 0;
            // let mcChCount = merchendise.Mc_ch; (未開放)
            // 取material數據
            let material = data.material[0];
            let lettuce = material.lettuce = 10000;
            let beef = material.beef = 10000;
            let tomato = material.tomato = 0;

            // 更新 info.json 文件中的數據
            fetch('/updateinitialData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    info: info, 
                    merchendise: merchendise,
                    material:material
                }) // 發送更新後的info.json數據
            })
            .then(response => response.text())
            .then(updateResponse => {
                console.log(updateResponse);
            })
            .catch(error => console.error('Error:', error));
        })
        .catch(error => console.error('Error:', error));
}

// 結束機制
function end(money, num_customer){
    if(parseInt(money) >= end_money || parseInt(num_customer) >= end_customer){
        alert("you win!!! \n"
            + "目前持有金額量： " + money + "\n"
            + "目前完成顧客數： " + num_customer + "\n"
            + "請重新進入頁面進行下一輪遊戲!");
    } else if(parseInt(money) < 0){
        alert("you lose!!! \n"
            + "目前持有金額量： " + money + "\n"
            + "目前完成顧客數： " + num_customer + "\n"
            + "請重新進入頁面進行下一輪遊戲!");
    }
}

// 點擊人物時跳出該人物的購買清單
document.addEventListener('DOMContentLoaded', function() {
    // 查找所有的 'wait_place' 類別的 div 元素
    var waitPlaces = document.querySelectorAll('.wait_place');

    // 為每個 div 添加點擊事件監聽器
    waitPlaces.forEach(function(div, index) {
        var client =  div.querySelector('.client');
        client.addEventListener('click', function() {
            // console.log(client.className);
            var isempty = client.className.split(' ');

            // 顯示該抓取哪個json的顧客，並刪除
            isempty = isempty[isempty.length - 1]; 
            // console.log("click client" + isempty);
            // finish_client(isempty.toString());
            div.querySelector('.window' + isempty).id = "show";
        });
    });
});

// ---------------------------------------------------------------------------

// // 當頁面啟動時，匯入排列資訊
window.addEventListener('DOMContentLoaded', function() {
    //method == same 代表沒有改變
    queue(6,"same"); 

    // 倒數計時
    time_block();

    // 讓清單(桌子中間那個)在頁面開啟時讀取資料
    fetch('/getinfoData')
        .then(response => response.json())
        .then(data => {
            // 抓info.json的資料
            let info = data.info[0];
            let numoney = info.money;
            let numcustomer = info.customer;
            // console.log(numoney, numcustomer);

            let merchendise = data.merchendise[0];
            let big_macCount = merchendise.big_mac;
            let Mc_chCount = merchendise.Mc_ch;
            // console.log(big_macCount, Mc_chCount);

            // 輸入至清單當中
            this.document.querySelector('.money').textContent = numoney;
            this.document.querySelector('.big_mac').textContent = big_macCount;
            this.document.querySelector('.Mc_ch').textContent = Mc_chCount;
            this.document.querySelector('.clientCount').textContent = numcustomer;

        })
        .catch(error => console.error('Error:', error));
});

// ---------------------------------------------------------------------------

//建立排隊形式
function queue(changeId, method) {
    changeId = changeId - 1;
    // 先讀取 ts.json 的資料
    fetch('/data/ts')
        .then(response => response.json())
        .then(data => {
            let client = data.client; // 將 client 陣列存入 clientArray

            // 查找所有的 'wait_place' 類別的 div 元素
            var waitPlaces = document.querySelectorAll('.wait_place');

            // 遍歷每個wait_place，找該項目下的第一個p
            waitPlaces.forEach((div, index) => {
                var img = div.querySelector('img');
                var p = div.querySelector('p');
                var num = div.querySelector('.number' + (index+1));
                
                if (index < client.length) {
                    // console.log("index: " + index);
                    if (index < changeId){
                        // 如果 index 小於客戶數量，顯示對應的客戶圖片
                        img.src = "../img/workplace/client/" + client[index].name + ".png";
                        img.id = "show";
                        p.textContent = client[index].time;
                        p.id = "show"; 
                        num.textContent = client[index].big_mac;

                    } else {
                        if (method === "Insert"){
                            img.src = "../img/workplace/client/" + client[index].name + ".png";
                            img.id = "show";
                            p.textContent = client[index].time;
                            p.id = "show"; 
                            num.textContent = client[index].big_mac;
                        } else if (method === "Delete"){
                            img.src = "../img/workplace/client/" + client[index].name + ".png";
                            img.id = "show";
                            
                            // 把後一個拿過來
                            var p_behind = document.querySelector('.time' + (index + 2));
                            var time_behind = p_behind.textContent;
                            p.textContent = time_behind;
                            p.id = "show"; 
                            // time_block((index + 1), p.textContent);

                            // 購賣數量跟上面一樣的操作
                            var num_behind = document.querySelector('.number' + (index + 2));
                            var num_b = num_behind.textContent;
                            num.textContent = num_b;
                        }
                    } 
                } else {
                    // 如果 index 大於等於客戶數量，隱藏圖片
                    img.id = "hidden";
                    p.id = "hidden";
                    div.querySelector('.window' + (index + 1)).id = "hidden";
                }
            });
        })
        .catch(error => console.error('Error:', error));
}


//刪除已完成訂單的客人
function finish_client(clientId) {
    // console.log("finish client" + clientId);
    fetch('/finish_client', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: clientId })
    })
    .then(response => response.text())
    .then(data => {
        // 呼叫 queue 函數前確保將對應的計時器清除
        if (intervals[clientId]) {
            clearInterval(intervals[clientId]);
            intervals[clientId] = null;
        }
        console.log(data);
        queue(clientId, "Delete"); // 在刪除操作完成後調用 queue
    })
    .catch(error => console.error('Error:', error));
}

// 插入json中
function insert_json(newClient){
    fetch('/insert_json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newClient)
    })
    .then(response => response.text())
    .then(data => {
        // console.log(data);
        // console.log("insert id: " + newClient.id);
        queue(newClient.id, "Insert");
    })
    .catch(error => console.error('Error:', error));
}
// setInterval(gene_client, 1000);


// 隨機函式 1~max中間的數值
function getRand(s, t){
    let i = Math.floor(Math.random() * (t - s + 1) + s) ; 
    // console.log(i);
    return i;
}


// 建立隨機顧客生成
function gene_client(){
    fetch('/data/ts')
        .then(response => response.json())
        .then(data => {
            // 將 client 陣列存入 clientArray
            let client = data.client;

            // 求得ts.json的總客戶數量
            let client_number = client.length;
            // 當整體用戶數少於5時，就能夠讓新顧客進行排隊
            if (client_number < 5){
                let newId = (client_number + 1).toString();
                let newClientName = "client" + getRand(1,5).toString();
                let newTime = getRand(customer_time[0],customer_time[1]).toString();
                // console.log(newTime);
                let newBig_Mac = getRand(1,customer_big_mac).toString();

                // 建立新客戶數據
                let newClient = { id: newId, name: newClientName, time: newTime, big_mac: newBig_Mac};

                // 新增到json中
                insert_json(newClient);

                // 將購買資訊放到確認窗口中
                var big_mac_num = document.querySelector('.number' + newId);
                big_mac_num.textContent = newBig_Mac;
                
                // 新增到時間戳裡
                // time_block(newId, newTime);
            }
        })
        .catch(error => console.error('Error:', error));
}

// 隨機生成顧客
function randomIntervalGeneClient() {
    // 首先執行 gene_client 函數
    gene_client();

    // 然後計算下一次執行的隨機時間
    var nextInterval = getRand(customer_freq[0], customer_freq[1])*1000;
    // console.log("Next generate time: " + nextInterval);

    // 使用 setTimeout 在隨機時間後再次調用自己
    setTimeout(randomIntervalGeneClient, nextInterval);
}
// 初始調用
randomIntervalGeneClient();

// 顧客倒數計時
// 儲存計時器的ID
let intervals = {};

function time_block() {
    for (let i = 1; i <= 5; i++) {
        let timeElement = document.querySelector('.time' + i);

        if (timeElement && timeElement.id === "show") {
            if (!intervals[i]) {
                intervals[i] = setInterval(function() {
                    // 每次迭代重新獲取時間元素，以確保它是最新的
                    timeElement = document.querySelector('.time' + i + '.time_p');
                    if (timeElement) {
                        let currentTime = parseInt(timeElement.textContent);
                        if (currentTime > 0) {
                            timeElement.textContent = currentTime - 1;
                        } else {
                            // console.log("被趕跑的顧客" + i);
                            finish_client(i.toString()); // 時間到，顧客被趕跑了
                            clearInterval(intervals[i]);
                            intervals[i] = null; 
                            compensate();  
                        }
                    } else {
                        clearInterval(intervals[i]);
                        intervals[i] = null;
                    }
                }, 1000);
            }
        } else if (intervals[i]) {
            clearInterval(intervals[i]);
            intervals[i] = null;
        }
    }
}

// 持續運行 time_block 函數
setInterval(time_block, 1000);

// 顧客時間到離開的懲罰
function compensate(){
    // 發送請求以獲取info.json資訊
    fetch('/getinfoData')
    .then(response => response.json())
    .then(data => {
        // 取info數據
        let info = data.info[0];
        info.money = parseInt(info.money) - 100;        
        // console.log(info.money);

        // 更新 info.json 文件中的數據
        fetch('/updateCompensateData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                info: info, 
            }) // 發送更新後的info.json數據
        })
        .then(response => response.text())
        .then(updateResponse => {
            console.log(updateResponse);
        })
        .catch(error => console.error('Error:', error));

        // 檢查是否結束
        end(info.money, info.customer);
    })
    .catch(error => console.error('Error:', error));
}

// 對話框被取消鍵
document.addEventListener('DOMContentLoaded', function() {
    // 獲取 class 為 "cancel1" 的元素
    var cancelButton = document.querySelector('.cancel1');
    if (cancelButton) {
        // 為該元素添加點擊事件監聽器
        cancelButton.addEventListener('click', function() {
            // console.log("click " + cancelButton.className);
            // 獲取 class 為 "window1" 的元素
            var windowElement = document.querySelector('.window1');
            if (windowElement) {
                // 更改 id 為 "hidden"
                windowElement.id = "hidden";
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // 獲取 class 為 "cancel2" 的元素
    var cancelButton = document.querySelector('.cancel2');
    if (cancelButton) {
        // 為該元素添加點擊事件監聽器
        cancelButton.addEventListener('click', function() {
            // 獲取 class 為 "window2" 的元素
            var windowElement = document.querySelector('.window2');
            if (windowElement) {
                // 更改 id 為 "hidden"
                windowElement.id = 'hidden';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // 獲取 class 為 "cancel3" 的元素
    var cancelButton = document.querySelector('.cancel3');
    if (cancelButton) {
        // 為該元素添加點擊事件監聽器
        cancelButton.addEventListener('click', function() {
            // 獲取 class 為 "window3" 的元素
            var windowElement = document.querySelector('.window3');
            if (windowElement) {
                // 更改 id 為 "hidden"
                windowElement.id = 'hidden';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // 獲取 class 為 "cancel4" 的元素
    var cancelButton = document.querySelector('.cancel4');
    if (cancelButton) {
        // 為該元素添加點擊事件監聽器
        cancelButton.addEventListener('click', function() {
            // 獲取 class 為 "window4" 的元素
            var windowElement = document.querySelector('.window4');
            if (windowElement) {
                // 更改 id 為 "hidden"
                windowElement.id = 'hidden';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // 獲取 class 為 "cancel5" 的元素
    var cancelButton = document.querySelector('.cancel5');
    if (cancelButton) {
        // 為該元素添加點擊事件監聽器
        cancelButton.addEventListener('click', function() {
            // 獲取 class 為 "window5" 的元素
            var windowElement = document.querySelector('.window5');
            if (windowElement) {
                // 更改 id 為 "hidden"
                windowElement.id = 'hidden';
            }
        });
    }
});

// 按確定時確認訂單
function confirm_bill(id){
    // 發送請求以獲取 merchendise 數據
    fetch('/getinfoData')
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            // 假設只有一個玩家的數據，取merchendise數據
            let merchendise = data.merchendise[0];
            let bigMacCount = parseInt(merchendise.big_mac);
            let mcChCount = merchendise.Mc_ch;

            // 取info數據
            let info = data.info[0];
            let money = info.money;
            let customer = info.customer;

            let require = parseInt(document.querySelector('.number' + id).textContent);
            console.log(require);

            // 檢查 big_mac 的數量
            if (bigMacCount >= require) {
                finish_client(id.toString());

                // 計算剩餘大麥客數
                bigMacCount = parseInt(bigMacCount - require);
                var me_big_mac = document.querySelector(".big_mac");
                me_big_mac.textContent = bigMacCount;
                console.log("remain num: " + bigMacCount);
                merchendise.big_mac = bigMacCount;


                //計算金錢量
                money += require * big_mac_price;
                customer += 1;
                var me_money = document.querySelector(".money");
                me_money.textContent = money;
                info.money = money;
                info.customer = customer;

                // 更新 info.json 文件中的數據
                fetch('/updateConfirmData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        info: info, 
                        merchendise: merchendise 
                    }) // 發送更新後的material 和 merchendise數據
                })
                .then(response => response.text())
                .then(updateResponse => {
                    console.log(updateResponse);
                })
                .catch(error => console.error('Error:', error));
                
                // 檢查是否結束
                end(info.money, info.customer);

            } else {
                alert('數量不足，請去補貨');
            }
        })
        .catch(error => console.error('Error:', error));
}

// 當點擊確認鍵時
document.addEventListener('DOMContentLoaded', function() {
    var window = document.querySelectorAll('.window_mid');
    // 為每個 div 添加點擊事件監聽器
    window.forEach(function(div, index) {
        var confirm =  div.querySelector('.confirm' + (index + 1));
        confirm.addEventListener('click', function() {
            id = (index + 1);
            confirm_bill(id);
        });
    });
});

// 清單
document.addEventListener('DOMContentLoaded', function() {
    // 獲取賬單圖標和相關元素
    var bill_icon = document.querySelector('.bill');
    var info_Mid = document.querySelector('.me_info_mid');
    var workplaceBasis = document.querySelector('.workplace_basis');

    // 點擊賬單圖標時顯示或隱藏信息
    bill_icon.addEventListener('click', function() {
        if (info_Mid.id === 'hidden') {

            // 發送請求以獲取info.json資訊
            fetch('/getinfoData')
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                // 假設只有一個玩家的數據，取merchendise數據
                let merchendise = data.merchendise[0];
                let bigMacCount = parseInt(merchendise.big_mac);
                let mcChCount = merchendise.Mc_ch;

                // 取info數據
                let info = data.info[0];
                let money = info.money;
                let customer = info.customer;

                // 輸入至清單當中
                document.querySelector('.money').textContent = money;
                document.querySelector('.big_mac').textContent = bigMacCount;
                document.querySelector('.Mc_ch').textContent = mcChCount;
                document.querySelector('.clientCount').textContent = customer;
                

            })
            .catch(error => console.error('Error:', error));
            
            // 顯示清單，隱藏背景
            info_Mid.id = 'show';
            workplaceBasis.id = 'transparent';
        } else {
            // 顯示背景，隱藏清單
            info_Mid.id = 'hidden';
            workplaceBasis.id = '';
        }
    });

    // 點擊 body 的任意位置隱藏信息
    document.body.addEventListener('click', function(event) {
        // 檢查點擊是否發生在 bill_icon 或 info_Mid 內部
        if (!bill_icon.contains(event.target) && !info_Mid.contains(event.target)) {
            info_Mid.id = 'hidden';
            workplaceBasis.id = '';
        }
    });
});

// 頁面跳轉
// 當門被點擊時，跳轉到area_source.html
document.addEventListener('DOMContentLoaded', function() {
    var door = document.querySelector('.door');
    if (door) {
        door.addEventListener('click', function() {
            // 儲存時間資訊
            updateTime();

            // 使用 AJAX 發送請求
            fetch('/gotoSourcePage')
                .then(response => {
                    if (response.redirected) {
                        window.location.href = response.url;
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    }
});

//當點擊後面的製作物件時，跳轉到menu_page.html
document.addEventListener('DOMContentLoaded', function() {
    var makeElements = document.querySelectorAll('.make_food');

    makeElements.forEach(function(make) {
        make.addEventListener('click', function() {
            // 儲存時間資訊
            updateTime();

            // 使用 AJAX 發送請求
            fetch('/gotoMenuPage')
                .then(response => {
                    if (response.redirected) {
                        window.location.href = response.url;
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    });
});

function updateTime() {
    fetch('/data/ts')
        .then(response => response.json())
        .then(data => {
            let client = data.client;
            let length = client.length;

            for (var i = 0; i < length; i++) {
                var timeElement = document.querySelector('.time' + (i + 1));
                if (timeElement) {
                    client[i].time = timeElement.textContent;
                }
            }

            // 更新 info.json 文件中的數據
            fetch('/updateTimeData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ client: client })
            })
            .then(response => response.text())
            .then(updateResponse => {
                console.log(updateResponse);
            })
            .catch(error => console.error('Error:', error));
        })
        .catch(error => console.error('Error:', error));
}