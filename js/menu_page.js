// 頁面跳轉
//當點擊大麥克時，跳轉到big_mac_overall.html
document.addEventListener('DOMContentLoaded', function() {
    var click = document.querySelector('.big_mac.burgerclick');
    if (click) {
        click.addEventListener('click', function() {
            // 使用 AJAX 發送請求
            fetch('/gotobig_mac')
                .then(response => {
                    if (response.redirected) {
                        window.location.href = response.url;
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    }
});

// 當點擊麥香雞時，跳轉到Mc_ch_overall.html
document.addEventListener('DOMContentLoaded', function() {
    var click = document.querySelector('.Mc_ch.burgerclick');
    if (click) {
        click.addEventListener('click', function() {
            // 使用 AJAX 發送請求
            fetch('/gotoMc_ch')
                .then(response => {
                    if (response.redirected) {
                        window.location.href = response.url;
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    }
});

// 當點擊返回時
document.addEventListener('DOMContentLoaded', function() {
    var click = document.querySelector('.back');
    if (click) {
        click.addEventListener('click', function() {
            // 使用 AJAX 發送請求
            fetch('/gotoWorkPage')
                .then(response => {
                    if (response.redirected) {
                        window.location.href = response.url;
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    }
});

