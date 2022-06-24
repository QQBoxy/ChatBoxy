var ss = SpreadsheetApp.getActiveSpreadsheet();
var sheet = ss.getSheetByName("ChatRecord");

function doGet(e) {
    // 存放 get 所有傳送的參數
    var para = e.parameter;
    var method = para.method;

    if (method == "write") {
        write_data(para);
        return ContentService.createTextOutput('Done');
    }
    if (method == "read") {
        return read_data(para);
    }
}

function write_data(para) {
    var time = new Date();
    var name = `${para.name}`;
    var content = `${para.content}`;
    var value = [time, name, content];
    // 插入一列新的資料
    var rng = sheet.getRange(sheet.getLastRow() + 1, 1, 1, value.length);
    rng.setNumberFormats([['@', '@', '@']]);
    rng.setValues([value]);
}

function read_data(para = {}) {
    var limit = para.limit ? para.limit : 10;
    var offset = para.offset ? para.offset : 0;
    // 總列數
    var rowLength = sheet.getLastRow() - 1;
    // 起始欄位
    var rowStart = rowLength + 2 - limit - offset * limit;
    // 取得儲存格資料
    var allData = sheet.getRange(
        rowStart, 1, limit, 3
    ).getValues().reverse(); // 倒序
    var data = [];
    var i = 0;
    // 資料整理
    for (i in allData) {
        data.push({
            "time": allData[i][0],
            "name": allData[i][1],
            "content": allData[i][2]
        });
    }
    // 響應
    return ContentService.createTextOutput(JSON.stringify({
        "data": data, "count": rowLength
    }));
}