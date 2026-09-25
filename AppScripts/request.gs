const SHEET_NAME = "Survey Data";

function doPost(e) {
  try {
    let data;
    // Xử lý request payload (thường UI sẽ gửi JSON stringify qua fetch POST mode no-cors)
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.getSheets()[0]; // Fallback lấy sheet đầu tiên nếu không tìm thấy
    }
    
    // Dùng ID do UI gửi lên, nếu không có thì tự tạo UUID
    const submissionId = data.submission_id || Utilities.getUuid();
    
    // Nếu checkbox gửi lên là array thì join thành string
    let targetRegion = data.target_region || "";
    if (Array.isArray(targetRegion)) {
      targetRegion = targetRegion.join(", ");
    }
    
    const rowData = [
      new Date(),
      submissionId,
      data.brand_name || "",
      data.brand_story || "",
      data.menu_link || "",
      data.product_categorization || "",
      data.mushroom_source || "",
      data.mushroom_source_other_text || "",
      targetRegion,
      data.photo_readiness || "",
      data.link_assets_logo || "",
      data.link_assets_packaging || "",
      data.link_assets_feedback || "",
      data.link_assets_certificates || "",
      data.restaurant_partners || "",
      data.partner_consent || "",
      data.flow_b2b || "",
      data.flow_b2c || "",
      data.shipping_zones || "",
      data.shipping_fees || "",
      data.additional_notes || "",
      data.public_pricing || "",
      data.special_pricing || ""
    ];
    
    sheet.appendRow(rowData);
    
    // Sử dụng CacheService để lưu cờ "SUCCESS" theo submission_id trong 10 phút.
    // Việc này giúp hàm doGet có thể kiểm tra được trạng thái post cực nhanh.
    const cache = CacheService.getScriptCache();
    cache.put(submissionId, "SUCCESS", 600);
    
    // Trả về JSON, nhưng nếu frontend dùng no-cors sẽ không đọc được. 
    // Chúng ta vẫn trả về đúng format.
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      submission_id: submissionId 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const submissionId = e.parameter.submission_id;
  
  if (!submissionId) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: "Vui lòng cung cấp submission_id" 
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const cache = CacheService.getScriptCache();
  const status = cache.get(submissionId);
  
  if (status === "SUCCESS") {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success",
      submission_id: submissionId
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // Nếu muốn chắc chắn 100%, bạn có thể viết thêm logic query trong Sheet 
  // bằng cách loop qua column B (Submission ID). Ở đây trả về pending cho đơn giản.
  return ContentService.createTextOutput(JSON.stringify({ 
    status: "pending",
    submission_id: submissionId
  })).setMimeType(ContentService.MimeType.JSON);
}
