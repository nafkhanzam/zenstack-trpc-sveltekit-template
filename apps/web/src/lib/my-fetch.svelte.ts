import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import { trpc } from "./client.svelte";
import { token, refresh } from "./stores/token.svelte";

export const myFetch = async (
  url: URL | RequestInfo,
  options?: RequestInit,
  refreshed = false,
): Promise<Response> => {
  options = options ?? {};
  options.headers = {
    ...options.headers,
  };
  if (token.value) {
    options.headers = {
      ...options.headers,
      Authorization: token.value,
    };
  }
  const res = await fetch(url, options);
  if (res.status === 401 && !refreshed) {
    function getLoginError() {
      token.value = null;
      refresh.value = null;
      // TODO: Change to login.
      goto(resolve("/"));
      return new Error(`Token expired.`);
    }
    try {
      if (!refresh.value) {
        throw getLoginError();
      }
      const { accessToken, refreshToken } = await trpc.refresh.mutate({
        refreshToken: refresh.value,
      });
      token.value = accessToken;
      refresh.value = refreshToken;

      // Retry original request with new token
      return myFetch(url, options, true);
    } catch (error) {
      throw getLoginError();
    }
  }
  return res;
};
