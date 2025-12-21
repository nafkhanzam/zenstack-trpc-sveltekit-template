<script lang="ts">
  import { goto } from "$app/navigation";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import Icon from "@iconify/svelte";

  const pageTitle = "Magang Berdampak";
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
      icon: "heroicons:briefcase",
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
        <div class="rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 p-3">
          <Icon icon="heroicons:briefcase" class="h-8 w-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold">{pageTitle}</h1>
      </div>
      <p class="text-base-content/70">
        Program magang yang berdampak langsung pada masyarakat dan industri melalui platform Kemendikbud
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
            Magang Berdampak adalah program Kampus Merdeka yang memfasilitasi mahasiswa untuk melakukan
            magang di perusahaan atau organisasi yang terdaftar di platform Kemendikbud. Program ini
            dirancang untuk memberikan pengalaman kerja nyata yang berdampak pada pengembangan kompetensi
            mahasiswa dan kontribusi terhadap industri.
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
            <li>Terdaftar sebagai mahasiswa aktif</li>
            <li>Telah menyelesaikan minimal 4 semester</li>
            <li>IPK minimal 2.75</li>
            <li>Terdaftar di platform Kampus Merdeka Kemendikbud</li>
            <li>Mendapat persetujuan dari dosen pembimbing akademik</li>
            <li>Memiliki surat pengantar dari departemen</li>
          </ul>
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
            <li>CV dan portfolio</li>
            <li>Bukti registrasi di platform Kampus Merdeka</li>
            <li>Surat penerimaan dari perusahaan/organisasi</li>
            <li>Proposal kegiatan magang</li>
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
              <p class="text-base-content/70">4-6 bulan (1 semester)</p>
            </div>
            <div>
              <p class="font-semibold">Konversi SKS</p>
              <p class="text-base-content/70">20 SKS per semester</p>
            </div>
          </div>
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
            <li>Registrasi dan pemilihan program di platform Kampus Merdeka</li>
            <li>Mendaftar ke perusahaan/organisasi yang tersedia</li>
            <li>Mengikuti proses seleksi dari perusahaan</li>
            <li>Mendapatkan surat penerimaan dari perusahaan</li>
            <li>Mengajukan persetujuan ke departemen dan mengisi form BKP</li>
            <li>Upload dokumen pendukung melalui sistem MyIf Monev</li>
            <li>Menunggu approval dari koordinator BKP</li>
            <li>Melaksanakan magang dan submit laporan mingguan</li>
            <li>Submit laporan akhir dan dokumen pendukung</li>
          </ol>
        </div>
      </div>

      <!-- Actions -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:link" class="h-6 w-6" />
            Tautan Penting
          </h2>
          <div class="space-y-2">
            <a
              href="https://kampusmerdeka.kemdikbud.go.id"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-outline btn-sm"
            >
              <Icon icon="heroicons:arrow-top-right-on-square" class="h-4 w-4" />
              Platform Kampus Merdeka
            </a>
            <a
              href="https://if.its.ac.id"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-outline btn-sm"
            >
              <Icon icon="heroicons:arrow-top-right-on-square" class="h-4 w-4" />
              Panduan BKP Departemen Informatika
            </a>
          </div>
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
