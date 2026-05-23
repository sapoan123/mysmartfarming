// ========== MOBILE MENU TOGGLE ==========
const toggleBtn = document.getElementById("mobileToggle");
const navLinks = document.getElementById("navLinks");
if (toggleBtn && navLinks) {
  toggleBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });
}

// ========== TOMBOL INTERAKSI ==========
document.getElementById("startNowBtn")?.addEventListener("click", () => {
  alert("🚀 Selamat datang di Smart Farming IoT! Dashboard akan memantau lahan Anda secara real-time.");
});
document.getElementById("learnMoreBtn")?.addEventListener("click", () => {
  alert("🌱 Pelajari lebih lanjut: Sistem ini menggunakan ESP32, sensor tanah, dan notifikasi otomatis untuk petani semangka.");
});

// ========== SIMULASI DATA IoT REAL-TIME ==========
// Elemen dashboard
const moistureValueSpan = document.getElementById("moistureValue");
const moistureFill = document.getElementById("moistureFill");
const moistureStatusSpan = document.getElementById("moistureStatus");
const pupukValueSpan = document.getElementById("pupukValue");
const pupukFill = document.getElementById("pupukFill");
const pupukSisaText = document.getElementById("pupukSisaText");
const pestisidaValueSpan = document.getElementById("pestisidaValue");
const pestisidaFill = document.getElementById("pestisidaFill");
const pestisidaWarningSpan = document.getElementById("pestisidaWarningSpan");
const notificationList = document.getElementById("notificationList");
const heroMoistureSpan = document.getElementById("heroMoistureSpan");
const pupukStatusBadge = document.getElementById("pupukStatusBadge");

// State simulasi
let moisture = 68;           // persen
let pupukStock = 240;        // liter
let pestisidaStock = 85;     // liter
let isFertilizing = false;
let lastNotificationTime = Date.now();

// Helper: update semua tampilan
function updateUI() {
  // Kelembaban tanah
  if (moistureValueSpan) moistureValueSpan.innerText = Math.floor(moisture);
  if (heroMoistureSpan) heroMoistureSpan.innerText = Math.floor(moisture) + "%";
  if (moistureFill) moistureFill.style.width = moisture + "%";
  if (moistureStatusSpan) {
    if (moisture < 45) moistureStatusSpan.innerText = "Kering ⚠️";
    else if (moisture < 65) moistureStatusSpan.innerText = "Cukup";
    else moistureStatusSpan.innerText = "Optimal";
    moistureStatusSpan.className = moisture < 45 ? "badge-green" : "badge-green";
  }
  
  // Stok Pupuk
  let pupukPercent = (pupukStock / 240) * 100;
  if (pupukPercent < 0) pupukPercent = 0;
  if (pupukValueSpan) pupukValueSpan.innerText = Math.floor(pupukStock);
  if (pupukFill) pupukFill.style.width = pupukPercent + "%";
  if (pupukSisaText) pupukSisaText.innerText = `Sisa: ${Math.floor(pupukPercent)}%`;
  
  // Stok Pestisida
  let pestPersen = (pestisidaStock / 85) * 100;
  if (pestPersen < 0) pestPersen = 0;
  if (pestisidaValueSpan) pestisidaValueSpan.innerText = Math.floor(pestisidaStock);
  if (pestisidaFill) pestisidaFill.style.width = pestPersen + "%";
  if (pestisidaWarningSpan) {
    if (pestisidaStock < 25) pestisidaWarningSpan.innerText = "KRITIS! Segera isi ulang";
    else if (pestisidaStock < 45) pestisidaWarningSpan.innerText = "Perlu perhatian";
    else pestisidaWarningSpan.innerText = "Stok aman";
  }
  
  // Status pemupukan badge di hero
  if (pupukStatusBadge) {
    if (isFertilizing) pupukStatusBadge.innerHTML = '<i class="fas fa-spray-can"></i> Pemupukan: AKTIF';
    else pupukStatusBadge.innerHTML = '<i class="fas fa-spray-can"></i> Pemupukan: siaga';
  }
}

// Menambahkan notifikasi baru (max 5 terbaru)
function addNotification(message, icon = "fas fa-info-circle") {
  if (!notificationList) return;
  const newNotif = document.createElement("div");
  newNotif.className = "notif-item";
  newNotif.innerHTML = `<i class="${icon}" style="color:#1f8a4c"></i> ${message}`;
  notificationList.prepend(newNotif);
  // batasi jumlah notifikasi
  while (notificationList.children.length > 5) {
    notificationList.removeChild(notificationList.lastChild);
  }
}

