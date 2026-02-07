$(document).ready(function() {
    
    // ฟังก์ชันเช็คเลขบัตรประชาชน
    function checkThaiID(id) {
        if (id.length != 13) return false;
        var sum = 0;
        for (var i = 0; i < 12; i++) {
            sum += parseFloat(id.charAt(i)) * (13 - i);
        }
        var result = (11 - sum % 11) % 10;
        return result == parseFloat(id.charAt(12));
    }

    // ฟังก์ชันเช็คอีเมล
    function validateEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // ดักจับเหตุการณ์เมื่อกดปุ่ม Submit
    $('#checkForm').submit(function(e) {
        
        e.preventDefault(); 
        
        ดึงค่าจากฟอร์ม
        var idCard = $('#id_card').val();
        var email = $('#email').val();
        var province = $('#province').val(); // เช็คจังหวัดด้วยว่าเลือกหรือยัง
        
        var resultDiv = $('#resultMessage');
        var errorMsg = "";

        // ตรวจสอบ (Validation)
        
        // เช็คบัตรประชาชน
        if (!checkThaiID(idCard)) {
            errorMsg = "❌ เลขบัตรประชาชนไม่ถูกต้อง";
        }
        // เช็คอีเมล
        else if (!validateEmail(email)) {
            errorMsg = "❌ รูปแบบอีเมลไม่ถูกต้อง";
        }
        // เช็คจังหวัด (เผื่อไว้)
        else if (province === "") {
            errorMsg = "❌ กรุณาเลือกจังหวัด";
        }

        // 4. แสดงผลลัพธ์
        if (errorMsg !== "") {
            // กรณีผิดพลาด (Error)
            resultDiv.html('<div class="error-box">' + errorMsg + '</div>');
        } else {
            // กรณีผ่านฉลุย (Success)
            resultDiv.html('<div class="success-box">✅ ข้อมูลถูกต้องครบถ้วน!</div>');    
        }
    });

    // --- ส่วนจัดการ Dark Mode ---
    
    const themeBtn = $('#theme-toggle');
    const body = $('body');
    const sunIcon = $('#sun-icon');
    const moonIcon = $('#moon-icon');

    // เช็คว่าเคยเลือก Dark Mode ไว้ไหม (จาก LocalStorage)
    if (localStorage.getItem('theme') === 'dark') {
        body.addClass('dark-mode');
        sunIcon.show();
        moonIcon.hide();
    }

    
    themeBtn.click(function() {
        body.toggleClass('dark-mode');

        if (body.hasClass('dark-mode')) {
            // ถ้าเป็น Dark
            localStorage.setItem('theme', 'dark'); // จำค่า
            sunIcon.show();
            moonIcon.hide();
        } else {
            // ถ้าเป็น Light
            localStorage.setItem('theme', 'light'); // จำค่า
            sunIcon.hide();
            moonIcon.show();
        }
    });
});

// --- Mouse Tracking Glow Effect ---
    
    // จับเหตุการณ์เมาส์ขยับบนตัวที่มีคลาส .glow-box ทุกตัว
    $(document).on('mousemove', '.glow-box', function(e) {
        
        // หาตำแหน่งของกล่องเทียบกับหน้าจอ
        var rect = this.getBoundingClientRect();
        
        // คำนวณตำแหน่งเมาส์ (X, Y) ภายในกล่อง
        // (ตำแหน่งเมาส์รวม - ตำแหน่งขอบซ้าย/บนของกล่อง)
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        // ส่งค่าไปให้ CSS (อัปเดตตัวแปร --x และ --y)
        this.style.setProperty('--x', x + 'px');
        this.style.setProperty('--y', y + 'px');
    });