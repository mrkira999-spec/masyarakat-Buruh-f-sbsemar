const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


async function handleGrievanceSubmit(event) {
    event.preventDefault();
    
    const namaPelapor = document.getElementById('namaPelapor').value;
    const isiAduan = document.getElementById('isiAduan').value;
    const kategori = document.getElementById('kategoriAduan').value;

    const { data, error } = await supabaseClient
        .from('aduan_buruh')
        .insert([{ nama: namaPelapor, isi: isiAduan, kategori: kategori, status: 'Pending' }]);

    if (error) {
        alert('Gagal mengirim aduan: ' + error.message);
    } else {
        alert('Aduan berhasil dikirim ke posko pusat.');
        document.getElementById('formAduan').reset();
    }
}

async function loadPublicNews() {
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) return;

    const { data, error } = await supabaseClient
        .from('berita')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        newsContainer.innerHTML = '<p>Gagal memuat berita.</p>';
        return;
    }

    newsContainer.innerHTML = data.map(item => `
        <article class="news-card">
            <span class="category-tag">${item.kategori}</span>
            <h3>${item.judul}</h3>
            <p>${item.konten.substring(0, 150)}...</p>
            <small>${new Date(item.created_at).toLocaleDateString('id-ID')}</small>
        </article>
    `).join('');
}

async function handlePublishNews(event) {
    event.preventDefault();

    const judul = document.getElementById('adminJudul').value;
    const konten = document.getElementById('adminKonten').value;
    const kategori = document.getElementById('adminKategori').value;

    const { data, error } = await supabaseClient
        .from('berita')
        .insert([{ judul: judul, konten: konten, kategori: kategori }]);

    if (error) {
        alert('Gagal mem Publikasikan: ' + error.message);
    } else {
        alert('Berita/Press Release berhasil disiarkan ke portal.');
        document.getElementById('formAdminNews').reset();
        loadAdminGrievances(); // Refresh data panel
    }
}

async function loadAdminGrievances() {
    const tableBody = document.getElementById('admin-aduan-table');
    if (!tableBody) return;

    const { data, error } = await supabaseClient
        .from('aduan_buruh')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        tableBody.innerHTML = '<tr><td colspan="4">Gagal memuat data aduan.</td></tr>';
        return;
    }

    tableBody.innerHTML = data.map(aduan => `
        <tr>
            <td>${aduan.nama}</td>
            <td>${aduan.kategori}</td>
            <td>${aduan.isi}</td>
            <td><span class="badge ${aduan.status}">${aduan.status}</span></td>
        </tr>
    `).join('');
}