// Simulasi perubahan acak dengan logika pertanian
function simulateIoTData() {
  // 1. Kelembaban berubah perlahan (simulasi cuaca & pemupukan)
  let change = (Math.random() - 0.5) * 3.5;
  moisture += change;
  if (moisture > 90) moisture = 90;
  if (moisture < 25) moisture = 25;
  
  // 2. Pemupukan otomatis: jika kelembaban di bawah 50% dan pupuk tersedia, lakukan pemupukan
  if (!isFertilizing && moisture < 50 && pupukStock >= 5) {
    isFertilizing = true;
    addNotification("🌾 Pemupukan otomatis dimulai (kelembaban rendah)", "fas fa-tint");
    // efek pemupukan: menambah kelembaban sedikit dan mengurangi stok
    setTimeout(() => {
      moisture = Math.min(moisture + 12, 85);
      let used = Math.floor(Math.random() * 6) + 4;
      pupukStock = Math.max(0, pupukStock - used);
      isFertilizing = false;
      addNotification(`✅ Pemupukan selesai. Pupuk terpakai ${used} L. Kelembaban naik.`, "fas fa-check-circle");
      updateUI();
      // cek stok pupuk menipis
      if (pupukStock < 50) addNotification("⚠️ Stok pupuk di bawah 50 liter, segera isi ulang!", "fas fa-exclamation-triangle");
    }, 1800);
  }
  
  // 3. Simulasi penyemprotan pestisida jika hama terdeteksi (acak 5% setiap interval)
  if (pestisidaStock > 0 && Math.random() < 0.05) {
    let usedPest = Math.floor(Math.random() * 4) + 2;
    pestisidaStock = Math.max(0, pestisidaStock - usedPest);
    addNotification(`🐛 Deteksi hama! Penyemprotan otomatis, pestisida terpakai ${usedPest} L.`, "fas fa-bug");
    if (pestisidaStock < 20) addNotification("⚠️ Stok pestisida sangat rendah! Segera tambah persediaan.", "fas fa-exclamation-circle");
  }
  
  // 4. Simulasi konsumsi pupuk harian (sedikit berkurang seiring waktu)
  if (!isFertilizing && Math.random() < 0.1 && pupukStock > 0) {
    let dailyUse = Math.random() * 1.2;
    pupukStock = Math.max(0, pupukStock - dailyUse);
    if (dailyUse > 0.2) addNotification(`📉 Pupuk terpakai ${dailyUse.toFixed(1)} L karena evapotranspirasi.`, "fas fa-chart-line");
    if (pupukStock < 50 && pupukStock > 0) addNotification("💡 Stok pupuk menipis, rencanakan pembelian.", "fas fa-lightbulb");
  }
  
  // 5. Notifikasi keamanan simulasi (sesekali)
  if (Math.random() < 0.03) {
    addNotification("🔒 Sensor keamanan: tidak ada gerak mencurigakan", "fas fa-shield-alt");
  }
  
  // Update tampilan akhir
  updateUI();
}

// Simulasi loop setiap 4 detik
setInterval(() => {
  simulateIoTData();
}, 4000);

// ========== NOTIFIKASI AWAL SISTEM ==========
setTimeout(() => {
  addNotification("🌱 Sistem Smart Farming IoT siap memantau lahan semangka Anda.", "fas fa-leaf");
  addNotification("📡 Data sensor terhubung: kelembaban, suhu, NPK, dan cuaca real-time.", "fas fa-microchip");
}, 500);

// ========== RESET STOK SIMULASI (tambahan interaktivitas) ==========
// Optional: jika user mengklik logo atau tombol tertentu? Untuk demo, tidak perlu, tapi biar lebih hidup
// Kita tambahkan efek pada logo? tidak wajib. Namun untuk kelengkapan, tidak perlu.
console.log("Smart Farming IoT — Simulasi real-time aktif");

// Inisialisasi tampilan awal
updateUI();

// Tambahan: animasi progress bar smooth dan update awal untuk badge pestisida
simulateIoTData(); // panggil sekali untuk sinkronisasi