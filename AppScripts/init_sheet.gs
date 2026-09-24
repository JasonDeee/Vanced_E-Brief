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
    "Ghi chú thêm"
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
