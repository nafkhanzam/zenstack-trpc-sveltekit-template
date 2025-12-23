<script lang="ts">
  import { toast } from "$lib";
  import { trpc } from "$lib/client.svelte";
  import { token, refresh } from "$lib/stores/token.svelte";
  import { goto } from "$app/navigation";
  import Icon from "@iconify/svelte";

  let username = $state("");
  let password = $state("");
  let isLoading = $state(false);
  let isSSOLoading = $state(false);

  const handlePasswordLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password");
      return;
    }

    isLoading = true;
    try {
      const res = await trpc.login.mutate({
        username: username.trim(),
        password,
      });
      token.value = res.accessToken;
      refresh.value = res.refreshToken;
      toast.success("Login successful!");
      goto("/");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      isLoading = false;
    }
  };

  const handleSSOLogin = async (provider: "google" | "github" | "microsoft" | "mock") => {
    isSSOLoading = true;
    try {
      // For mock SSO, generate test credentials
      const mockEmail = `test@${provider}.com`;
      const mockName = `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`;

      const res = await trpc.ssoLogin.mutate({
        provider,
        email: mockEmail,
        name: mockName,
      });
      token.value = res.accessToken;
      refresh.value = res.refreshToken;
      toast.success(`Logged in with ${provider}!`);
      goto("/");
    } catch (error: any) {
      toast.error(error.message || "SSO login failed");
    } finally {
      isSSOLoading = false;
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handlePasswordLogin();
    }
  };
</script>

<div class="min-h-screen flex items-center justify-center bg-base-200">
  <div class="card w-full max-w-md bg-base-100 shadow-2xl">
    <div class="card-body">
      <h1 class="text-3xl font-bold text-center mb-2">Welcome Back</h1>
      <p class="text-center text-base-content/60 mb-6">Sign in to continue</p>

      <!-- SSO Login Options -->
      <div class="space-y-3 mb-6">
        <h2 class="text-sm font-semibold text-base-content/70 uppercase">Quick Sign In</h2>

        <button
          class="btn btn-outline w-full justify-start gap-3"
          onclick={() => handleSSOLogin("google")}
          disabled={isSSOLoading || isLoading}
        >
          <Icon icon="logos:google-icon" width="20" height="20" />
          <span>Continue with Google</span>
        </button>

        <button
          class="btn btn-outline w-full justify-start gap-3"
          onclick={() => handleSSOLogin("github")}
          disabled={isSSOLoading || isLoading}
        >
          <Icon icon="logos:github-icon" width="20" height="20" />
          <span>Continue with GitHub</span>
        </button>

        <button
          class="btn btn-outline w-full justify-start gap-3"
          onclick={() => handleSSOLogin("microsoft")}
          disabled={isSSOLoading || isLoading}
        >
          <Icon icon="logos:microsoft-icon" width="20" height="20" />
          <span>Continue with Microsoft</span>
        </button>

        <button
          class="btn btn-outline w-full justify-start gap-3"
          onclick={() => handleSSOLogin("mock")}
          disabled={isSSOLoading || isLoading}
        >
          <Icon icon="mdi:test-tube" width="20" height="20" />
          <span>Mock SSO (Testing)</span>
        </button>
      </div>

      <div class="divider">OR</div>

      <!-- Username/Password Login -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">Username</span>
        </label>
        <input
          type="text"
          placeholder="Enter your username"
          class="input input-bordered"
          bind:value={username}
          onkeypress={handleKeyPress}
          disabled={isLoading || isSSOLoading}
        />
      </div>

      <div class="form-control mt-4">
        <label class="label">
          <span class="label-text">Password</span>
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          class="input input-bordered"
          bind:value={password}
          onkeypress={handleKeyPress}
          disabled={isLoading || isSSOLoading}
        />
      </div>

      <div class="form-control mt-6">
        <button
          class="btn btn-primary"
          onclick={handlePasswordLogin}
          disabled={isLoading || isSSOLoading || !username.trim() || !password.trim()}
        >
          {#if isLoading}
            <span class="loading loading-spinner"></span>
            Signing in...
          {:else}
            Sign In
          {/if}
        </button>
      </div>

      <div class="text-center mt-4">
        <p class="text-sm text-base-content/60">
          Don't have an account?
          <a href="/register" class="link link-primary">Sign up</a>
        </p>
      </div>
    </div>
  </div>
</div>
