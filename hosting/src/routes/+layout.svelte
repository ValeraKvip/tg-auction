<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { getTelegramApp } from "$lib/telegram";
  import { getFunctionsEndpoint } from "$lib/firebase-utils";
  import { user } from "$lib/store";
  import { navigating } from "$app/stores";
  import TopMenu from "../components/TopMenu.svelte";
  import { t, setLocale } from "$lib/i18n";


  var tgApp = null;


  $: if ($navigating) onRouteChange();

  async function onRouteChange() {
    if ($navigating.to?.route?.id === "/") {
      tgApp?.BackButton?.hide();
    } else {
      tgApp?.BackButton?.show();
    }
  }

  onMount(async () => {
    console.log("$page", $page);
    console.log("tgApp", getTelegramApp());
    tgApp = getTelegramApp();

    if (!tgApp.initData) {
      if (import.meta.env.MODE == "development") {
        const style =
          "--tg-color-scheme: dark; --tg-theme-bg-color: #212121; --tg-theme-button-color: #8774e1; --tg-theme-button-text-color: #ffffff; --tg-theme-hint-color: #aaaaaa; --tg-theme-link-color: #8774e1; --tg-theme-secondary-bg-color: #181818; --tg-theme-text-color: #ffffff; --tg-viewport-height: 100vh; --tg-viewport-stable-height: 100vh;";
        document.head.insertAdjacentHTML("beforeend", `<style>body{${style}}</style>`);
      }
      return;
    }

    getUser();
    tgApp.ready();

    if (tgApp.initDataUnsafe?.user?.language_code) {
      setLocale(tgApp.initDataUnsafe.user.language_code);
    }

    if (!tgApp.initDataUnsafe?.user?.allows_write_to_pm) {
      requestWriteAccess();
    }

    tgApp.onEvent("invoiceClosed", (url, status) => {
      console.log("#invoiceClosed", status);
    });

    tgApp.BackButton.onClick(() => {
      window.history.back();
    });

  
  });

  async function requestWriteAccess() {
    tgApp.requestWriteAccess((granted) => {
      if (granted) {
        return writeAccessGranted();
      }
      tgApp.showConfirm($t("writeAccessMsg"), (showAgain) => {
        if (showAgain) {
          tgApp.requestWriteAccess((granted2) => {
            if (granted2) {
              writeAccessGranted();
            }
          });
        }
      });
    });
  }

  async function writeAccessGranted() {
    const functionsUrl = await getFunctionsEndpoint();
    await fetch(`${functionsUrl}/lots/accessGranted`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ initData: tgApp.initData }),
    });
  }

  async function getUser() {
    //NOTE You can get the user's data only after verifying its authenticity.
    const functionsUrl = await getFunctionsEndpoint();
    const resp = await fetch(`${functionsUrl}/users/getUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        initData: tgApp.initData,
      }),
    });

    if (resp.ok) {
      const json = await resp.json();

      user.set(json);
    }
  }
</script>

<div class="wrapper">
  <slot />

  <TopMenu />
</div>

<style lang="scss">
  .wrapper {
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
    height: var(--tg-viewport-height);
  }

  :global(body) {
    background: var(--tg-theme-bg-color, black);
    color: var(--tg-theme-text-color);
    margin: 0;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */

    :global(p) {
      color: var(--tg-theme-text-color);
    }
    :global(div) {
      color: var(--tg-theme-text-color);
    }
    :global(h1) {
      color: var(--tg-theme-text-color);
    }
    :global(h2) {
      color: var(--tg-theme-text-color);
    }
    :global(h3) {
      color: var(--tg-theme-text-color);
    }
    :global(h4) {
      color: var(--tg-theme-text-color);
    }
    :global(h5) {
      color: var(--tg-theme-text-color);
    }
    :global(h6) {
      color: var(--tg-theme-text-color);
    }
    :global() {
      color: var(--tg-theme-link-color);
    }

    :global(button) {
      color: var(--tg-theme-button-text-color);
      background-color: var(--tg-theme-button-color);
      &:focus {
        outline: 0;
      }
    }

    :global(input) {
      background-color: var(--tg-theme-secondary-bg-color);
      color: var(--tg-theme-text-color);
      padding: 15px;
      border: none;
      border-radius: 15px;
    }

    :global(textarea) {
      background-color: var(--tg-theme-secondary-bg-color);
      color: var(--tg-theme-text-color);
      padding: 15px;
      border: none;
      border-radius: 15px;
    }

    :global(::placeholder) {
      color: var(--tg-theme-hint-color);
      opacity: 1;
    }

    :global(::-ms-input-placeholder) {
      color: var(--tg-theme-hint-color);
    }

    :global(.hint) {
      color: var(--tg-theme-hint-color);
    }
  }
</style>
