<script lang="ts">
  import { goto } from "$app/navigation";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import Icon from "@iconify/svelte";

  const pageTitle = "Magang Internal";
  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
      icon: "heroicons:home",
    },
    {
      label: "BKP",
      href: "/bkp-info",
      icon: "heroicons:information-circle",
    },
    {
      label: pageTitle,
      icon: "heroicons:building-office",
    },
  ];

  function handleBack() {
    goto("/bkp-info");
  }
</script>

<div class="min-h-screen bg-base-100">
  <div class="container mx-auto px-4 py-8">
    <Breadcrumbs items={breadcrumbItems} />

    <div class="mb-8">
      <div class="mb-4 flex items-center gap-3">
        <div class="rounded-lg bg-gradient-to-br from-pink-500 to-pink-700 p-3">
          <Icon icon="heroicons:building-office" class="h-8 w-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold">{pageTitle}</h1>
      </div>
      <p class="text-base-content/70">Magang di unit kerja atau laboratorium internal ITS</p>
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
            Magang Internal adalah program yang memfasilitasi mahasiswa untuk mendapatkan pengalaman
            kerja praktis di unit kerja atau laboratorium di lingkungan ITS. Program ini memberikan
            kesempatan untuk belajar langsung dari dosen dan staf ahli sambil berkontribusi pada
            kegiatan akademik atau operasional kampus.
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
            <li>Mahasiswa aktif minimal semester 5</li>
            <li>IPK minimal 2.75</li>
            <li>Mendapat persetujuan dari kepala unit/lab yang dituju</li>
            <li>Memiliki pembimbing lapangan dari unit/lab tersebut</li>
            <li>Ruang lingkup pekerjaan relevan dengan bidang studi</li>
            <li>Komitmen waktu minimal 20 jam per minggu</li>
          </ul>
        </div>
      </div>

      <!-- Internship Places -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:map-pin" class="h-6 w-6" />
            Tempat Magang Internal
          </h2>
          <div class="grid gap-3 md:grid-cols-2">
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">Laboratorium Departemen</p>
              <p class="text-sm text-base-content/70">Lab RPL, AI, Jaringan, Multimedia, dll</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">Unit IT ITS</p>
              <p class="text-sm text-base-content/70">Direktorat IT, PPTI</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">Pusat Penelitian</p>
              <p class="text-sm text-base-content/70">Berbagai research center di ITS</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">UPT</p>
              <p class="text-sm text-base-content/70">UPT Perpustakaan, UPT TIK, dll</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">Lembaga/Unit Akademik</p>
              <p class="text-sm text-base-content/70">LPPM, P3AI, dll</p>
            </div>
            <div class="rounded-lg border border-base-300 p-3">
              <p class="font-semibold">Startup/Spinoff ITS</p>
              <p class="text-sm text-base-content/70">Perusahaan rintisan di lingkungan ITS</p>
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
            <li>Surat pengantar dari departemen</li>
            <li>Transkrip nilai terbaru</li>
            <li>Surat persetujuan dari kepala unit/lab</li>
            <li>Job description dari pembimbing lapangan</li>
            <li>Proposal kegiatan magang</li>
            <li>Timeline dan target deliverables</li>
            <li>Surat pernyataan kesediaan dari pembimbing lapangan</li>
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
              <p class="text-base-content/70">3 bulan (400 jam kerja efektif)</p>
            </div>
            <div>
              <p class="font-semibold">Konversi SKS</p>
              <p class="text-base-content/70">3-20 SKS (berdasarkan durasi dan beban kerja)</p>
            </div>
          </div>
          <p class="mt-3 text-sm text-base-content/60">
            1 SKS = ±170 jam kerja efektif. SKS akan ditentukan berdasarkan durasi, kompleksitas
            pekerjaan, dan deliverables.
          </p>
        </div>
      </div>

      <!-- Work Scope Examples -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:briefcase" class="h-6 w-6" />
            Contoh Ruang Lingkup Pekerjaan
          </h2>
          <ul class="list-disc space-y-2 pl-6">
            <li>Pengembangan sistem informasi untuk unit kerja</li>
            <li>Asisten riset dalam proyek penelitian dosen</li>
            <li>Maintenance dan improvement website/aplikasi kampus</li>
            <li>Pengembangan tools/utilities untuk laboratorium</li>
            <li>Data analysis dan visualization untuk unit</li>
            <li>Technical support dan helpdesk IT</li>
            <li>Dokumentasi sistem dan pembuatan user guide</li>
            <li>Training dan workshop untuk civitas akademika</li>
          </ul>
        </div>
      </div>

      <!-- Benefits -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:star" class="h-6 w-6" />
            Keuntungan
          </h2>
          <ul class="list-disc space-y-2 pl-6">
            <li>Akses mudah ke tempat magang (masih di lingkungan kampus)</li>
            <li>Networking dengan dosen dan staf ITS</li>
            <li>Pemahaman lebih dalam tentang operasional kampus</li>
            <li>Fleksibilitas waktu yang lebih tinggi</li>
            <li>Bimbingan langsung dari expert di bidangnya</li>
            <li>Kontribusi nyata untuk kemajuan ITS</li>
            <li>Potensi untuk melanjutkan sebagai asisten atau staff</li>
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
            <li>Identifikasi unit/lab yang menerima magang internal</li>
            <li>Hubungi kepala unit/lab untuk menyampaikan minat</li>
            <li>Diskusi ruang lingkup pekerjaan dan ekspektasi</li>
            <li>Buat proposal magang dengan target yang jelas</li>
            <li>Mendapat surat persetujuan dari unit/lab</li>
            <li>Mengurus surat pengantar dari departemen</li>
            <li>Submit pengajuan BKP melalui MyIf Monev</li>
            <li>Upload semua dokumen pendukung</li>
            <li>Menunggu approval dari koordinator BKP</li>
            <li>Mulai magang dengan bimbingan rutin</li>
            <li>Submit laporan berkala dan deliverables</li>
            <li>Presentasi hasil dan submit laporan akhir</li>
          </ol>
        </div>
      </div>

      <!-- Tips -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:light-bulb" class="h-6 w-6" />
            Tips Sukses
          </h2>
          <ul class="list-disc space-y-2 pl-6">
            <li>Pilih unit/lab yang sesuai dengan minat dan career path</li>
            <li>Tunjukkan inisiatif dan profesionalitas</li>
            <li>Manfaatkan kesempatan untuk belajar dari expert</li>
            <li>Dokumentasikan setiap pekerjaan dengan baik</li>
            <li>Komunikasi aktif dengan pembimbing lapangan</li>
            <li>Networking dengan staf dan mahasiswa lain</li>
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
