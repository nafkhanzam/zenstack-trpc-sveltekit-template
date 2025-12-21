<script lang="ts">
  import { goto } from "$app/navigation";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import Icon from "@iconify/svelte";

  const pageTitle = "Wirausaha";
  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
      icon: "heroicons:home",
    },
    {
      label: "New BKP",
      href: "/new-bkp",
      icon: "heroicons:plus",
    },
    {
      label: pageTitle,
      icon: "heroicons:banknotes",
    },
  ];

  function handleBack() {
    goto("/new-bkp");
  }
</script>

<div class="min-h-screen bg-base-100">
  <div class="container mx-auto px-4 py-8">
    <Breadcrumbs items={breadcrumbItems} />

    <div class="mb-8">
      <div class="mb-4 flex items-center gap-3">
        <div class="rounded-lg bg-gradient-to-br from-green-500 to-green-700 p-3">
          <Icon icon="heroicons:banknotes" class="h-8 w-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold">{pageTitle}</h1>
      </div>
      <p class="text-base-content/70">
        Kegiatan kewirausahaan atau startup yang dikembangkan mahasiswa
      </p>
    </div>

    <div class="grid gap-6">
      <!-- Overview -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:information-circle" class="h-6 w-6" />
            Overview
          </h2>
          <p>
            BKP Wirausaha mendukung mahasiswa yang mengembangkan bisnis atau startup berbasis teknologi.
            Program ini mengakui usaha kewirausahaan sebagai pembelajaran praktis yang mengintegrasikan
            pengetahuan teknis dengan keterampilan bisnis, manajemen, dan inovasi.
          </p>
        </div>
      </div>

      <!-- Requirements -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:clipboard-document-check" class="h-6 w-6" />
            Persyaratan
          </h2>
          <ul class="list-disc space-y-2 pl-6">
            <li>Mahasiswa aktif dengan status akademik baik</li>
            <li>IPK minimal 2.50</li>
            <li>Memiliki usaha/startup yang sudah berjalan minimal 3 bulan</li>
            <li>Produk/layanan berbasis teknologi atau digital</li>
            <li>Memiliki legalitas usaha (minimal surat keterangan usaha)</li>
            <li>Mendapat persetujuan dari dosen pembimbing wirausaha</li>
            <li>Dapat menunjukkan bukti operasional usaha</li>
          </ul>
        </div>
      </div>

      <!-- Business Categories -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:squares-2x2" class="h-6 w-6" />
            Kategori Usaha yang Diakui
          </h2>
          <div class="grid gap-3 md:grid-cols-2">
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">Software as a Service (SaaS)</p>
              <p class="text-sm text-base-content/70">Platform/aplikasi berbasis cloud</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">Mobile/Web Application</p>
              <p class="text-sm text-base-content/70">Aplikasi mobile atau web</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">E-Commerce</p>
              <p class="text-sm text-base-content/70">Toko online, marketplace</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">Digital Agency</p>
              <p class="text-sm text-base-content/70">Jasa pembuatan website, aplikasi</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">EdTech/FinTech</p>
              <p class="text-sm text-base-content/70">Platform pendidikan/finansial</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">Tech-Enabled Services</p>
              <p class="text-sm text-base-content/70">Layanan dengan komponen teknologi</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Documents -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:document-text" class="h-6 w-6" />
            Dokumen yang Diperlukan
          </h2>
          <ul class="list-disc space-y-2 pl-6">
            <li>Business plan atau proposal usaha</li>
            <li>Bukti legalitas usaha (SIUP, NIB, atau surat keterangan)</li>
            <li>Profil dan portofolio produk/layanan</li>
            <li>Bukti operasional (transaksi, klien, revenue)</li>
            <li>Dokumentasi produk (screenshot, demo, repository)</li>
            <li>Laporan keuangan sederhana (minimal 3 bulan)</li>
            <li>Surat persetujuan dari dosen pembimbing wirausaha</li>
            <li>Rencana pengembangan usaha</li>
          </ul>
        </div>
      </div>

      <!-- Duration & Credits -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:clock" class="h-6 w-6" />
            Durasi & SKS
          </h2>
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <p class="font-semibold">Durasi Minimal</p>
              <p class="text-base-content/70">1 semester (6 bulan)</p>
            </div>
            <div>
              <p class="font-semibold">Konversi SKS</p>
              <p class="text-base-content/70">4-20 SKS (berdasarkan skala usaha)</p>
            </div>
          </div>
          <p class="mt-3 text-sm text-base-content/60">
            SKS ditentukan berdasarkan: skala usaha, omzet, dampak sosial, inovasi teknologi, dan tingkat
            keterlibatan mahasiswa.
          </p>
        </div>
      </div>

      <!-- Evaluation Criteria -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:chart-bar" class="h-6 w-6" />
            Kriteria Penilaian
          </h2>
          <ul class="list-disc space-y-2 pl-6">
            <li>Inovasi dan keunikan produk/layanan</li>
            <li>Kompleksitas teknologi yang digunakan</li>
            <li>Skala operasional dan jumlah pengguna/klien</li>
            <li>Revenue dan sustainability model</li>
            <li>Dampak sosial atau ekonomi</li>
            <li>Team management dan leadership</li>
            <li>Marketing dan customer acquisition strategy</li>
            <li>Potensi pertumbuhan dan skalabilitas</li>
          </ul>
        </div>
      </div>

      <!-- Reporting Requirements -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:clipboard-document-list" class="h-6 w-6" />
            Kewajiban Pelaporan
          </h2>
          <ul class="list-disc space-y-2 pl-6">
            <li>Laporan progress bulanan kepada dosen pembimbing</li>
            <li>Update metrics bisnis (users, revenue, growth)</li>
            <li>Dokumentasi product development</li>
            <li>Laporan keuangan berkala</li>
            <li>Laporan akhir komprehensif di akhir periode</li>
            <li>Presentasi business review</li>
          </ul>
        </div>
      </div>

      <!-- Process -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:arrow-path" class="h-6 w-6" />
            Alur Pengajuan
          </h2>
          <ol class="list-decimal space-y-3 pl-6">
            <li>Pastikan usaha sudah berjalan minimal 3 bulan</li>
            <li>Siapkan dokumentasi lengkap tentang usaha</li>
            <li>Mencari dosen pembimbing wirausaha</li>
            <li>Konsultasi dan presentasi business plan</li>
            <li>Buat proposal BKP Wirausaha</li>
            <li>Mengurus legalitas usaha jika belum ada</li>
            <li>Submit pengajuan melalui MyIf Monev</li>
            <li>Upload semua dokumen pendukung</li>
            <li>Menunggu evaluasi dari tim penilai</li>
            <li>Menjalankan usaha dengan bimbingan rutin</li>
            <li>Submit laporan berkala dan presentasi akhir</li>
          </ol>
        </div>
      </div>

      <!-- Support & Resources -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:sparkles" class="h-6 w-6" />
            Dukungan & Fasilitas
          </h2>
          <ul class="list-disc space-y-2 pl-6">
            <li>Bimbingan dari dosen pembimbing wirausaha</li>
            <li>Akses ke mentor bisnis dan industri</li>
            <li>Networking dengan startup ecosystem ITS</li>
            <li>Kesempatan pitching di event kampus</li>
            <li>Akses ke inkubator bisnis ITS (jika ada)</li>
            <li>Potensi funding atau grant untuk startup terbaik</li>
          </ul>
        </div>
      </div>

      <!-- Back Button -->
      <div class="flex justify-end">
        <button onclick={handleBack} class="btn btn-primary">
          <Icon icon="heroicons:arrow-left" class="h-5 w-5" />
          Kembali ke Pilihan BKP
        </button>
      </div>
    </div>
  </div>
</div>
