<script lang="ts">
  import Alert from "./_/ui/Alert.svelte";
  import StatCard from "./_/ui/StatCard.svelte";
  import HeroSection from "./_/home/HeroSection.svelte";
  import BKPTypeCard from "./_/home/BKPTypeCard.svelte";
  import QuickActionCard from "./_/home/QuickActionCard.svelte";
  import AboutBKPSection from "./_/home/AboutBKPSection.svelte";

  interface BKPType {
    title: string;
    description: string;
    icon: string;
    color: string;
    items: string[];
  }

  // Page content
  const infoMessage =
    "This platform helps students manage their BKP submissions through the approval process.";
  const bkpTypesSectionTitle = "Types of BKP";
  const quickActionsSectionTitle = "Quick Actions";

  // Icons
  const studentsIcon = "heroicons:users";
  const submissionsIcon = "heroicons:clipboard-document-list";
  const approvedIcon = "heroicons:check-badge";

  const bkpTypes: BKPType[] = [
    {
      title: "BKP Flagship",
      description: "National programs and strategic partnerships",
      icon: "heroicons:bolt",
      color: "bg-primary",
      items: [
        "Magang Berdampak",
        "Magang Magenta",
        "Magang Kerjasama",
        "Magang Mandiri",
        "Studi Independen",
      ],
    },
    {
      title: "BKP Internal ITS",
      description: "Campus-based learning activities",
      icon: "heroicons:building-library",
      color: "bg-secondary",
      items: [
        "Lomba (Competitions)",
        "Proyek (Projects)",
        "Wirausaha (Entrepreneurship)",
        "Magang Internal",
      ],
    },
    {
      title: "Kerja Praktik",
      description: "Professional practical work experience",
      icon: "heroicons:briefcase",
      color: "bg-accent",
      items: [],
    },
  ];

  const quickActions = [
    {
      label: "My BKP Submissions",
      href: "/bkp",
      icon: "heroicons:clipboard-document-list",
      style: "btn-primary",
    },
    {
      label: "View Courses",
      href: "/courses",
      icon: "heroicons:book-open",
      style: "btn-secondary",
    },
    {
      label: "Important Links",
      href: "/links",
      icon: "heroicons:link",
      style: "btn-accent",
    },
  ];

  // const q = createQuery(() => ({
  //   queryKey: [`message`],
  //   queryFn: () =>
  //     trpc.hello.query({
  //       name: "world",
  //     }),
  // }));
</script>

<div class="min-h-screen bg-base-100">
  <HeroSection />

  <div class="container mx-auto px-4 py-12">
    <!-- Info Alert -->
    <div class="mb-12">
      <Alert type="info" message={infoMessage} />
    </div>

    <!-- What is BKP Section -->
    <div class="mb-12">
      <AboutBKPSection />
    </div>

    <!-- BKP Types Section -->
    <div class="mb-12">
      <h2 class="mb-6 text-center text-xl font-bold">{bkpTypesSectionTitle}</h2>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each bkpTypes as type (type.title)}
          <BKPTypeCard {...type} />
        {/each}
      </div>
    </div>

    <!-- Quick Actions Section -->
    <div class="mb-12">
      <h2 class="mb-6 text-center text-xl font-bold">{quickActionsSectionTitle}</h2>
      <div class="grid gap-4 md:grid-cols-3">
        {#each quickActions as action (action.href)}
          <QuickActionCard {...action} />
        {/each}
      </div>
    </div>

    <!-- <SafeQueryWrapper {q}>
      {#snippet children(data)}
        {data.message}
      {/snippet}
    </SafeQueryWrapper> -->

    <!-- Stats Section -->
    <div class="stats w-full stats-vertical shadow-xl lg:stats-horizontal">
      <StatCard
        icon={studentsIcon}
        title="Students"
        value="1,200+"
        description="Active participants"
        color="primary"
      />

      <StatCard
        icon={submissionsIcon}
        title="Submissions"
        value="3,500+"
        description="Total BKP submissions"
        color="secondary"
      />

      <StatCard
        icon={approvedIcon}
        title="Approved"
        value="95%"
        description="Approval rate"
        color="accent"
      />
    </div>
  </div>
</div>
