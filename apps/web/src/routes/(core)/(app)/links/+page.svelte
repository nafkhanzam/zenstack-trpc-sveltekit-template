<script lang="ts">
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import {LinkCategory} from "../_/links";
  import { Alert } from "../_/ui";

  interface LinkItem {
    title: string;
    url: string;
  }

  interface Category {
    name: string;
    icon: string;
    color: string;
    links: LinkItem[];
  }

  // Page content
  const pageTitle = "Important Links";
  const pageDescription = "Essential resources and documents for students";
  const infoMessage = "All links open in a new tab. Please bookmark this page for easy access to these important resources.";

  // Breadcrumb configuration
  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
      icon: "heroicons:home",
    },
    {
      label: pageTitle,
      icon: "heroicons:link",
    },
  ];

  const categories: Category[] = [
    {
      name: "General Information",
      icon: "heroicons:information-circle",
      color: "bg-primary",
      links: [
        {
          title: "IF-tegration",
          url: "https://itsacid.sharepoint.com/sites/IF/SitePages/IF-AlihKredit&KP.aspx",
        },
        {
          title: "List Pengayaan 2023",
          url: "https://itsacid.sharepoint.com/:x:/r/sites/IF/_layouts/15/Doc.aspx?sourcedoc=%7B9B07C408-FF64-4EBF-8CB7-ADD6120D8242%7D&file=pengayaan-2023.xlsx&action=default&mobileredirect=true",
        },
      ],
    },
    {
      name: "Internship Guidelines",
      icon: "heroicons:document-text",
      color: "bg-secondary",
      links: [
        {
          title: "Pedoman Magang",
          url: "https://drive.google.com/drive/folders/1JdGdXbfxKuPIvhAjeDP3isU0WzokUykk?usp=drive_link",
        },
        {
          title: "Template Draft PKS",
          url: "https://docs.google.com/document/d/1hOtFe37YraBbhZUulmGaQye-I5GhOaIQ/edit",
        },
        {
          title: "Daftar PKS Program Magang Mandiri",
          url: "https://docs.google.com/spreadsheets/d/1B6yhCNKImXLIfhDVqJ47NHU6gq7VNJZkywCGEZNWsO4/preview",
        },
      ],
    },
    {
      name: "Magang Berdampak",
      icon: "heroicons:briefcase",
      color: "bg-accent",
      links: [
        {
          title: "Platform Magang Berdampak",
          url: "https://simbelmawa.kemdiktisaintek.go.id/magang/",
        },
        {
          title: "Template SPTJM MagangBerdampak2025",
          url: "https://its.id/TemplateSPTJM_MagangBerdampak2025",
        },
        {
          title: "Pengumpulan SPTJM MagangBerdampak2025",
          url: "https://its.id/PengumpulanSPTJM_MagangBerdampak2025",
        },
      ],
    },
    {
      name: "ITS Resources",
      icon: "heroicons:building-office-2",
      color: "bg-info",
      links: [
        {
          title: "Website Resmi ITS Career Center",
          url: "https://www.its.ac.id/careers/id/magang",
        },
      ],
    },
    {
      name: "Forms & Documents",
      icon: "heroicons:document-text",
      color: "bg-warning",
      links: [
        {
          title: "Pakta Integritas Magang",
          url: "https://its.id/PaktaIntegritas_MagangITS",
        },
        {
          title: "SuratPengantarDept_MagangMandiri_ITS",
          url: "https://its.id/SuratPengantarDept_MagangMandiri_ITS",
        },
        {
          title: "SuratPersetujuanOT_Magang",
          url: "https://its.id/SuratPersetujuanOT_Magang",
        },
        {
          title: "LogbookMingguanMagang_ITS",
          url: "https://its.id/LogbookMingguanMagang_ITS",
        },
        {
          title: "LembarPenilaianMagang_Mitra",
          url: "https://its.id/LembarPenilaianMagang_Mitra",
        },
      ],
    },
  ];
</script>

<div class="min-h-screen bg-base-100">
  <div class="container mx-auto px-4 py-8">
    <Breadcrumbs items={breadcrumbItems} />

    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="mb-2 text-2xl font-bold">{pageTitle}</h1>
      <p class="text-sm text-base-content/70">{pageDescription}</p>
    </div>

    <div class="mb-8">
      <Alert type="info" message={infoMessage} />
    </div>

    <!-- Links by Category -->
    <div class="space-y-8">
      {#each categories as category (category.name)}
        <LinkCategory {...category} />
      {/each}
    </div>
  </div>
</div>
