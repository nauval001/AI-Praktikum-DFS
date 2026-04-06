import * as readline from 'readline';

// 1. Tipe Data dan Struktur
type Kategori = 'Masak Cepat' | 'Masak Sedang';

interface Resep {
    nama: string;
    kategori: Kategori;
    bahanWajib: string[];
}

// Database Resep
const databaseResep: Resep[] = [
    { nama: 'Mie Goreng', kategori: 'Masak Cepat', bahanWajib: ['mie instan', 'bawang putih', 'kecap', 'minyak', 'garam'] },
    { nama: 'Telur Dadar', kategori: 'Masak Cepat', bahanWajib: ['telur', 'garam', 'minyak', 'bawang merah'] },
    { nama: 'Telur Ceplok', kategori: 'Masak Cepat', bahanWajib: ['telur', 'minyak', 'garam'] },
    { nama: 'Sosis Goreng', kategori: 'Masak Cepat', bahanWajib: ['sosis', 'minyak'] },
    { nama: 'Kornet Goreng', kategori: 'Masak Cepat', bahanWajib: ['kornet', 'minyak'] },
    { nama: 'Nasi Goreng', kategori: 'Masak Sedang', bahanWajib: ['nasi', 'telur', 'bawang putih', 'bawang merah', 'kecap'] },
    { nama: 'Tempe Goreng', kategori: 'Masak Sedang', bahanWajib: ['tempe', 'bawang putih', 'garam'] },
    { nama: 'Tumis Kol', kategori: 'Masak Sedang', bahanWajib: ['kol', 'bawang putih', 'bawang merah', 'garam'] },
    { nama: 'Tumis Tempe', kategori: 'Masak Sedang', bahanWajib: ['tempe', 'kecap', 'cabe', 'saus tiram'] },
];

// 2. Struktur Node untuk Pohon Pelacakan (Tree)
class TreeNode {
    nama: string;
    children: TreeNode[];
    resep?: Resep;

    constructor(nama: string, resep?: Resep) {
        this.nama = nama;
        this.children = [];
        this.resep = resep;
    }

    tambahChild(node: TreeNode) {
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
    } else {
        masakSedang.tambahChild(new TreeNode(resep.nama, resep));
    }
});

// Array untuk menyimpan hasil akhir
const hasilPencarian: { nama: string, persentase: number, status: string, kurang: string[] }[] = [];

// 3. Fungsi Evaluasi Resep
function evaluasiResep(resep: Resep, bahanTersedia: string[]) {
    let bahanCocok = 0;
    const bahanKurang: string[] = [];
    
    resep.bahanWajib.forEach(bahan => {
        if (bahanTersedia.includes(bahan)) {
            bahanCocok++;
        } else {
            bahanKurang.push(bahan);
        }
    });

    const persentase = Math.round((bahanCocok / resep.bahanWajib.length) * 100);
    let status = "";

    if (persentase === 100) {
        status = "Bisa Dibuat";
    } else if (persentase >= 50) {
        status = "Hampir Bisa";
    } else {
        status = "Tidak Bisa";
    }

    return { persentase, status, bahanKurang };
}

// 4. Implementasi Algoritma DFS
let langkah = 1;

function jalankanDFS(node: TreeNode, bahanTersedia: string[]) {
    if (node.nama === "ROOT") {
        console.log(`\n--- PROSES PENCARIAN DFS ---`);
        console.log(`Langkah ${langkah++}: Sistem dimulai dari titik awal (ROOT).`);
    } else if (node.nama === "Masak Cepat" || node.nama === "Masak Sedang") {
        console.log(`Langkah ${langkah++}: Masuk ke kelompok ${node.nama}...`);
    } else if (node.resep) {
        const { persentase, status, bahanKurang } = evaluasiResep(node.resep, bahanTersedia);
        console.log(`Langkah ${langkah++}: Periksa ${node.nama} (${persentase}% bahan ada)`);
        
        // Simpan semua resep untuk direkap di akhir
        hasilPencarian.push({
            nama: node.nama,
            persentase: persentase,
            status: status,
            kurang: bahanKurang
        });
    }

    // Rekursi untuk menelusuri anak cabang (Depth-First)
    for (const child of node.children) {
        jalankanDFS(child, bahanTersedia);
    }
}

// 5. Konfigurasi Input Terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("=== SISTEM PENCARIAN RESEP ===");
console.log("Bahan-bahan tersedia: telur, mie instan, kecap, garam, minyak, bawang putih, bawang merah");

rl.question('Masukkan bahan-bahan yang Anda miliki (pisahkan dengan koma): ', (input) => {
    // Membersihkan input: pecah berdasarkan koma, hapus spasi ekstra, jadikan huruf kecil
    const bahanTersedia = input.split(',')
                               .map(bahan => bahan.trim().toLowerCase())
                               .filter(bahan => bahan !== ""); // Hapus input kosong
    
    if (bahanTersedia.length === 0) {
        console.log("Anda tidak memasukkan bahan apa pun. Program dihentikan.");
        rl.close();
        return;
    }

    console.log(`\nBahan terdeteksi: [ ${bahanTersedia.join(', ')} ]`);

    // Jalankan algoritma
    jalankanDFS(root, bahanTersedia);

    // 6. Cetak Rekapitulasi Akhir
    console.log(`\n=== HASIL AKHIR (Peluang Memasak) ===`);
    
    const bisaDibuat = hasilPencarian.filter(r => r.persentase === 100);
    const hampirBisa = hasilPencarian.filter(r => r.persentase >= 50 && r.persentase < 100);
    const tidakBisa = hasilPencarian.filter(r => r.persentase < 50);

    console.log(`\n✅ 100% BISA DIBUAT (Bahan Lengkap):`);
    if (bisaDibuat.length > 0) {
        bisaDibuat.forEach(r => console.log(`  - ${r.nama}`));
    } else {
        console.log("  (Tidak ada)");
    }

    console.log(`\n⚠️ BISA DIBUAT: TIDAK LENGKAP (>50% Bahan Tersedia):`);
    if (hampirBisa.length > 0) {
        hampirBisa.forEach(r => console.log(`  - ${r.nama} (Peluang ${r.persentase}%) -> Kurang: ${r.kurang.join(', ')}`));
    } else {
        console.log("  (Tidak ada)");
    }

    console.log(`\n❌ SULIT DIBUAT (<50% Bahan Tersedia):`);
    if (tidakBisa.length > 0) {
        tidakBisa.forEach(r => console.log(`  - ${r.nama} (Peluang ${r.persentase}%)`));
    } else {
         console.log("  (Tidak ada)");
    }

    console.log("\n=====================================");
    
    // Tutup terminal readline
    rl.close();
});