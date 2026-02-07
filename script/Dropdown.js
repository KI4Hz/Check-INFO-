$(document).ready(function() {
    console.log("กำลังโหลดข้อมูล...");

    $.getJSON('https://raw.githubusercontent.com/earthchie/jquery.Thailand.js/master/jquery.Thailand.js/database/raw_database/raw_database.json', function(data) {
        
        console.log("โหลดข้อมูลสำเร็จ!");

        var provinceSelect = $('#province');
        var amphoeSelect = $('#district');
        var tambonSelect = $('#sub_district');
        var zipcodeInput = $('#zip_code');

        function getProv(item) { return item.province; }
        function getAmphoe(item) { return item.amphoe; }
        function getTambon(item) { return item.district; }
        function getZip(item) { return item.zipcode; }

        // โหลดรายชื่อจังหวัดทั้งหมดลง Dropdown 
        $.each(data, function(i, item) {
            var p = getProv(item);
            if (provinces.indexOf(p) === -1) provinces.push(p);
        });
        provinces.sort(); 
        $.each(provinces, function(i, province) {
            provinceSelect.append('<option value="' + province + '">' + province + '</option>');
        });

        //  ส่วนที่ 1: เลือกแบบปกติ (จังหวัด -> อำเภอ -> ตำบล)
        provinceSelect.change(function() {
            var selectedProvince = $(this).val();
            amphoeSelect.html('<option value="">เลือกอำเภอ</option>');
            tambonSelect.html('<option value="">เลือกตำบล</option>');

            if (selectedProvince !== '') {
                var amphoes = [];
                $.each(data, function(i, item) {
                    if (getProv(item) === selectedProvince) {
                        var a = getAmphoe(item);
                        if (amphoes.indexOf(a) === -1) amphoes.push(a);
                    }
                });
                amphoes.sort();
                $.each(amphoes, function(i, amphoe) {
                    amphoeSelect.append('<option value="' + amphoe + '">' + amphoe + '</option>');
                });
            }
        });

        amphoeSelect.change(function() {
            var selectedProvince = provinceSelect.val();
            var selectedAmphoe = $(this).val();
            tambonSelect.html('<option value="">เลือกตำบล</option>');
            
            if (selectedAmphoe !== '') {
                var tambons = [];
                $.each(data, function(i, item) {
                    if (getProv(item) === selectedProvince && getAmphoe(item) === selectedAmphoe) {
                        var t = getTambon(item);
                        if (tambons.indexOf(t) === -1) tambons.push(t);
                    }
                });
                tambons.sort();
                $.each(tambons, function(i, tambon) {
                    tambonSelect.append('<option value="' + tambon + '">' + tambon + '</option>');
                });
            }
        });

        tambonSelect.change(function() {
            var selectedProvince = provinceSelect.val();
            var selectedAmphoe = amphoeSelect.val();
            var selectedTambon = $(this).val();

            if (selectedTambon !== '') {
                $.each(data, function(i, item) {
                    if (getProv(item) === selectedProvince && 
                        getAmphoe(item) === selectedAmphoe && 
                        getTambon(item) === selectedTambon) {
                        zipcodeInput.val(getZip(item));
                        return false; 
                    }
                });
            }
        });

        //  ส่วนที่ 2: พิมพ์รหัสไปรษณีย์ -> เติม จังหวัด/อำเภอ/ตำบล     
        zipcodeInput.on('input', function() {
            var zip = $(this).val();

            // ทำงานเมื่อพิมพ์ครบ 5 หลักเท่านั้น
            if (zip.length === 5) {
                
                // หาข้อมูลที่ตรงกับ Zip Code นี้
                var matches = data.filter(function(item) {
                    return getZip(item) == zip;
                });

                if (matches.length > 0) {
                    // ดึงจังหวัด 
                    var p = getProv(matches[0]);
                    provinceSelect.val(p); 

                    // ดึงอำเภอที่เกี่ยวข้องกับ Zip นี้
                    var associatedAmphoes = [];
                    $.each(matches, function(i, item) {
                        var a = getAmphoe(item);
                        if (associatedAmphoes.indexOf(a) === -1) associatedAmphoes.push(a);
                    });
                    associatedAmphoes.sort();

                    // สร้างตัวเลือกอำเภอใหม่ (เฉพาะที่มีใน Zip นี้)
                    amphoeSelect.html('<option value="">เลือกอำเภอ</option>');
                    $.each(associatedAmphoes, function(i, amphoe) {
                        amphoeSelect.append('<option value="' + amphoe + '">' + amphoe + '</option>');
                    });
                    // ถ้ามีอำเภอเดียว ให้เลือกเลย
                    if (associatedAmphoes.length === 1) {
                        amphoeSelect.val(associatedAmphoes[0]);
                    }

                    // ดึงตำบลที่เกี่ยวข้อง
                    var associatedTambons = [];
                    $.each(matches, function(i, item) {
                        var t = getTambon(item);
                        if (associatedTambons.indexOf(t) === -1) associatedTambons.push(t);
                    });
                    associatedTambons.sort();

                    // สร้างตัวเลือกตำบลใหม่
                    tambonSelect.html('<option value="">เลือกตำบล</option>');
                    $.each(associatedTambons, function(i, tambon) {
                        tambonSelect.append('<option value="' + tambon + '">' + tambon + '</option>');
                    });
                     // ถ้ามีตำบลเดียว ให้เลือกเลย
                     if (associatedTambons.length === 1) {
                        tambonSelect.val(associatedTambons[0]);
                    }
                }
            }
        });

    });
});