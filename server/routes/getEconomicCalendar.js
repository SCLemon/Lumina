const axios = require('axios');
const fs = require('fs');
const { JSDOM } = require('jsdom');

async function fetchEconomicCalendarData() {
    try {
        // 發送請求獲取經濟日曆數據
        const response = await axios.post(
            'https://hk.investing.com/economic-calendar/Service/getCalendarFilteredData',
            'country%5B%5D=5&importance%5B%5D=3&timeZone=28&timeFilter=timeRemain&currentTab=thisWeek&limit_from=0',
            {
                headers: {
                    'accept': '*/*',
                    'accept-language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
                    'content-type': 'application/x-www-form-urlencoded',
                    'priority': 'u=1, i',
                    'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'x-requested-with': 'XMLHttpRequest',
                    'Referer': 'https://hk.investing.com/economic-calendar/',
                    'Referrer-Policy': 'strict-origin-when-cross-origin',
                    // 添加 User-Agent 以模擬真實瀏覽器
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
                }
            }
        );

        if (response.data && response.data.data) {
            const events = parseHTML(response.data.data);
            return events;
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
        // 添加表格標籤以便正確解析 tr 元素
        const dom = new JSDOM('<table>' + html + '</table>');
        const document = dom.window.document;
        
        // 查詢所有事件行
        const rows = document.querySelectorAll('tr.js-event-item');
        
        // 創建數組來存儲解析後的數據
        const events = [];
        
        rows.forEach((row, index) => {
            try {
                // 提取每行的重要數據
                const dateTime = row.getAttribute('data-event-datetime') || '';
                
                // 使用可選鏈和空值合併運算符增強代碼健壯性
                const time = row.querySelector('.js-time')?.textContent?.trim() || '';
                
                // 提取事件名稱
                const eventElement = row.querySelector('.event a');
                const eventName = eventElement ? eventElement.textContent.trim() : '';
                
                // 提取實際值、預測值和前值
                const actual = row.querySelector('[id^="eventActual_"]')?.textContent?.trim() || '';
                const forecast = row.querySelector('[id^="eventForecast_"]')?.textContent?.trim() || '';
                const previous = row.querySelector('[id^="eventPrevious_"]')?.textContent?.trim().replace(/\s+/g, ' ') || '';
                
                // 創建此事件的結構化對象
                events.push({
                    dateTime: dateTime.split(' ')[0],
                    time: time,
                    name: eventName,
                    actual: actual,
                    forecast: forecast,
                    previous: previous
                });
            } 
            catch (rowError) {}
        });
        
        return events;
    } catch (parseError) {
        return [];
    }
}

async function getEconomicCalendar() {
    try {
        // 獲取經濟日曆數據
        const events = await fetchEconomicCalendarData();
        return JSON.stringify(events)

    } catch (error) {
        return []
    }
}

module.exports = {
    getEconomicCalendar
}