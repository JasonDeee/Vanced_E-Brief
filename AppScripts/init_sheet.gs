function initMushroomSurveySheet() {
  const sheetName = "Survey Data";
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  // Nếu chưa có sheet thì tạo mới
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  
  const headers = [
    "Timestamp",
    "Submission ID",
    "Tên thương hiệu",
    "Câu chuyện thương hiệu",
    "Link Menu",
    "Danh mục sản phẩm",
    "Nguồn gốc nấm",
    "Nguồn gốc khác",
    "Khu vực phục vụ",
    "Tư liệu hình ảnh",
    "Link Logo",
    "Link Bao bì",
    "Link Feedback",
    "Link Giấy chứng nhận",
    "Đối tác nhà hàng",
    "Quyền công bố đối tác",
    "Luồng B2B",
    "Luồng B2C",
    "CS Giao hàng",
    "Phí Ship",
    "Ghi chú thêm",
    "Công khai giá",
    "Giá đặc biệt"
  ];
  
  // Kiểm tra nếu chưa có header thì mới chèn để tránh ghi đè dữ liệu cũ
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e11a62").setFontColor("white");
    sheet.setFrozenRows(1);
    
    // Tự động điều chỉnh kích thước cột (tương đối)
    sheet.autoResizeColumns(1, headers.length);
  }
}

function addPricingColumns() {
  const sheetName = "Survey Data";
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) return;
  
  const lastCol = sheet.getLastColumn();
  
  // Đọc header hiện tại để tránh duplicate
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const newCols = ["Công khai giá", "Giá đặc biệt"];
  
  if (headers.indexOf(newCols[0]) === -1) {
    sheet.getRange(1, lastCol + 1, 1, 2).setValues([newCols])
      .setFontWeight("bold")
      .setBackground("#e11a62")
      .setFontColor("white");
    sheet.autoResizeColumns(lastCol + 1, 2);
  }
}
