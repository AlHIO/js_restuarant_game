const tometo_fee = 50; // 出門採番茄的車費

// 當點擊產地時
document.addEventListener('DOMContentLoaded', function() {
    var click = document.querySelector('.tomato_area');
    if (click) {
        click.addEventListener('click', function() {
            // 當出發前往採草莓時，車費為tometo_fee的錢
            // 發送請求以獲取info.json資訊
            fetch('/getinfoData')
            .then(response => response.json())
            .then(data => {
                // 取info數據
                let info = data.info[0];
                info.money = parseInt(info.money) - 50;        
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

            // 使用 AJAX 發送請求
            fetch('/gotocatch_game')
                .then(response => {
                    if (response.redirected) {
                        window.location.href = response.url;
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var click = document.querySelector('.back');
    if (click) {
        click.addEventListener('click', function() {
            // 使用 AJAX 發送請求
            fetch('/gotoMenuPage')
                .then(response => {
                    if (response.redirected) {
                        window.location.href = response.url;
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    }
});