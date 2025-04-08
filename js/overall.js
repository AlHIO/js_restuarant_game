// 當頁面載入完成時調用 load 函數
document.addEventListener('DOMContentLoaded', load);

function load() {
    // 從後端獲取 info json 數據
    fetch('/getinfoData')
        .then(response => response.json())
        .then(data => {
            let materials = data.material[0]; // 讀 material 數據

            // 更新生菜的數量
            let lettuceCount = materials.lettuce;
            document.querySelector('.lettuce_number').textContent = lettuceCount;

            // 更新番茄的數量
            let tomatoCount = materials.tomato;
            document.querySelector('.tomato_number').textContent = tomatoCount;

            // 更新牛肉的數量
            let beefCount = materials.beef;
            document.querySelector('.beef_number').textContent = beefCount;
        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    var up = document.querySelector('.plus');
    var down = document.querySelector('.minus');
    var num = document.querySelector('.num_txt');

    // 抓清單內的材料
    var lettuce = document.querySelector('.lettuce_number');
    var tomato = document.querySelector('.tomato_number');
    var beef = document.querySelector('.beef_number');

    up.addEventListener('click', function() {
        var currentValue = parseInt(num.textContent, 10);
        var num_lettuce = parseInt(lettuce.textContent);
        var num_tomato = parseInt(tomato.textContent);
        var num_beef = parseInt(beef.textContent);
        if (!isNaN(currentValue) && num_lettuce >= 3 && num_tomato >= 4 && num_beef >= 2) {
            num.textContent = currentValue + 1;
            lettuce.textContent -= 3;
            tomato.textContent -= 4;
            beef.textContent -= 2;
        }
    });

    down.addEventListener('click', function() {
        var currentValue = parseInt(num.textContent, 10);
        if (currentValue > 0) {
            num.textContent = currentValue - 1;
            lettuce.textContent = parseInt(lettuce.textContent) + 3;
            tomato.textContent = parseInt(tomato.textContent) + 4;
            beef.textContent = parseInt(beef.textContent) + 2;
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    var bigMacButton = document.querySelector('.big_mac.button');
    
    bigMacButton.addEventListener('click', function() {
        var numBigMacs = parseInt(document.querySelector('.num_txt').textContent, 10);
        var numLettuce = parseInt(document.querySelector('.lettuce_number').textContent, 10);
        var numTomato = parseInt(document.querySelector('.tomato_number').textContent, 10);
        var numBeef = parseInt(document.querySelector('.beef_number').textContent, 10);
        // console.log(numLettuce,numTomato,numBeef);

        console.log('開始製作');

        // 從後端獲取 material 數據
        fetch('/getinfoData')
        .then(response => response.json())
        .then(data => {
            // 抓material
            let material = data.material[0];
            let tomatoCount = material.tomato;
            let lettuceCount = material.lettuce;
            let beefCount = material.beef;
            // console.log(tomatoCount,lettuceCount,beefCount);

            let merchendise = data.merchendise[0];
            let big_macCount = merchendise.big_mac;

            // 加總製作大麥克數
            let totalBig_mac = big_macCount + numBigMacs;

            // 更新 material 中的 tomato 數據
            material.tomato = numTomato;
            material.lettuce = numLettuce;
            material.beef = numBeef;
            merchendise.big_mac = totalBig_mac;

            // console.log(material);

            fetch('/updateInfoOverallData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    material: material, 
                    merchendise: merchendise 
                }) // 發送更新後的 material 和 merchendise 數據
            })
            .then(response => response.text())
            .then(updateResponse => {
                console.log(updateResponse);
                // 在這裡您可以添加額外的代碼來處理響應
            })
            .catch(error => console.error('Error:', error));

        })
        .catch(error => console.error('Error:', error));

        // 回首頁
        gotoWorkPage();
    });
});


function gotoWorkPage(){
    // 回到workplace頁面
    fetch('/gotoWorkPage')
            .then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                }
            })
            .catch(error => console.error('Error:', error));

}
