const axios = require('axios');
const fs = require('fs')
const { JSDOM } = require('jsdom');

async function fetchExchangeRate() {
    try {
        const response = await axios.get('https://rate.bot.com.tw/xrt?Lang=zh-TW');
        if (response.data) {
            const results = parseHTML(response.data);
            return results;
        } 
        else {
            return [];
        }
    } catch (error) {
        return [];
    }
}

function parseHTML(html) {
    try {

        const dom = new JSDOM(html);
        const document = dom.window.document;
        
        const rows = document.querySelectorAll('table[title="牌告匯率"] tbody tr');
        
        const results = [];

        rows.forEach(row => {
            const cells = row.querySelectorAll("td");
            if (cells.length < 5) return;

            const currencyName = cells[0].textContent.trim().replace(/\s+/g, " ");
            const cashBuy = cells[1].textContent.trim();
            const cashSell = cells[2].textContent.trim();
            const spotBuy = cells[3].textContent.trim();
            const spotSell = cells[4].textContent.trim();

            results.push({
                "flag":currencyName.split(' ')[1].slice(1,-1),
                "currency": currencyName.split(' ')[0]+currencyName.split(' ')[1],
                "cashBuy": cashBuy,
                "cashSell": cashSell,
                "spotBuy": spotBuy,
                "spotSell": spotSell
            });
        });

        return results;
    } catch (parseError) {
        return [];
    }
}

async function getExchangeRate() {
    try {
        // 獲取經濟日曆數據
        const results = await fetchExchangeRate();
        return JSON.stringify(results)

    } catch (error) {
        return []
    }
}

module.exports = {
    getExchangeRate
}