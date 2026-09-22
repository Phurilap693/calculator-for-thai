// --- ส่วนเครื่องคิดเลขทั่วไป ---
const display = document.getElementById('display');
function appendValue(val) { display.value += val; }
function clearDisplay() { display.value = ''; }
function calculateResult() {
    try { display.value = eval(display.value); }
    catch (e) { display.value = 'Error'; }
}
// 1. ฟังก์ชันเพิ่มตัวเลข/เครื่องหมาย (ตรงกับ appendValue ใน HTML)
function appendValue(val) {
    const display = document.getElementById('display');
    if (!display) return;

    // ถ้าขึ้น Error อยู่ ให้ล้างออกก่อนเริ่มพิมพ์
    if (display.value === 'Error' || display.value === 'NaN') {
        display.value = '';
    }

    display.value += val;
    scrollToRight(display); // ดันหน้าจอไปขวาสุดทันที
}

// 2. ฟังก์ชันคำนวณผลลัพธ์ (ตรงกับ calculateResult ใน HTML)
function calculateResult() {
    const display = document.getElementById('display');
    if (!display) return;

    let expr = display.value.trim();

    // ลบเครื่องหมาย +, -, *, /, . ที่ตกค้างอยู่ท้ายสุดออกให้อัตโนมัติ (แก้ปัญหา 4+4+ = Error)
    while (/[+\-*/.]$/.test(expr)) {
        expr = expr.slice(0, -1);
    }

    if (!expr) {
        display.value = '';
        return;
    }

    try {
        // คำนวณผลลัพธ์
        let result = new Function('return ' + expr)();

        if (Number.isFinite(result)) {
            // ตัดทศนิยมส่วนเกิน (สูงสุด 8 ตำแหน่ง)
            display.value = parseFloat(result.toFixed(8)).toString();
        } else {
            display.value = 'Error';
        }
    } catch (e) {
        display.value = 'Error';
    }

    scrollToRight(display); // ดันผลลัพธ์ไปขวาสุด
}

// 3. ฟังก์ชันล้างหน้าจอ ปุ่ม C (ตรงกับ clearDisplay ใน HTML)
function clearDisplay() {
    const display = document.getElementById('display');
    if (display) {
        display.value = '';
    }
}
// --- ส่วนสลับโหมด ---
function switchMode(mode) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.mode-content').forEach(content => content.classList.remove('active'));

    if (mode === 'basic') {
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
        document.getElementById('basic-mode').classList.add('active');
    } else if (mode === 'geometry') {
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.getElementById('geometry-mode').classList.add('active');
        renderGeoInputs();
    } else if (mode === 'physics') {
        document.querySelectorAll('.tab-btn')[2].classList.add('active');
        document.getElementById('physics-mode').classList.add('active');
        renderPhysicsInputs();
    } else if (mode === 'physics_m5') {
        document.querySelectorAll('.tab-btn')[3].classList.add('active');
        document.getElementById('physics-m5-mode').classList.add('active');
        renderPhysicsM5Inputs(); // แสดงอินพุตแรกของ ม.5
    } else if (mode === 'physics_m6') {
        document.querySelectorAll('.tab-btn')[4].classList.add('active');
        document.getElementById('physics-m6-mode').classList.add('active');
        renderPhysicsM6Inputs(); // แสดงอินพุตแรกของ ม.6
    }
}

// ==========================================
// --- โหมดเรขาคณิต ---
// ==========================================
function renderGeoInputs() {
    const geo = document.getElementById('geo-select').value;
    const container = document.getElementById('geo-inputs-container');
    container.innerHTML = '';

    if (geo === 'square') {
        container.innerHTML = `<div class="input-group"><label>ด้าน (a):</label><input type="number" id="g_a"></div>`;
    } else if (geo === 'rect') {
        container.innerHTML = `
            <div class="input-group"><label>ความกว้าง (w):</label><input type="number" id="g_w"></div>
            <div class="input-group"><label>ความยาว (l):</label><input type="number" id="g_l"></div>`;
    } else if (geo === 'triangle') {
        container.innerHTML = `
            <div class="input-group"><label>ฐาน (b):</label><input type="number" id="g_b"></div>
            <div class="input-group"><label>สูง (h):</label><input type="number" id="g_h"></div>`;
    } else if (geo === 'circle') {
        container.innerHTML = `<div class="input-group"><label>รัศมี (r):</label><input type="number" id="g_r"></div>`;
    } else if (geo === 'trapezoid') {
        container.innerHTML = `
            <div class="input-group"><label>ผลบวกด้านคู่ขนาน (a+b):</label><input type="number" id="g_sum"></div>
            <div class="input-group"><label>สูง (h):</label><input type="number" id="g_h"></div>`;
    } else if (geo === 'rhombus') {
        container.innerHTML = `
            <div class="input-group"><label>เส้นทแยงมุม 1 (d1):</label><input type="number" id="g_d1"></div>
            <div class="input-group"><label>เส้นทแยงมุม 2 (d2):</label><input type="number" id="g_d2"></div>`;
    } else if (geo === 'ellipse') {
        container.innerHTML = `
            <div class="input-group"><label>รัศมีแกนเอก (a):</label><input type="number" id="g_a"></div>
            <div class="input-group"><label>รัศมีแกนโท (b):</label><input type="number" id="g_b"></div>`;
    }
}

function calculateGeometry() {
    const geo = document.getElementById('geo-select').value;
    const resBox = document.getElementById('geo-result');
    let res = 0;

    if (geo === 'square') res = Math.pow(parseFloat(document.getElementById('g_a').value), 2);
    else if (geo === 'rect') res = parseFloat(document.getElementById('g_w').value) * parseFloat(document.getElementById('g_l').value);
    else if (geo === 'triangle') res = 0.5 * parseFloat(document.getElementById('g_b').value) * parseFloat(document.getElementById('g_h').value);
    else if (geo === 'circle') res = Math.PI * Math.pow(parseFloat(document.getElementById('g_r').value), 2);
    else if (geo === 'trapezoid') res = 0.5 * parseFloat(document.getElementById('g_sum').value) * parseFloat(document.getElementById('g_h').value);
    else if (geo === 'rhombus') res = 0.5 * parseFloat(document.getElementById('g_d1').value) * parseFloat(document.getElementById('g_d2').value);
    else if (geo === 'ellipse') res = Math.PI * parseFloat(document.getElementById('g_a').value) * parseFloat(document.getElementById('g_b').value);

    resBox.innerText = `พื้นที่ = ${res.toFixed(2)}`;
}

