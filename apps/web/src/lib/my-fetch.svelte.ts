import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import { trpc_ } from "./client.svelte";
import { refresh, token, userState } from "./stores/token.svelte";

export const myFetchNoRefresh = async (
  url: URL | RequestInfo,
  options?: RequestInit,
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
  return res;
};

export const myFetch = async (
  url: URL | RequestInfo,
  options?: RequestInit,
  refreshed = false,
): Promise<Response> => {
  const res = await myFetchNoRefresh(url, options);
  if (res.status === 401 && !refreshed) {
    function getLoginError() {
      token.value = null;
      refresh.value = null;
      // TODO: Change to login.
      // goto(resolve("/login"));
      console.log("userState.tokenInvalid = true;");
      userState.tokenInvalid = true;
      return new Error(`Token expired.`);
    }
    try {
      if (!refresh.value) {
        throw getLoginError();
      }
      const { accessToken, refreshToken } = await trpc_.refresh.mutate({
        refreshToken: refresh.value,
      });
      token.value = accessToken;
      refresh.value = refreshToken;

      // Retry original request with new token
      return myFetch(url, options, true);
    } catch (error) {
      console.error(error);
      throw getLoginError();
    }
  }
  return res;
};
