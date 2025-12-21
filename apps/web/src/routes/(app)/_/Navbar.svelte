<script lang="ts">
  import { resolve } from "$app/paths";
  import Icon from "@iconify/svelte";
  import { constants, type NavItem, type NavSingle } from "./constants";
  // import ThemeToggle from "$lib/components/ThemeToggle.svelte";

  // Props
  const {brandName} = constants;

  // Configuration
  const brandHref = resolve("/");

  const navItems: NavItem[] = [
    // { _type: "single", label: "Home", href: resolve("/") },
    { _type: "single", label: "My BKP", href: resolve("/bkp") },
    { _type: "single", label: "Courses", href: resolve("/courses") },
    { _type: "single", label: "Important Links", href: resolve("/links") },
  ];

  // Account dropdown items
  const accountDropdownItems: NavSingle[] = [
    { _type: "single", label: "Profile", href: resolve("/profile") },
    { _type: "single", label: "Settings", href: resolve("/settings") },
    { _type: "single", label: "Logout", href: resolve("/logout") },
  ];
</script>

<div class="bg-base-300 shadow-lg">
  <div class="navbar container mx-auto">
    <div class="navbar-start">
      <!-- Mobile dropdown -->
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <Icon icon="heroicons:bars-3" class="h-5 w-5" />
        </div>
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <ul
          tabindex="0"
          class="dropdown-content menu z-1 mt-3 w-52 menu-sm rounded-box bg-base-100 p-2 shadow"
        >
          {#each navItems as item (item.label)}
            <li>
              {#if item._type === "single"}
                <a href={item.href}>{item.label}</a>
              {:else}
                <span class="menu-title">{item.label}</span>
              {/if}
              {#if item._type === "dropdown"}
                <ul class="p-2">
                  {#each item.children as child (child.label)}
                    <li><a href={child.href}>{child.label}</a></li>
                  {/each}
                </ul>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
      <a href={brandHref} class="btn gap-2 text-xl btn-ghost">
        <Icon icon="heroicons:academic-cap" class="h-6 w-6" />
        {brandName}
      </a>

      <!-- Desktop menu -->
      <ul class="menu menu-horizontal hidden px-1 lg:flex">
        {#each navItems as item (item.label)}
          <li>
            {#if item._type === "dropdown"}
              <details>
                <summary>{item.label}</summary>
                <ul class="z-1 w-52 rounded-t-none bg-base-100 p-2 shadow">
                  {#each item.children as child (child.label)}
                    {#if child.href}
                      <li><a href={child.href}>{child.label}</a></li>
                    {/if}
                  {/each}
                </ul>
              </details>
            {:else if item.href}
              <a href={item.href}>{item.label}</a>
            {/if}
          </li>
        {/each}
      </ul>
    </div>

    <div class="navbar-end gap-2">
      <!-- Theme toggle button -->
      <!-- <ThemeToggle /> -->

      <!-- Account dropdown -->
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost">
          <Icon icon="heroicons:user-circle" class="h-5 w-5" />
          <span class="hidden sm:inline">Account</span>
        </div>
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <ul tabindex="0" class="dropdown-content menu z-1 w-52 rounded-box bg-base-100 p-2 shadow">
          {#each accountDropdownItems as item (item.label)}
            <li><a href={item.href}>{item.label}</a></li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</div>
