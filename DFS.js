"use strict";
// Bahan yang dimasukkan pengguna (Keadaan Awal)
const bahanTersedia = [
    'telur', 'mie instan', 'kecap', 'garam',
    'minyak', 'bawang putih', 'bawang merah'
];
// Database Resep dengan simulasi bahan untuk menghasilkan persentase yang sesuai
const databaseResep = [
    // Kelompok Masak Cepat (< 15 menit)
    { nama: 'Mie Goreng', kategori: 'Masak Cepat', bahanWajib: ['mie instan', 'bawang putih', 'kecap', 'minyak', 'garam'] }, // 5/5 = 100%
    { nama: 'Telur Dadar', kategori: 'Masak Cepat', bahanWajib: ['telur', 'garam', 'minyak', 'bawang merah'] }, // 4/4 = 100%
    { nama: 'Telur Ceplok', kategori: 'Masak Cepat', bahanWajib: ['telur', 'minyak', 'garam'] }, // 3/3 = 100%
    { nama: 'Sosis Goreng', kategori: 'Masak Cepat', bahanWajib: ['sosis', 'minyak'] }, // 1/2 = 50%
    { nama: 'Kornet Goreng', kategori: 'Masak Cepat', bahanWajib: ['kornet', 'minyak'] }, // 1/2 = 50%
    // Kelompok Masak Sedang (15 - 30 menit)
    { nama: 'Nasi Goreng', kategori: 'Masak Sedang', bahanWajib: ['nasi', 'telur', 'bawang putih', 'bawang merah', 'kecap'] }, // 4/5 = 80%
    { nama: 'Tempe Goreng', kategori: 'Masak Sedang', bahanWajib: ['tempe', 'bawang putih', 'garam'] }, // 2/3 = ~66%
    { nama: 'Tumis Kol', kategori: 'Masak Sedang', bahanWajib: ['kol', 'bawang putih', 'bawang merah', 'garam'] }, // 3/4 = 75%
    { nama: 'Tumis Tempe', kategori: 'Masak Sedang', bahanWajib: ['tempe', 'kecap', 'cabe', 'saus tiram'] }, // 1/4 = 25%
];
// 2. Struktur Node untuk Pohon Pelacakan (Tree)
class TreeNode {
    nama;
    children;
    resep;
    constructor(nama, resep) {
        this.nama = nama;
        this.children = [];
        this.resep = resep;
    }
    tambahChild(node) {
        this.children.push(node);
    }
}
// Membangun Pohon (Tree) DFS
const root = new TreeNode("ROOT");
const masakCepat = new TreeNode("Masak Cepat");
const masakSedang = new TreeNode("Masak Sedang");
root.tambahChild(masakCepat);
root.tambahChild(masakSedang);
databaseResep.forEach(resep => {
    if (resep.kategori === 'Masak Cepat') {
        masakCepat.tambahChild(new TreeNode(resep.nama, resep));
    }
    else {
        masakSedang.tambahChild(new TreeNode(resep.nama, resep));
    }
});
// 3. Fungsi Evaluasi Resep
function evaluasiResep(resep, bahanTersedia) {
    let bahanCocok = 0;
    resep.bahanWajib.forEach(bahan => {
        if (bahanTersedia.includes(bahan)) {
            bahanCocok++;
        }
    });
    const persentase = (bahanCocok / resep.bahanWajib.length) * 100;
    let status = "";
    // Logika Status Pencarian
    if (persentase === 100) {
        status = "Bisa Dibuat";
    }
    else if (persentase >= 50) {
        status = "Hampir Bisa";
    }
    else {
        status = "Tidak Bisa";
    }
    return { persentase: Math.round(persentase), status };
}
// 4. Implementasi Algoritma DFS
let langkah = 1;
const resepDitemukan = [];
function jalankanDFS(node, bahanTersedia) {
    if (node.nama === "ROOT") {
        console.log(`Langkah ${langkah++}: Sistem dimulai dari titik awal (${node.nama}) dengan membaca daftar bahan pengguna: ${bahanTersedia.join(', ')}.`);
    }
    else if (node.nama === "Masak Cepat" || node.nama === "Masak Sedang") {
        console.log(`\nLangkah ${langkah++}: Masuk ke kelompok ${node.nama}...`);
    }
    else if (node.resep) {
        const { persentase, status } = evaluasiResep(node.resep, bahanTersedia);
        console.log(`Langkah ${langkah++}: Periksa ${node.nama} (${persentase}% bahan ada) - Status: ${status}`);
        if (persentase === 100) {
            resepDitemukan.push(node.nama);
        }
    }
    // Rekursi untuk menelusuri anak cabang secara mendalam (Depth-First)
    for (const child of node.children) {
        jalankanDFS(child, bahanTersedia);
    }
}
// 5. Eksekusi Program
jalankanDFS(root, bahanTersedia);
console.log(`\nLangkah ${langkah}: Semua resep sudah diperiksa. Pencarian selesai dengan ${resepDitemukan.length} resep berhasil ditemukan: ${resepDitemukan.join(', ')}.`);
