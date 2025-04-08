window.addEventListener('DOMContentLoaded', function() {
    start();    
});

// 讓角色能夠左右移動
document.addEventListener('DOMContentLoaded', function() {
    var character = document.querySelector('.charecter');
    var ground = document.querySelector('.the_ground');
    var leftPos = character.offsetLeft; // 角色當前的左側位置

    document.addEventListener('keydown', function(event) {
        // 地圖空間
        var groundRect = ground.getBoundingClientRect();
        // 記住角色的寬度
        var charWidth = character.offsetWidth;
        
        if (event.key === "ArrowLeft") {
            // 按左鍵時向左移動
            character.src = "../img/catch_game/padoru_left.png";
            leftPos -= 20; // 調整這個值以改變移動距離

            if (leftPos < groundRect.left) {
                leftPos = groundRect.left; // 防止移出左邊界
            }
        } else if (event.key === "ArrowRight") {
            // 按右鍵時向右移動
            character.src = "../img/catch_game/padoru_right.png";
            leftPos += 20; // 調整這個值以改變移動距離
            if (leftPos + charWidth > groundRect.right) {
                leftPos = groundRect.right - charWidth; // 防止移出右邊界
            }
        }

        character.style.left = leftPos + 'px'; // 更新角色的位置
    });
});

function start(){

    // 顯示遊戲
    let info = document.querySelector('.info');
    let game = document.querySelector('.game_mid');
    info.id = "hidden";
    game.id = "";


    //亂數生成番茄
    function RandTomato(tomato) {
        // 抓取番茄在的div區域
        var tomatoContainer = document.querySelector('.tomato');
        var newTomato = document.createElement('img');
        // 如果隨機數大於990 則產生金色番茄(分數比較高)
        if (tomato === 'gold_tomato') {
            newTomato.src = '../img/catch_game/golden_tomato.png';
            newTomato.alt = '掉落番茄';
            newTomato.className = 'falling_tomato';
            newTomato.classList.add(1000);
        } else if (tomato === 'bad_tomato') {
            newTomato.src = '../img/catch_game/bad_tomato.png';
            newTomato.alt = '掉落番茄';
            newTomato.className = 'falling_tomato';
            newTomato.classList.add(-100);
        }else {
            newTomato.src = '../img/material/tomato.png';
            newTomato.alt = '掉落番茄';
            newTomato.className = 'falling_tomato';
            newTomato.classList.add(getRand(5,50));
        }         
        // 隨機產生 X 軸位置
        var maxX = tomatoContainer.offsetWidth;
        var randomX = Math.random() * maxX;
        newTomato.style.left = randomX + 'px';

        // 添加到容器中
        tomatoContainer.appendChild(newTomato);
        var bodyRect = document.body.getBoundingClientRect();
        
        // 以每100毫秒檢查一次
        var checkPositionInterval = setInterval(function() {
            var tomatoRect = newTomato.getBoundingClientRect();
            if (tomatoRect.top > bodyRect.bottom) {
                newTomato.remove(); // 當位置掉出body時，刪除其(為撞到較角色的情況下)
                clearInterval(checkPositionInterval); // 清除定時器
            }
        }, 100);    
    }

    // 碰撞機制
    function ifcollision(){
        var tomatoes = document.querySelectorAll('.falling_tomato');
        var character = document.querySelector('.charecter');
        var characterRect = character.getBoundingClientRect();

        tomatoes.forEach(function(tomato) {
            var tomatoRect = tomato.getBoundingClientRect();

            // 檢查是否發生碰撞
            if (tomatoRect.left < characterRect.right &&
                tomatoRect.right > characterRect.left &&
                tomatoRect.top < characterRect.bottom &&
                tomatoRect.bottom > characterRect.top) {

                
                // 加分
                var point_tomato = tomato.className.split(' ');
                point_tomato = parseInt(point_tomato[point_tomato.length - 1]);
                var point = document.querySelector(".point_txt");
                point.textContent =  parseInt(point.textContent) + point_tomato;


                // 發生碰撞，移除番茄
                tomato.remove();
                
            }
        });
    }setInterval(ifcollision, 100);//每100毫秒偵測一次

    function generateRandomTomato() {
        var r = getRand(1, 1000);
        console.log(r);
        if (r >= 800) {
            // 產生金色番茄
            RandTomato('gold_tomato');
        }else if (r <= 200){
            RandTomato('bad_tomato');
        } else {
            RandTomato('origin_tomato');
        }
    
        // 在10到2000毫秒後再次調用此函數
        var nextInterval = 30 * getRand(1, 200);
        setTimeout(generateRandomTomato, nextInterval);
    }generateRandomTomato();
        
    setTimeout(() => {
        end();
        window.clearInterval(timeset);
    }, 30000);

}


function end() {

    let info_point = document.querySelector('.info_point_txt');
    let info_tomato = document.querySelector('.info_tomato_txt');
    // 從後端獲取 material 數據
    fetch('/getinfoData')
        .then(response => response.json())
        .then(data => {
            // 抓material
            let material = data.material[0];
            let tomatoCount = material.tomato;

            // 獲取頁面上 point_txt 的數值
            let pointTxt = document.querySelector('.point_txt').textContent;
            let currentPoints = Math.floor(parseInt(pointTxt)/10);

            //更新結果數據
            info_point.textContent = pointTxt;
            info_tomato.textContent = currentPoints

            // 進行加總
            let totalTomatoes = tomatoCount + currentPoints;

            // 更新 material 中的 tomato 數據
            material.tomato = totalTomatoes;

            // 將更新後的數據發送回後端
            fetch('/updateMaterialData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ material: material }) // 發送更新後的 material 數據
            })
            .then(response => response.text())
            .then(updateResponse => {
                console.log(updateResponse);
                // 在這裡您可以添加額外的代碼來處理響應
            })
            .catch(error => console.error('Error:', error));
        })
        .catch(error => console.error('Error:', error));

        let info = document.querySelector('.info');
        let game = document.querySelector('.game_mid');

        // 顯示結束清單
        info.id = "show";
        game.id = "transparent";

        // 3秒後回到首頁
        setTimeout(() => {
            gotoWorkPage();
        }, 3000);
}

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

// 隨機函式 1~max中間的數值
function getRand(s, t){
    let i = Math.floor(Math.random() * (t - s + 1) + s) ; 
    // console.log(i);
    return i;
}