// ==========================================
// --- โหมดฟิสิกส์ ม.4 ---
// ==========================================
function renderPhysicsInputs() {
    const p = document.getElementById('physics-select').value;
    const container = document.getElementById('physics-inputs-container');
    container.innerHTML = '';

    // 1. เคลื่อนที่แนวตรง
    if (p === 'm1_v') {
        container.innerHTML = `
            <div class="input-group"><label>ความเร็วต้น u (m/s):</label><input type="number" id="p_u"></div>
            <div class="input-group"><label>ความเร่ง a (m/s²):</label><input type="number" id="p_a"></div>
            <div class="input-group"><label>เวลา t (s):</label><input type="number" id="p_t"></div>`;
    } else if (p === 'm1_s1') {
        container.innerHTML = `
            <div class="input-group"><label>ความเร็วต้น u (m/s):</label><input type="number" id="p_u"></div>
            <div class="input-group"><label>ความเร็วปลาย v (m/s):</label><input type="number" id="p_v"></div>
            <div class="input-group"><label>เวลา t (s):</label><input type="number" id="p_t"></div>`;
    } else if (p === 'm1_s2') {
        container.innerHTML = `
            <div class="input-group"><label>ความเร็วต้น u (m/s):</label><input type="number" id="p_u"></div>
            <div class="input-group"><label>ความเร่ง a (m/s²):</label><input type="number" id="p_a"></div>
            <div class="input-group"><label>เวลา t (s):</label><input type="number" id="p_t"></div>`;
    } else if (p === 'm1_s3') {
        container.innerHTML = `
            <div class="input-group"><label>ความเร็วปลาย v (m/s):</label><input type="number" id="p_v"></div>
            <div class="input-group"><label>ความเร่ง a (m/s²):</label><input type="number" id="p_a"></div>
            <div class="input-group"><label>เวลา t (s):</label><input type="number" id="p_t"></div>`;
    } else if (p === 'm1_v2') {
        container.innerHTML = `
            <div class="input-group"><label>ความเร็วต้น u (m/s):</label><input type="number" id="p_u"></div>
            <div class="input-group"><label>ความเร่ง a (m/s²):</label><input type="number" id="p_a"></div>
            <div class="input-group"><label>การกระจัด s (m):</label><input type="number" id="p_s"></div>`;
    }

    // 2. นิวตัน
    else if (p === 'm2_f') {
        container.innerHTML = `
            <div class="input-group"><label>มวล m (kg):</label><input type="number" id="p_m"></div>
            <div class="input-group"><label>ความเร่ง a (m/s²):</label><input type="number" id="p_a"></div>`;
    } else if (p === 'm2_w') {
        container.innerHTML = `
            <div class="input-group"><label>มวล m (kg):</label><input type="number" id="p_m"></div>
            <div class="input-group"><label>g (m/s²) [ปกติ 9.8 หรือ 10]:</label><input type="number" id="p_g" value="9.8"></div>`;
    } else if (p === 'm2_friction') {
        container.innerHTML = `
            <div class="input-group"><label>สัมประสิทธิ์แรงเสียดทาน (μ):</label><input type="number" id="p_mu"></div>
            <div class="input-group"><label>แรงปฏิกิริยาแนวฉาก N (N):</label><input type="number" id="p_n"></div>`;
    } else if (p === 'm2_gravity') {
        container.innerHTML = `
            <div class="input-group"><label>มวล m1 (kg):</label><input type="number" id="p_m1"></div>
            <div class="input-group"><label>มวล m2 (kg):</label><input type="number" id="p_m2"></div>
            <div class="input-group"><label>ระยะห่าง r (m):</label><input type="number" id="p_r"></div>`;
    }

    // 3. โปรเจกไทล์
    else if (p === 'm3_vx' || p === 'm3_uy') {
        container.innerHTML = `
            <div class="input-group"><label>ความเร็วต้น u (m/s):</label><input type="number" id="p_u"></div>
            <div class="input-group"><label>มุม θ (องศา):</label><input type="number" id="p_deg"></div>`;
    } else if (p === 'm3_sx') {
        container.innerHTML = `
            <div class="input-group"><label>ความเร็วแกน x (vx) (m/s):</label><input type="number" id="p_vx"></div>
            <div class="input-group"><label>เวลา t (s):</label><input type="number" id="p_t"></div>`;
    }

    // 4. วงกลม
    else if (p === 'm4_fc') {
        container.innerHTML = `
            <div class="input-group"><label>มวล m (kg):</label><input type="number" id="p_m"></div>
            <div class="input-group"><label>ความเร็ว v (m/s):</label><input type="number" id="p_v"></div>
            <div class="input-group"><label>รัศมี r (m):</label><input type="number" id="p_r"></div>`;
    } else if (p === 'm4_ac') {
        container.innerHTML = `
            <div class="input-group"><label>ความเร็ว v (m/s):</label><input type="number" id="p_v"></div>
            <div class="input-group"><label>รัศมี r (m):</label><input type="number" id="p_r"></div>`;
    } else if (p === 'm4_v_omega') {
        container.innerHTML = `
            <div class="input-group"><label>ความเร็วเชิงมุม ω (rad/s):</label><input type="number" id="p_w"></div>
            <div class="input-group"><label>รัศมี r (m):</label><input type="number" id="p_r"></div>`;
    } else if (p === 'm4_v_period') {
        container.innerHTML = `
            <div class="input-group"><label>รัศมี r (m):</label><input type="number" id="p_r"></div>
            <div class="input-group"><label>คาบ T (s):</label><input type="number" id="p_period"></div>`;
    }

    // 5. SHM
    else if (p === 'm5_pendulum') {
        container.innerHTML = `
            <div class="input-group"><label>ความยาวเชือก L (m):</label><input type="number" id="p_l"></div>
            <div class="input-group"><label>g (m/s²):</label><input type="number" id="p_g" value="9.8"></div>`;
    } else if (p === 'm5_spring') {
        container.innerHTML = `
            <div class="input-group"><label>มวล m (kg):</label><input type="number" id="p_m"></div>
            <div class="input-group"><label>ค่าคงตัวสปริง k (N/m):</label><input type="number" id="p_k"></div>`;
    } else if (p === 'm5_freq') {
        container.innerHTML = `<div class="input-group"><label>คาบ T (s):</label><input type="number" id="p_period"></div>`;
    }

    // 6. งานและพลังงาน
    else if (p === 'm6_work') {
        container.innerHTML = `
            <div class="input-group"><label>แรง F (N):</label><input type="number" id="p_f"></div>
            <div class="input-group"><label>ระยะทาง s (m):</label><input type="number" id="p_s"></div>
            <div class="input-group"><label>มุม θ (องศา):</label><input type="number" id="p_deg" value="0"></div>`;
    } else if (p === 'm6_ek') {
        container.innerHTML = `
            <div class="input-group"><label>มวล m (kg):</label><input type="number" id="p_m"></div>
            <div class="input-group"><label>ความเร็ว v (m/s):</label><input type="number" id="p_v"></div>`;
    } else if (p === 'm6_ep_g') {
        container.innerHTML = `
            <div class="input-group"><label>มวล m (kg):</label><input type="number" id="p_m"></div>
            <div class="input-group"><label>ความสูง h (m):</label><input type="number" id="p_h"></div>
            <div class="input-group"><label>g (m/s²):</label><input type="number" id="p_g" value="9.8"></div>`;
    } else if (p === 'm6_ep_s') {
        container.innerHTML = `
            <div class="input-group"><label>ค่าสปริง k (N/m):</label><input type="number" id="p_k"></div>
            <div class="input-group"><label>ระยะยืด/หด x (m):</label><input type="number" id="p_x"></div>`;
    } else if (p === 'm6_power') {
        container.innerHTML = `
            <div class="input-group"><label>งาน W (J):</label><input type="number" id="p_w"></div>
            <div class="input-group"><label>เวลา t (s):</label><input type="number" id="p_t"></div>`;
    }
}

