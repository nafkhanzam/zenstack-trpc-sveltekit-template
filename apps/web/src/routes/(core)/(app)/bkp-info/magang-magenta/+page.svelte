<script lang="ts">
  import { goto } from "$app/navigation";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import Icon from "@iconify/svelte";

  const pageTitle = "Magang Magenta";
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
      icon: "heroicons:shield-check",
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
        <div class="rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 p-3">
          <Icon icon="heroicons:shield-check" class="h-8 w-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold">{pageTitle}</h1>
      </div>
      <p class="text-base-content/70">
        Program magang melalui kerjasama Magenta dengan berbagai perusahaan teknologi
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
            Magang Magenta adalah program magang yang diselenggarakan melalui kerjasama antara ITS
            dengan platform Magenta (Merdeka Belajar - Kampus Merdeka Gema Cermat Berkarya). Program
            ini menyediakan kesempatan magang di perusahaan teknologi terkemuka dengan bimbingan
            intensif dan proyek nyata.
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
            <li>Mahasiswa aktif semester 5 atau lebih</li>
            <li>IPK minimal 3.00</li>
            <li>Memiliki kemampuan programming yang baik</li>
            <li>Lulus seleksi administrasi dan wawancara Magenta</li>
            <li>Mendapat persetujuan dari dosen pembimbing</li>
            <li>Bersedia mengikuti program selama 1 semester penuh</li>
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
            <li>Transkrip nilai terbaru (IPK min. 3.00)</li>
            <li>CV dan portfolio project</li>
            <li>Surat penerimaan dari Magenta</li>
            <li>Bukti penempatan di perusahaan mitra</li>
            <li>Rencana kerja magang (work plan)</li>
            <li>Surat pernyataan kesediaan mengikuti program</li>
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
              <p class="font-semibold">Durasi</p>
              <p class="text-base-content/70">5-6 bulan (1 semester)</p>
            </div>
            <div>
              <p class="font-semibold">Konversi SKS</p>
              <p class="text-base-content/70">20 SKS</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Benefits -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:star" class="h-6 w-6" />
            Keuntungan Program
          </h2>
          <ul class="list-disc space-y-2 pl-6">
            <li>Pengalaman kerja di perusahaan teknologi terkemuka</li>
            <li>Bimbingan intensif dari mentor profesional</li>
            <li>Sertifikat resmi dari Magenta dan perusahaan</li>
            <li>Networking dengan profesional industri</li>
            <li>Kemungkinan mendapat tawaran kerja setelah lulus</li>
            <li>Allowance/stipend dari perusahaan (tergantung perusahaan)</li>
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
            <li>Mendaftar program Magenta melalui platform resmi</li>
            <li>Mengikuti seleksi administrasi dan tes kemampuan</li>
            <li>Mengikuti wawancara dengan tim Magenta</li>
            <li>Matching dengan perusahaan mitra</li>
            <li>Wawancara dengan perusahaan penempatan</li>
            <li>Mendapatkan surat penerimaan dari Magenta dan perusahaan</li>
            <li>Mengajukan approval BKP ke departemen</li>
            <li>Upload dokumen melalui MyIf Monev</li>
            <li>Melaksanakan magang dan submit laporan berkala</li>
            <li>Presentasi akhir dan submit dokumentasi lengkap</li>
          </ol>
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
