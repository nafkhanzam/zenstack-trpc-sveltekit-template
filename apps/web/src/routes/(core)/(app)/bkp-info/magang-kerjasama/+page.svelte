<script lang="ts">
  import { goto } from "$app/navigation";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import Icon from "@iconify/svelte";

  const pageTitle = "Magang Kerjasama";
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
      icon: "heroicons:user-group",
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
        <div class="rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 p-3">
          <Icon icon="heroicons:user-group" class="h-8 w-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold">{pageTitle}</h1>
      </div>
      <p class="text-base-content/70">
        Magang melalui kerjasama resmi antara ITS dengan perusahaan partner
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
            Magang Kerjasama adalah program magang yang diselenggarakan melalui Memorandum of Understanding
            (MoU) atau Memorandum of Agreement (MoA) antara ITS dengan perusahaan atau institusi partner.
            Program ini menjamin kualitas dan standar magang sesuai dengan kurikulum akademik.
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
            <li>Mahasiswa aktif semester 5 ke atas</li>
            <li>IPK minimal 2.75</li>
            <li>Perusahaan memiliki MoU/MoA aktif dengan ITS</li>
            <li>Mendapat persetujuan dari koordinator kerjasama departemen</li>
            <li>Lulus seleksi dari perusahaan partner</li>
            <li>Memiliki dosen pembimbing yang ditunjuk</li>
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
            <li>CV dan surat motivasi</li>
            <li>Bukti MoU/MoA antara ITS dan perusahaan</li>
            <li>Surat penerimaan dari perusahaan partner</li>
            <li>Proposal magang yang disetujui dosen pembimbing</li>
            <li>Form persetujuan koordinator kerjasama</li>
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
              <p class="text-base-content/70">Minimal 3 bulan, dapat diperpanjang hingga 6 bulan</p>
            </div>
            <div>
              <p class="font-semibold">Konversi SKS</p>
              <p class="text-base-content/70">3-20 SKS (tergantung durasi)</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Partner Companies -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon icon="heroicons:building-office-2" class="h-6 w-6" />
            Contoh Perusahaan Partner
          </h2>
          <p class="mb-3 text-sm text-base-content/70">
            Beberapa perusahaan yang memiliki kerjasama dengan ITS (daftar tidak lengkap):
          </p>
          <div class="grid gap-2 md:grid-cols-2">
            <div class="badge badge-outline">Telkom Indonesia</div>
            <div class="badge badge-outline">Bank Indonesia</div>
            <div class="badge badge-outline">Pertamina</div>
            <div class="badge badge-outline">PLN</div>
            <div class="badge badge-outline">Tokopedia</div>
            <div class="badge badge-outline">Gojek</div>
          </div>
          <p class="mt-3 text-sm italic text-base-content/60">
            *Untuk daftar lengkap dan update, silakan hubungi koordinator kerjasama departemen
          </p>
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
            <li>Cek daftar perusahaan partner yang memiliki MoU/MoA aktif</li>
            <li>Mendaftar langsung ke perusahaan atau melalui koordinator departemen</li>
            <li>Mengikuti proses seleksi perusahaan</li>
            <li>Mendapatkan surat penerimaan dari perusahaan</li>
            <li>Konsultasi dengan dosen pembimbing dan buat proposal</li>
            <li>Mendapat approval dari koordinator kerjasama departemen</li>
            <li>Submit dokumen melalui MyIf Monev</li>
            <li>Menunggu verifikasi dari koordinator BKP</li>
            <li>Melaksanakan magang dengan laporan berkala</li>
            <li>Submit laporan akhir dan evaluasi</li>
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