function calculatePhysics() {
    const p = document.getElementById('physics-select').value;
    const resBox = document.getElementById('physics-result');
    let res = 0;

    // Helper แปลงองศาเป็น Radian
    const toRad = deg => (deg * Math.PI) / 180;

    // 1. เคลื่อนที่แนวตรง
    if (p === 'm1_v') {
        let u = parseFloat(document.getElementById('p_u').value);
        let a = parseFloat(document.getElementById('p_a').value);
        let t = parseFloat(document.getElementById('p_t').value);
        resBox.innerText = `ความเร็วปลาย (v) = ${u + a * t} m/s`;
    } else if (p === 'm1_s1') {
        let u = parseFloat(document.getElementById('p_u').value);
        let v = parseFloat(document.getElementById('p_v').value);
        let t = parseFloat(document.getElementById('p_t').value);
        resBox.innerText = `การกระจัด (s) = ${((u + v) / 2) * t} m`;
    } else if (p === 'm1_s2') {
        let u = parseFloat(document.getElementById('p_u').value);
        let a = parseFloat(document.getElementById('p_a').value);
        let t = parseFloat(document.getElementById('p_t').value);
        resBox.innerText = `การกระจัด (s) = ${u * t + 0.5 * a * t * t} m`;
    } else if (p === 'm1_s3') {
        let v = parseFloat(document.getElementById('p_v').value);
        let a = parseFloat(document.getElementById('p_a').value);
        let t = parseFloat(document.getElementById('p_t').value);
        resBox.innerText = `การกระจัด (s) = ${v * t - 0.5 * a * t * t} m`;
    } else if (p === 'm1_v2') {
        let u = parseFloat(document.getElementById('p_u').value);
        let a = parseFloat(document.getElementById('p_a').value);
        let s = parseFloat(document.getElementById('p_s').value);
        let v2 = u * u + 2 * a * s;
        resBox.innerText = `v² = ${v2} | v = ${Math.sqrt(v2).toFixed(2)} m/s`;
    }

    // 2. นิวตัน
    else if (p === 'm2_f') {
        let m = parseFloat(document.getElementById('p_m').value);
        let a = parseFloat(document.getElementById('p_a').value);
        resBox.innerText = `แรงรวม (ΣF) = ${m * a} N`;
    } else if (p === 'm2_w') {
        let m = parseFloat(document.getElementById('p_m').value);
        let g = parseFloat(document.getElementById('p_g').value);
        resBox.innerText = `น้ำหนัก (W) = ${m * g} N`;
    } else if (p === 'm2_friction') {
        let mu = parseFloat(document.getElementById('p_mu').value);
        let n = parseFloat(document.getElementById('p_n').value);
        resBox.innerText = `แรงเสียดทาน (f) = ${mu * n} N`;
    } else if (p === 'm2_gravity') {
        let m1 = parseFloat(document.getElementById('p_m1').value);
        let m2 = parseFloat(document.getElementById('p_m2').value);
        let r = parseFloat(document.getElementById('p_r').value);
        const G = 6.674e-11;
        resBox.innerText = `แรงดึงดูด (F) = ${(G * m1 * m2 / (r * r)).toExponential(3)} N`;
    }

    // 3. โปรเจกไทล์
    else if (p === 'm3_vx') {
        let u = parseFloat(document.getElementById('p_u').value);
        let deg = parseFloat(document.getElementById('p_deg').value);
        resBox.innerText = `vx = ${(u * Math.cos(toRad(deg))).toFixed(2)} m/s`;
    } else if (p === 'm3_sx') {
        let vx = parseFloat(document.getElementById('p_vx').value);
        let t = parseFloat(document.getElementById('p_t').value);
        resBox.innerText = `sx = ${vx * t} m`;
    } else if (p === 'm3_uy') {
        let u = parseFloat(document.getElementById('p_u').value);
        let deg = parseFloat(document.getElementById('p_deg').value);
        resBox.innerText = `uy = ${(u * Math.sin(toRad(deg))).toFixed(2)} m/s`;
    }

    // 4. วงกลม
    else if (p === 'm4_fc') {
        let m = parseFloat(document.getElementById('p_m').value);
        let v = parseFloat(document.getElementById('p_v').value);
        let r = parseFloat(document.getElementById('p_r').value);
        resBox.innerText = `แรงสู่ศูนย์กลาง (Fc) = ${(m * v * v / r).toFixed(2)} N`;
    } else if (p === 'm4_ac') {
        let v = parseFloat(document.getElementById('p_v').value);
        let r = parseFloat(document.getElementById('p_r').value);
        resBox.innerText = `ความเร่งสู่ศูนย์กลาง (ac) = ${(v * v / r).toFixed(2)} m/s²`;
    } else if (p === 'm4_v_omega') {
        let w = parseFloat(document.getElementById('p_w').value);
        let r = parseFloat(document.getElementById('p_r').value);
        resBox.innerText = `ความเร็วเชิงเส้น (v) = ${w * r} m/s`;
    } else if (p === 'm4_v_period') {
        let r = parseFloat(document.getElementById('p_r').value);
        let T = parseFloat(document.getElementById('p_period').value);
        resBox.innerText = `ความเร็วเชิงเส้น (v) = ${(2 * Math.PI * r / T).toFixed(2)} m/s`;
    }

    // 5. SHM
    else if (p === 'm5_pendulum') {
        let l = parseFloat(document.getElementById('p_l').value);
        let g = parseFloat(document.getElementById('p_g').value);
        resBox.innerText = `คาบ (T) = ${(2 * Math.PI * Math.sqrt(l / g)).toFixed(2)} s`;
    } else if (p === 'm5_spring') {
        let m = parseFloat(document.getElementById('p_m').value);
        let k = parseFloat(document.getElementById('p_k').value);
        resBox.innerText = `คาบ (T) = ${(2 * Math.PI * Math.sqrt(m / k)).toFixed(2)} s`;
    } else if (p === 'm5_freq') {
        let T = parseFloat(document.getElementById('p_period').value);
        resBox.innerText = `ความถี่ (f) = ${(1 / T).toFixed(2)} Hz`;
    }

    // 6. งานและพลังงาน
    else if (p === 'm6_work') {
        let f = parseFloat(document.getElementById('p_f').value);
        let s = parseFloat(document.getElementById('p_s').value);
        let deg = parseFloat(document.getElementById('p_deg').value);
        resBox.innerText = `งาน (W) = ${(f * s * Math.cos(toRad(deg))).toFixed(2)} J`;
    } else if (p === 'm6_ek') {
        let m = parseFloat(document.getElementById('p_m').value);
        let v = parseFloat(document.getElementById('p_v').value);
        resBox.innerText = `พลังงานจลน์ (Ek) = ${0.5 * m * v * v} J`;
    } else if (p === 'm6_ep_g') {
        let m = parseFloat(document.getElementById('p_m').value);
        let h = parseFloat(document.getElementById('p_h').value);
        let g = parseFloat(document.getElementById('p_g').value);
        resBox.innerText = `พลังงานศักย์โน้มถ่วง (Ep) = ${m * g * h} J`;
    } else if (p === 'm6_ep_s') {
        let k = parseFloat(document.getElementById('p_k').value);
        let x = parseFloat(document.getElementById('p_x').value);
        resBox.innerText = `พลังงานศักย์ยืดหยุ่น (Ep) = ${0.5 * k * x * x} J`;
    } else if (p === 'm6_power') {
        let w = parseFloat(document.getElementById('p_w').value);
        let t = parseFloat(document.getElementById('p_t').value);
        resBox.innerText = `กำลัง (P) = ${(w / t).toFixed(2)} W`;
    }
}
// ==========================================
// --- โหมดฟิสิกส์ ม.5 ---
// ==========================================
function renderPhysicsM5Inputs() {
    const p = document.getElementById('physics-m5-select').value;
    const container = document.getElementById('physics-m5-inputs-container');
    container.innerHTML = '';

    // 1. สมดุลกลและการหมุน
    if (p === 'm5_rot_m') {
        container.innerHTML = `
            <div class="input-group"><label>แรง F (N):</label><input type="number" id="m5_f"></div>
            <div class="input-group"><label>ระยะตั้งฉาก d (m):</label><input type="number" id="m5_d"></div>`;
    } else if (p === 'm5_rot_tau') {
        container.innerHTML = `
            <div class="input-group"><label>ระยะ r (m):</label><input type="number" id="m5_r"></div>
            <div class="input-group"><label>แรง F (N):</label><input type="number" id="m5_f"></div>
            <div class="input-group"><label>มุม θ (องศา):</label><input type="number" id="m5_deg" value="90"></div>`;
    } else if (p === 'm5_rot_w') {
        container.innerHTML = `<div class="input-group"><label>ความถี่ f (Hz):</label><input type="number" id="m5_f_freq"></div>`;
    } else if (p === 'm5_rot_v') {
        container.innerHTML = `
            <div class="input-group"><label>ความเร็วเชิงมุม ω (rad/s):</label><input type="number" id="m5_w"></div>
            <div class="input-group"><label>รัศมี r (m):</label><input type="number" id="m5_r"></div>`;
    } else if (p === 'm5_rot_l') {
        container.innerHTML = `
            <div class="input-group"><label>โมเมนต์ความเฉื่อย I (kg·m²):</label><input type="number" id="m5_i"></div>
            <div class="input-group"><label>ความเร็วเชิงมุม ω (rad/s):</label><input type="number" id="m5_w"></div>`;
    }

    // 2. คลื่นกลและแสงเชิงคลื่น
    else if (p === 'm5_wave_v') {
        container.innerHTML = `
            <div class="input-group"><label>ความถี่ f (Hz):</label><input type="number" id="m5_f"></div>
            <div class="input-group"><label>ความยาวคลื่น λ (m):</label><input type="number" id="m5_lam"></div>`;
    } else if (p === 'm5_slit_bright') {
        container.innerHTML = `
            <div class="input-group"><label>ระยะช่องสลิต d (m):</label><input type="number" id="m5_d"></div>
            <div class="input-group"><label>มุม θ (องศา):</label><input type="number" id="m5_deg"></div>
            <div class="input-group"><label>ลำดับแถบสว่าง n (0, 1, 2...):</label><input type="number" id="m5_n"></div>`;
    } else if (p === 'm5_slit_dark') {
        container.innerHTML = `
            <div class="input-group"><label>ระยะช่องสลิต d (m):</label><input type="number" id="m5_d"></div>
            <div class="input-group"><label>มุม θ (องศา):</label><input type="number" id="m5_deg"></div>
            <div class="input-group"><label>ลำดับแถบมืด n (1, 2, 3...):</label><input type="number" id="m5_n"></div>`;
    } else if (p === 'm5_grating') {
        container.innerHTML = `<div class="input-group"><label>จำนวนช่องต่อเมตร N (ช่อง/m):</label><input type="number" id="m5_bigN"></div>`;
    }

    // 3. แสงเชิงรังสี
    else if (p === 'm5_snell') {
        container.innerHTML = `
            <div class="input-group"><label>ดรรชนีหักเห n₁:</label><input type="number" id="m5_n1"></div>
            <div class="input-group"><label>มุมตกกระทบ θ₁ (องศา):</label><input type="number" id="m5_deg1"></div>
            <div class="input-group"><label>ดรรชนีหักเห n₂:</label><input type="number" id="m5_n2"></div>`;
    } else if (p === 'm5_lens') {
        container.innerHTML = `
            <div class="input-group"><label>ความยาวโฟกัส f (m):</label><input type="number" id="m5_focal"></div>
            <div class="input-group"><label>ระยะวัตถุ s (m):</label><input type="number" id="m5_s"></div>`;
    } else if (p === 'm5_mag') {
        container.innerHTML = `
            <div class="input-group"><label>ระยะวัตถุ s (m):</label><input type="number" id="m5_s"></div>
            <div class="input-group"><label>ระยะภาพ s' (m):</label><input type="number" id="m5_sp"></div>`;
    }

    // 4. เสียง
    else if (p === 'm5_sound_v') {
        container.innerHTML = `<div class="input-group"><label>อุณหภูมิ Tc (°C):</label><input type="number" id="m5_tc"></div>`;
    } else if (p === 'm5_sound_i') {
        container.innerHTML = `
            <div class="input-group"><label>กำลังเสียง P (W):</label><input type="number" id="m5_p"></div>
            <div class="input-group"><label>ระยะห่าง r (m):</label><input type="number" id="m5_r"></div>`;
    } else if (p === 'm5_sound_beta') {
        container.innerHTML = `<div class="input-group"><label>ความเข้มเสียง I (W/m²):</label><input type="number" id="m5_intensity"></div>`;
    }

    // 5. ความร้อน แก๊ส เทอร์โมไดนามิกส์
    else if (p === 'm5_q_temp') {
        container.innerHTML = `
            <div class="input-group"><label>มวล m (kg):</label><input type="number" id="m5_m"></div>
            <div class="input-group"><label>ความร้อนจำเพาะ c (J/kg·K):</label><input type="number" id="m5_c"></div>
            <div class="input-group"><label>อุณหภูมิที่เปลี่ยน ΔT (°C):</label><input type="number" id="m5_dt"></div>`;
    } else if (p === 'm5_q_state') {
        container.innerHTML = `
            <div class="input-group"><label>มวล m (kg):</label><input type="number" id="m5_m"></div>
            <div class="input-group"><label>ความร้อนแฝง L (J/kg):</label><input type="number" id="m5_l"></div>`;
    } else if (p === 'm5_gas') {
        container.innerHTML = `
            <div class="input-group"><label>จำนวนโมล n (mol):</label><input type="number" id="m5_n"></div>
            <div class="input-group"><label>อุณหภูมิ T (K):</label><input type="number" id="m5_t"></div>
            <div class="input-group"><label>ปริมาตร V (m³):</label><input type="number" id="m5_v"></div>`;
    } else if (p === 'm5_ek') {
        container.innerHTML = `<div class="input-group"><label>อุณหภูมิ T (K):</label><input type="number" id="m5_t"></div>`;
    } else if (p === 'm5_u') {
        container.innerHTML = `
            <div class="input-group"><label>ความร้อน Q (J):</label><input type="number" id="m5_q"></div>
            <div class="input-group"><label>งาน W (J):</label><input type="number" id="m5_w"></div>`;
    }
}
function calculatePhysicsM5() {
    const p = document.getElementById('physics-m5-select').value;
    const resBox = document.getElementById('physics-m5-result');
    const toRad = deg => (deg * Math.PI) / 180;

    // 1. หมุน
    if (p === 'm5_rot_m') {
        let f = parseFloat(document.getElementById('m5_f').value);
        let d = parseFloat(document.getElementById('m5_d').value);
        resBox.innerText = `โมเมนต์ (M) = ${f * d} N·m`;
    } else if (p === 'm5_rot_tau') {
        let r = parseFloat(document.getElementById('m5_r').value);
        let f = parseFloat(document.getElementById('m5_f').value);
        let deg = parseFloat(document.getElementById('m5_deg').value);
        resBox.innerText = `ทอร์ก (τ) = ${(r * f * Math.sin(toRad(deg))).toFixed(2)} N·m`;
    } else if (p === 'm5_rot_w') {
        let f = parseFloat(document.getElementById('m5_f_freq').value);
        resBox.innerText = `ความเร็วเชิงมุม (ω) = ${(2 * Math.PI * f).toFixed(2)} rad/s`;
    } else if (p === 'm5_rot_v') {
        let w = parseFloat(document.getElementById('m5_w').value);
        let r = parseFloat(document.getElementById('m5_r').value);
        resBox.innerText = `ความเร็วเชิงเส้น (v) = ${w * r} m/s`;
    } else if (p === 'm5_rot_l') {
        let i = parseFloat(document.getElementById('m5_i').value);
        let w = parseFloat(document.getElementById('m5_w').value);
        resBox.innerText = `โมเมนตัมเชิงมุม (L) = ${i * w} kg·m²/s`;
    }

    // 2. คลื่น
    else if (p === 'm5_wave_v') {
        let f = parseFloat(document.getElementById('m5_f').value);
        let lam = parseFloat(document.getElementById('m5_lam').value);
        resBox.innerText = `ความเร็วคลื่น (v) = ${f * lam} m/s`;
    } else if (p === 'm5_slit_bright') {
        let d = parseFloat(document.getElementById('m5_d').value);
        let deg = parseFloat(document.getElementById('m5_deg').value);
        let n = parseFloat(document.getElementById('m5_n').value);
        let lam = (d * Math.sin(toRad(deg))) / n;
        resBox.innerText = `ความยาวคลื่น (λ) = ${lam.toExponential(3)} m`;
    } else if (p === 'm5_slit_dark') {
        let d = parseFloat(document.getElementById('m5_d').value);
        let deg = parseFloat(document.getElementById('m5_deg').value);
        let n = parseFloat(document.getElementById('m5_n').value);
        let lam = (d * Math.sin(toRad(deg))) / (n - 0.5);
        resBox.innerText = `ความยาวคลื่น (λ) = ${lam.toExponential(3)} m`;
    } else if (p === 'm5_grating') {
        let bigN = parseFloat(document.getElementById('m5_bigN').value);
        resBox.innerText = `ระยะระหว่างช่อง (d) = ${(1 / bigN).toExponential(3)} m`;
    }

    // 3. แสง
    else if (p === 'm5_snell') {
        let n1 = parseFloat(document.getElementById('m5_n1').value);
        let deg1 = parseFloat(document.getElementById('m5_deg1').value);
        let n2 = parseFloat(document.getElementById('m5_n2').value);
        let sinDeg2 = (n1 * Math.sin(toRad(deg1))) / n2;
        let deg2 = (Math.asin(sinDeg2) * 180) / Math.PI;
        resBox.innerText = `มุมหักเห (θ₂) = ${deg2.toFixed(2)} องศา`;
    } else if (p === 'm5_lens') {
        let focal = parseFloat(document.getElementById('m5_focal').value);
        let s = parseFloat(document.getElementById('m5_s').value);
        let sp = (focal * s) / (s - focal);
        resBox.innerText = `ระยะภาพ (s') = ${sp.toFixed(2)} m`;
    } else if (p === 'm5_mag') {
        let s = parseFloat(document.getElementById('m5_s').value);
        let sp = parseFloat(document.getElementById('m5_sp').value);
        resBox.innerText = `กำลังขยาย (m) = ${(-sp / s).toFixed(2)} เท่า`;
    }

    // 4. เสียง
    else if (p === 'm5_sound_v') {
        let tc = parseFloat(document.getElementById('m5_tc').value);
        resBox.innerText = `ความเร็วเสียง (v) = ${(331 + 0.6 * tc).toFixed(1)} m/s`;
    } else if (p === 'm5_sound_i') {
        let pow = parseFloat(document.getElementById('m5_p').value);
        let r = parseFloat(document.getElementById('m5_r').value);
        let i = pow / (4 * Math.PI * r * r);
        resBox.innerText = `ความเข้มเสียง (I) = ${i.toExponential(3)} W/m²`;
    } else if (p === 'm5_sound_beta') {
        let intensity = parseFloat(document.getElementById('m5_intensity').value);
        let beta = 10 * Math.log10(intensity / 1e-12);
        resBox.innerText = `ระดับความดัง (β) = ${beta.toFixed(1)} dB`;
    }

    // 5. ความร้อน แก๊ส
    else if (p === 'm5_q_temp') {
        let m = parseFloat(document.getElementById('m5_m').value);
        let c = parseFloat(document.getElementById('m5_c').value);
        let dt = parseFloat(document.getElementById('m5_dt').value);
        resBox.innerText = `ความร้อน (Q) = ${m * c * dt} J`;
    } else if (p === 'm5_q_state') {
        let m = parseFloat(document.getElementById('m5_m').value);
        let l = parseFloat(document.getElementById('m5_l').value);
        resBox.innerText = `ความร้อน (Q) = ${m * l} J`;
    } else if (p === 'm5_gas') {
        let n = parseFloat(document.getElementById('m5_n').value);
        let t = parseFloat(document.getElementById('m5_t').value);
        let v = parseFloat(document.getElementById('m5_v').value);
        const R = 8.314;
        let pVal = (n * R * t) / v;
        resBox.innerText = `ความดัน (P) = ${pVal.toFixed(2)} Pa`;
    } else if (p === 'm5_ek') {
        let t = parseFloat(document.getElementById('m5_t').value);
        const kB = 1.38e-23;
        let ek = 1.5 * kB * t;
        resBox.innerText = `พลังงานจลน์เฉลี่ย (Ek) = ${ek.toExponential(3)} J`;
    } else if (p === 'm5_u') {
        let q = parseFloat(document.getElementById('m5_q').value);
        let w = parseFloat(document.getElementById('m5_w').value);
        resBox.innerText = `พลังงานภายในระบบ (ΔU) = ${q - w} J`;
    }
}
// ==========================================
// --- โหมดฟิสิกส์ ม.6 ---
// ==========================================
function renderPhysicsM6Inputs() {
    const p = document.getElementById('physics-m6-select').value;
    const container = document.getElementById('physics-m6-inputs-container');
    container.innerHTML = '';

    // 1. ไฟฟ้าสถิต
    if (p === 'm6_electro_f') {
        container.innerHTML = `
            <div class="input-group"><label>ประจุ q₁ (C):</label><input type="number" id="m6_q1"></div>
            <div class="input-group"><label>ประจุ q₂ (C):</label><input type="number" id="m6_q2"></div>
            <div class="input-group"><label>ระยะห่าง r (m):</label><input type="number" id="m6_r"></div>`;
    } else if (p === 'm6_electro_e') {
        container.innerHTML = `
            <div class="input-group"><label>ประจุ Q (C):</label><input type="number" id="m6_q"></div>
            <div class="input-group"><label>ระยะห่าง r (m):</label><input type="number" id="m6_r"></div>`;
    } else if (p === 'm6_electro_v') {
        container.innerHTML = `
            <div class="input-group"><label>ประจุ Q (C):</label><input type="number" id="m6_q"></div>
            <div class="input-group"><label>ระยะห่าง r (m):</label><input type="number" id="m6_r"></div>`;
    } else if (p === 'm6_electro_w') {
        container.innerHTML = `
            <div class="input-group"><label>ประจุทดสอบ q (C):</label><input type="number" id="m6_q"></div>
            <div class="input-group"><label>ศักย์ไฟฟ้าจุดต้น VA (V):</label><input type="number" id="m6_va"></div>
            <div class="input-group"><label>ศักย์ไฟฟ้าจุดปลาย VB (V):</label><input type="number" id="m6_vb"></div>`;
    } else if (p === 'm6_electro_c') {
        container.innerHTML = `
            <div class="input-group"><label>ประจุ Q (C):</label><input type="number" id="m6_q"></div>
            <div class="input-group"><label>ความต่างศักย์ V (V):</label><input type="number" id="m6_v"></div>`;
    } else if (p === 'm6_electro_u') {
        container.innerHTML = `
            <div class="input-group"><label>ความจุ C (F):</label><input type="number" id="m6_c"></div>
            <div class="input-group"><label>ความต่างศักย์ V (V):</label><input type="number" id="m6_v"></div>`;
    }

    // 2. ไฟฟ้ากระแส
    else if (p === 'm6_dc_i') {
        container.innerHTML = `
            <div class="input-group"><label>ปริมาณประจุ Q (C):</label><input type="number" id="m6_q"></div>
            <div class="input-group"><label>เวลา t (s):</label><input type="number" id="m6_t"></div>`;
    } else if (p === 'm6_dc_ohm') {
        container.innerHTML = `
            <div class="input-group"><label>กระแสไฟฟ้า I (A):</label><input type="number" id="m6_i"></div>
            <div class="input-group"><label>ความต้านทาน R (Ω):</label><input type="number" id="m6_r_ohm"></div>`;
    } else if (p === 'm6_dc_rho') {
        container.innerHTML = `
            <div class="input-group"><label>สภาพต้านทาน ρ (Ω·m):</label><input type="number" id="m6_rho"></div>
            <div class="input-group"><label>ความยาวสาย L (m):</label><input type="number" id="m6_l"></div>
            <div class="input-group"><label>พื้นที่หน้าตัด A (m²):</label><input type="number" id="m6_a"></div>`;
    } else if (p === 'm6_dc_power') {
        container.innerHTML = `
            <div class="input-group"><label>ความต่างศักย์ V (V):</label><input type="number" id="m6_v"></div>
            <div class="input-group"><label>กระแสไฟฟ้า I (A):</label><input type="number" id="m6_i"></div>`;
    } else if (p === 'm6_dc_emf') {
        container.innerHTML = `
            <div class="input-group"><label>แรงเคลื่อนไฟฟ้ารวม ΣE (V):</label><input type="number" id="m6_emf"></div>
            <div class="input-group"><label>ความต้านทานภายนอก ΣR (Ω):</label><input type="number" id="m6_bigR"></div>
            <div class="input-group"><label>ความต้านทานภายใน Σr (Ω):</label><input type="number" id="m6_smallr"></div>`;
    }

    // 3. แม่เหล็กและไฟฟ้า
    else if (p === 'm6_mag_fqv') {
        container.innerHTML = `
            <div class="input-group"><label>ประจุ q (C):</label><input type="number" id="m6_q"></div>
            <div class="input-group"><label>ความเร็ว v (m/s):</label><input type="number" id="m6_v"></div>
            <div class="input-group"><label>สนามแม่เหล็ก B (T):</label><input type="number" id="m6_b"></div>
            <div class="input-group"><label>มุม θ (องศา):</label><input type="number" id="m6_deg" value="90"></div>`;
    } else if (p === 'm6_mag_fil') {
        container.innerHTML = `
            <div class="input-group"><label>กระแส I (A):</label><input type="number" id="m6_i"></div>
            <div class="input-group"><label>ความยาวสาย L (m):</label><input type="number" id="m6_l"></div>
            <div class="input-group"><label>สนามแม่เหล็ก B (T):</label><input type="number" id="m6_b"></div>
            <div class="input-group"><label>มุม θ (องศา):</label><input type="number" id="m6_deg" value="90"></div>`;
    } else if (p === 'm6_mag_r') {
        container.innerHTML = `
            <div class="input-group"><label>มวล m (kg):</label><input type="number" id="m6_m"></div>
            <div class="input-group"><label>ความเร็ว v (m/s):</label><input type="number" id="m6_v"></div>
            <div class="input-group"><label>ประจุ q (C):</label><input type="number" id="m6_q"></div>
            <div class="input-group"><label>สนามแม่เหล็ก B (T):</label><input type="number" id="m6_b"></div>`;
    } else if (p === 'm6_ac_vrms') {
        container.innerHTML = `<div class="input-group"><label>แรงดันสูงสุด Vmax (V):</label><input type="number" id="m6_vmax"></div>`;
    } else if (p === 'm6_ac_xc') {
        container.innerHTML = `
            <div class="input-group"><label>ความถี่ f (Hz):</label><input type="number" id="m6_f"></div>
            <div class="input-group"><label>ความจุ C (F):</label><input type="number" id="m6_c"></div>`;
    } else if (p === 'm6_ac_xl') {
        container.innerHTML = `
            <div class="input-group"><label>ความถี่ f (Hz):</label><input type="number" id="m6_f"></div>
            <div class="input-group"><label>ความเหนี่ยวนำ L (H):</label><input type="number" id="m6_l"></div>`;
    } else if (p === 'm6_ac_z') {
        container.innerHTML = `
            <div class="input-group"><label>ความต้านทาน R (Ω):</label><input type="number" id="m6_r"></div>
            <div class="input-group"><label>XL (Ω):</label><input type="number" id="m6_xl"></div>
            <div class="input-group"><label>XC (Ω):</label><input type="number" id="m6_xc"></div>`;
    }

    // 4. คลื่นแม่เหล็กไฟฟ้า
    else if (p === 'm6_emw_c') {
        container.innerHTML = `
            <div class="input-group"><label>ความถี่ f (Hz):</label><input type="number" id="m6_f"></div>
            <div class="input-group"><label>ความยาวคลื่น λ (m):</label><input type="number" id="m6_lam"></div>`;
    } else if (p === 'm6_emw_i') {
        container.innerHTML = `
            <div class="input-group"><label>กำลัง P (W):</label><input type="number" id="m6_p"></div>
            <div class="input-group"><label>ระยะห่าง r (m):</label><input type="number" id="m6_r"></div>`;
    } else if (p === 'm6_emw_eb') {
        container.innerHTML = `<div class="input-group"><label>สนามแม่เหล็ก B (T):</label><input type="number" id="m6_b"></div>`;
    }

    // 5. ฟิสิกส์อะตอม
    else if (p === 'm6_atom_e') {
        container.innerHTML = `<div class="input-group"><label>ความถี่ f (Hz):</label><input type="number" id="m6_f"></div>`;
    } else if (p === 'm6_atom_photo') {
        container.innerHTML = `
            <div class="input-group"><label>พลังงานโฟตอน hf (J หรือ eV):</label><input type="number" id="m6_hf"></div>
            <div class="input-group"><label>เวิร์กฟังก์ชัน W (หน่วยเดียวกับ hf):</label><input type="number" id="m6_w"></div>`;
    } else if (p === 'm6_atom_en') {
        container.innerHTML = `<div class="input-group"><label>ระดับชั้นพลังงาน n (1, 2, 3...):</label><input type="number" id="m6_n"></div>`;
    } else if (p === 'm6_atom_debroglie') {
        container.innerHTML = `
            <div class="input-group"><label>มวล m (kg):</label><input type="number" id="m6_m"></div>
            <div class="input-group"><label>ความเร็ว v (m/s):</label><input type="number" id="m6_v"></div>`;
    }

    // 6. ฟิสิกส์นิวเคลียร์
    else if (p === 'm6_nuc_decay') {
        container.innerHTML = `
            <div class="input-group"><label>ปริมาณตั้งต้น N₀:</label><input type="number" id="m6_n0"></div>
            <div class="input-group"><label>เวลาทั้งหมด t:</label><input type="number" id="m6_t"></div>
            <div class="input-group"><label>ครึ่งชีวิต T½ (หน่วยเดียวกับ t):</label><input type="number" id="m6_t12"></div>`;
    } else if (p === 'm6_nuc_act') {
        container.innerHTML = `
            <div class="input-group"><label>ค่าคงตัวการสลายตัว λ (s⁻¹):</label><input type="number" id="m6_lambda"></div>
            <div class="input-group"><label>จำนวนนิวเคลียส N:</label><input type="number" id="m6_n"></div>`;
    } else if (p === 'm6_nuc_t12') {
        container.innerHTML = `<div class="input-group"><label>ค่าคงตัวการสลายตัว λ (s⁻¹):</label><input type="number" id="m6_lambda"></div>`;
    } else if (p === 'm6_nuc_mass_energy') {
        container.innerHTML = `<div class="input-group"><label>มวลพร่อง Δm (หน่วย u / amu):</label><input type="number" id="m6_dm"></div>`;
    }
}
function calculatePhysicsM6() {
    const p = document.getElementById('physics-m6-select').value;
    const resBox = document.getElementById('physics-m6-result');
    const toRad = deg => (deg * Math.PI) / 180;
    const k = 8.9875e9; // ค่าคงที่คูลอมบ์
    const h = 6.626e-34; // ค่าคงตัวพลังค์
    const c = 3.0e8;     // ความเร็วแสง

    // 1. ไฟฟ้าสถิต
    if (p === 'm6_electro_f') {
        let q1 = Math.abs(parseFloat(document.getElementById('m6_q1').value));
        let q2 = Math.abs(parseFloat(document.getElementById('m6_q2').value));
        let r = parseFloat(document.getElementById('m6_r').value);
        let f = (k * q1 * q2) / (r * r);
        resBox.innerText = `แรงระหว่างประจุ (F) = ${f.toExponential(3)} N`;
    } else if (p === 'm6_electro_e') {
        let q = Math.abs(parseFloat(document.getElementById('m6_q').value));
        let r = parseFloat(document.getElementById('m6_r').value);
        let e = (k * q) / (r * r);
        resBox.innerText = `สนามไฟฟ้า (E) = ${e.toExponential(3)} N/C`;
    } else if (p === 'm6_electro_v') {
        let q = parseFloat(document.getElementById('m6_q').value);
        let r = parseFloat(document.getElementById('m6_r').value);
        let v = (k * q) / r;
        resBox.innerText = `ศักย์ไฟฟ้า (V) = ${v.toExponential(3)} V`;
    } else if (p === 'm6_electro_w') {
        let q = parseFloat(document.getElementById('m6_q').value);
        let va = parseFloat(document.getElementById('m6_va').value);
        let vb = parseFloat(document.getElementById('m6_vb').value);
        resBox.innerText = `งาน (W) = ${q * (vb - va)} J`;
    } else if (p === 'm6_electro_c') {
        let q = parseFloat(document.getElementById('m6_q').value);
        let v = parseFloat(document.getElementById('m6_v').value);
        resBox.innerText = `ความจุไฟฟ้า (C) = ${(q / v).toExponential(3)} F`;
    } else if (p === 'm6_electro_u') {
        let cap = parseFloat(document.getElementById('m6_c').value);
        let v = parseFloat(document.getElementById('m6_v').value);
        resBox.innerText = `พลังงานสะสม (U) = ${0.5 * cap * v * v} J`;
    }

    // 2. ไฟฟ้ากระแส
    else if (p === 'm6_dc_i') {
        let q = parseFloat(document.getElementById('m6_q').value);
        let t = parseFloat(document.getElementById('m6_t').value);
        resBox.innerText = `กระแสไฟฟ้า (I) = ${q / t} A`;
    } else if (p === 'm6_dc_ohm') {
        let i = parseFloat(document.getElementById('m6_i').value);
        let r = parseFloat(document.getElementById('m6_r_ohm').value);
        resBox.innerText = `ความต่างศักย์ (V) = ${i * r} V`;
    } else if (p === 'm6_dc_rho') {
        let rho = parseFloat(document.getElementById('m6_rho').value);
        let l = parseFloat(document.getElementById('m6_l').value);
        let a = parseFloat(document.getElementById('m6_a').value);
        resBox.innerText = `ความต้านทาน (R) = ${(rho * l / a).toFixed(3)} Ω`;
    } else if (p === 'm6_dc_power') {
        let v = parseFloat(document.getElementById('m6_v').value);
        let i = parseFloat(document.getElementById('m6_i').value);
        resBox.innerText = `กำลังไฟฟ้า (P) = ${v * i} W`;
    } else if (p === 'm6_dc_emf') {
        let emf = parseFloat(document.getElementById('m6_emf').value);
        let bigR = parseFloat(document.getElementById('m6_bigR').value);
        let smallr = parseFloat(document.getElementById('m6_smallr').value);
        resBox.innerText = `กระแสไฟฟ้าในวงจร (I) = ${(emf / (bigR + smallr)).toFixed(2)} A`;
    }

    // 3. แม่เหล็ก
    else if (p === 'm6_mag_fqv') {
        let q = parseFloat(document.getElementById('m6_q').value);
        let v = parseFloat(document.getElementById('m6_v').value);
        let b = parseFloat(document.getElementById('m6_b').value);
        let deg = parseFloat(document.getElementById('m6_deg').value);
        resBox.innerText = `แรงแม่เหล็ก (F) = ${q * v * b * Math.sin(toRad(deg))} N`;
    } else if (p === 'm6_mag_fil') {
        let i = parseFloat(document.getElementById('m6_i').value);
        let l = parseFloat(document.getElementById('m6_l').value);
        let b = parseFloat(document.getElementById('m6_b').value);
        let deg = parseFloat(document.getElementById('m6_deg').value);
        resBox.innerText = `แรงแม่เหล็ก (F) = ${i * l * b * Math.sin(toRad(deg))} N`;
    } else if (p === 'm6_mag_r') {
        let m = parseFloat(document.getElementById('m6_m').value);
        let v = parseFloat(document.getElementById('m6_v').value);
        let q = parseFloat(document.getElementById('m6_q').value);
        let b = parseFloat(document.getElementById('m6_b').value);
        resBox.innerText = `รัศมีการเคลื่อนที่ (r) = ${(m * v / (q * b)).toFixed(3)} m`;
    } else if (p === 'm6_ac_vrms') {
        let vmax = parseFloat(document.getElementById('m6_vmax').value);
        resBox.innerText = `Vrms = ${(vmax / Math.SQRT2).toFixed(2)} V`;
    } else if (p === 'm6_ac_xc') {
        let f = parseFloat(document.getElementById('m6_f').value);
        let cap = parseFloat(document.getElementById('m6_c').value);
        resBox.innerText = `Xc = ${(1 / (2 * Math.PI * f * cap)).toFixed(2)} Ω`;
    } else if (p === 'm6_ac_xl') {
        let f = parseFloat(document.getElementById('m6_f').value);
        let l = parseFloat(document.getElementById('m6_l').value);
        resBox.innerText = `Xl = ${(2 * Math.PI * f * l).toFixed(2)} Ω`;
    } else if (p === 'm6_ac_z') {
        let r = parseFloat(document.getElementById('m6_r').value);
        let xl = parseFloat(document.getElementById('m6_xl').value);
        let xc = parseFloat(document.getElementById('m6_xc').value);
        let z = Math.sqrt(r * r + Math.pow(xl - xc, 2));
        resBox.innerText = `ความต้านทานเชิงซ้อน (Z) = ${z.toFixed(2)} Ω`;
    }

    // 4. คลื่นแม่เหล็กไฟฟ้า
    else if (p === 'm6_emw_c') {
        let freq = parseFloat(document.getElementById('m6_f').value);
        let lam = parseFloat(document.getElementById('m6_lam').value);
        resBox.innerText = `ความเร็ว (c) = ${freq * lam} m/s`;
    } else if (p === 'm6_emw_i') {
        let pow = parseFloat(document.getElementById('m6_p').value);
        let r = parseFloat(document.getElementById('m6_r').value);
        resBox.innerText = `ความเข้มคลื่น (I) = ${(pow / (4 * Math.PI * r * r)).toExponential(3)} W/m²`;
    } else if (p === 'm6_emw_eb') {
        let b = parseFloat(document.getElementById('m6_b').value);
        resBox.innerText = `สนามไฟฟ้า (E) = ${(c * b).toExponential(3)} V/m`;
    }

    // 5. ฟิสิกส์อะตอม
    else if (p === 'm6_atom_e') {
        let freq = parseFloat(document.getElementById('m6_f').value);
        resBox.innerText = `พลังงานโฟตอน (E) = ${(h * freq).toExponential(3)} J`;
    } else if (p === 'm6_atom_photo') {
        let hf = parseFloat(document.getElementById('m6_hf').value);
        let w = parseFloat(document.getElementById('m6_w').value);
        resBox.innerText = `พลังงานจลน์สูงสุด (Ek_max) = ${hf - w}`;
    } else if (p === 'm6_atom_en') {
        let n = parseFloat(document.getElementById('m6_n').value);
        resBox.innerText = `ระดับพลังงาน (E${n}) = ${(-13.6 / (n * n)).toFixed(2)} eV`;
    } else if (p === 'm6_atom_debroglie') {
        let m = parseFloat(document.getElementById('m6_m').value);
        let v = parseFloat(document.getElementById('m6_v').value);
        resBox.innerText = `ความยาวคลื่นเดอบรอยล์ (λ) = ${(h / (m * v)).toExponential(3)} m`;
    }

    // 6. ฟิสิกส์นิวเคลียร์
    else if (p === 'm6_nuc_decay') {
        let n0 = parseFloat(document.getElementById('m6_n0').value);
        let t = parseFloat(document.getElementById('m6_t').value);
        let t12 = parseFloat(document.getElementById('m6_t12').value);
        let nt = n0 * Math.pow(0.5, t / t12);
        resBox.innerText = `ปริมาณที่เหลือ (Nt) = ${nt.toFixed(3)}`;
    } else if (p === 'm6_nuc_act') {
        let lambda = parseFloat(document.getElementById('m6_lambda').value);
        let n = parseFloat(document.getElementById('m6_n').value);
        resBox.innerText = `กัมมันตภาพ (A) = ${(lambda * n).toExponential(3)} Bq`;
    } else if (p === 'm6_nuc_t12') {
        let lambda = parseFloat(document.getElementById('m6_lambda').value);
        resBox.innerText = `ครึ่งชีวิต (T½) = ${(0.693 / lambda).toFixed(3)} s`;
    } else if (p === 'm6_nuc_mass_energy') {
        let dm = parseFloat(document.getElementById('m6_dm').value);
        resBox.innerText = `พลังงาน (E) = ${(dm * 931.5).toFixed(2)} MeV`;
    }
}
