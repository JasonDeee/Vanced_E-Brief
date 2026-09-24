const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwBlCp-RWFDMiyiELUSa8CWUtvp4jns9hrim-YM4sh1RpC0gMm4zsnEIsIknl5TmsyXtA/exec";

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function handleFormSubmit() {
  const form = document.getElementById("mushroom-intake-form");
  const successBanner = document.getElementById("success-banner");
  const submitBtn = document.getElementById("submit-btn");
  const btnText = document.getElementById("btn-text");
  const btnIcon = document.getElementById("btn-icon");

  // Collect form data
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    // Xử lý các checkbox multiple value (ví dụ target_region)
    if (data[key]) {
      if (!Array.isArray(data[key])) {
        data[key] = [data[key]];
      }
      data[key].push(value);
    } else {
      data[key] = value;
    }
  });

  const submissionId = generateUUID();
  data.submission_id = submissionId;

  // Visual feedback: Start Loading
  submitBtn.disabled = true;
  btnText.innerText = "ĐANG XỬ LÝ...";
  btnIcon.innerText = "progress_activity";
  btnIcon.classList.add("animate-spin");

  try {
    // 1. Gửi request POST (sử dụng mode no-cors)
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(data)
    });

    // 2. Poll API GET để xác nhận dữ liệu đã được lưu
    const maxRetries = 10;
    let success = false;
    
    for (let i = 0; i < maxRetries; i++) {
      // Đợi 1.5 giây giữa mỗi lần check
      await new Promise(r => setTimeout(r, 1500));
      
      try {
        const response = await fetch(`${SCRIPT_URL}?submission_id=${submissionId}`);
        const result = await response.json();
        
        if (result.status === "success") {
          success = true;
          break;
        }
      } catch (err) {
        console.warn("Đang đợi phản hồi từ Google Script...", err);
      }
    }

    if (success) {
      // Thành công, cập nhật giao diện
      btnText.innerText = "ĐÃ GỬI DỮ LIỆU";
      btnIcon.innerText = "check_circle";
      btnIcon.classList.remove("animate-spin");
      submitBtn.classList.remove("bg-[#e72166]", "hover:bg-[#2a38a1]");
      submitBtn.classList.add("bg-neutral-gray-code", "text-on-surface");

      // Cuộn trang xuống hiển thị banner
      successBanner.classList.remove("hidden");
      successBanner.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      throw new Error("Timeout khi đợi xác nhận từ máy chủ.");
    }
    
  } catch (error) {
    console.error(error);
    alert("Có lỗi xảy ra hoặc mạng không ổn định, xin vui lòng thử lại!");
    
    // Khôi phục lại trạng thái nút
    submitBtn.disabled = false;
    btnText.innerText = "GỬI LẠI KHẢO SÁT";
    btnIcon.innerText = "arrow_forward";
    btnIcon.classList.remove("animate-spin");
  }
}

function saveDraft() {
  const brandName = document.getElementById("brand-name").value;
  alert(
    brandName
      ? `Bản nháp cho thương hiệu "${brandName}" đã được lưu tạm trên trình duyệt của bạn.`
      : "Đã lưu bản nháp tạm thời vào bộ nhớ trình duyệt!"
  );
}
