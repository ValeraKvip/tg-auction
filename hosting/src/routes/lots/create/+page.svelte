<script>
  import { getTelegramApp } from "$lib/telegram";
  import { onDestroy, onMount } from "svelte";
  import { getFunctionsEndpoint } from "$lib/firebase-utils";
  import { goto } from "$app/navigation";
  import { user } from "$lib/store.js";
  import { t } from "$lib/i18n";
  import { fly } from "svelte/transition";

  let title = "";
  let description = "";
  let preview = "";
  let images = [];
  let startBid = 10;
  let tgApp;
  let interval;
  let changed = false;
  let error = {
    title: "",
    description: "",
    preview: "",
    startBid: "",
  };
  let _user = null;
  user.subscribe((u) => {
    _user = u;
  });

  let keepUpdate = true;
  const draftKeys = ["draft_title", "draft_description", "draft_starBid", "draft_images", "draft_preview"];
  let isErrors = true;

  $: {
    isErrors = (error.title.length > 0 || error.description.length > 0 || error.preview.length > 0 || error.startBid.length > 0) == true;
  }
  $: {
    error.title = "";
    if (!title || title.length > 64 || title.length < 3) {
      error.title = $t("lot.create.error.lenExceed");
    }
    changed = true;
  }
  $: {
    error.description = "";
    if (!description || description.length > 1024 || description.length < 3) {
      error.description = $t("lot.create.error.lenExceed");
    }
    changed = true;
  }
  $: {
    error.startBid = "";

    if (!(startBid >>> 0 === parseFloat(startBid))) {
      error.startBid = $t("lot.create.error.bidType");
    } else {
      const num = Number(startBid);
      if (num < 10 || num > 1_000) {
        error.startBid = $t("lot.create.error.bidRange");
      }
    }
    changed = true;
  }
  $: {
    error.preview = "";
    if (!preview || preview.length < 7 || preview.length > 150 || !/(http(s?)):\/\//i.test(preview)) {
      error.preview = $t("lot.create.error.previewLink");
    }
    changed = true;
  }

  $: images, (changed = true);

  $: {
    if (isErrors) {
      tgApp?.MainButton?.hide();
    } else {
      tgApp?.MainButton?.show();
    }
  }

  onMount(() => {
    tgApp = getTelegramApp();
    if (!tgApp) {
      return;
    }

    tgApp.MainButton.setText($t("lot.create.mainBtn"));
    tgApp.MainButton.onClick(mainBtnClick);

    if (tgApp.isVersionAtLeast(6.9)) {
      tgApp.CloudStorage.getItems(draftKeys, (error, values) => {
        title = values["draft_title"];
        description = values["draft_description"];
        preview = values["draft_preview"];
        startBid = Number(values["draft_starBid"] || 10);
        images = JSON.parse(values["draft_images"]);
      });

      interval = setInterval(() => {
        if (!changed || !keepUpdate) {
          return;
        }
        changed = false;
        tgApp?.CloudStorage?.setItem("draft_title", title);

        tgApp?.CloudStorage?.setItem("draft_description", description);
        tgApp?.CloudStorage?.setItem("draft_starBid", startBid);
        tgApp?.CloudStorage?.setItem("draft_preview", preview);
        tgApp?.CloudStorage?.setItem("draft_images", JSON.stringify(images));
      }, 1000);
    }
  });

  onDestroy(() => {
    if (interval) {
      clearInterval(interval);
    }

    if (tgApp) {
      tgApp.MainButton.offClick(mainBtnClick);
      tgApp.MainButton.setText("-");
      tgApp.MainButton.hide();
    }
  });

  async function mainBtnClick() {
    try {
      tgApp.MainButton.showProgress();
      const functionsUrl = await getFunctionsEndpoint();
      const resp = await fetch(`${functionsUrl}/lots/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          startBid,
          preview,
          images,
          initData: tgApp.initData,
        }),
      });

      const json = await resp.json();

      if (!resp.ok) {
        if (json.error_code) {
          tgApp.showAlert(json.message);
        }
        tgApp.HapticFeedback.notificationOccurred("error");
      } else {
        tgApp.HapticFeedback.notificationOccurred("success");
        clearInterval(interval);
        keepUpdate = false;
        if (tgApp.isVersionAtLeast(6.9)) {
          tgApp.CloudStorage.removeItems(draftKeys);
        }

        if (_user) {
          if (!_user.lots?.length) {
            _user.lots = [];
          }
          _user.lots.push({
            id: json.lotId,
            title: title,
          });
          user.set(_user);
        }
        window.history.replaceState(window.history.state,'', "/");
           goto(`/lots/${json.lotId}`);
      }
    } catch (e) {
      console.error(e);
      tgApp.showAlert("Error");

      tgApp.HapticFeedback.notificationOccurred("error");
    } finally {
      tgApp.MainButton.hideProgress();
    }
  }
</script>

<main in:fly="{{ duration: 400, y: '100vh', opacity: 0 }}">
  <h1>{$t("lot.create.h1")}</h1>
  <div>
    <label for="title"> {$t("lot.create.title")}</label>
    <input bind:value="{title}" placeholder="Lot title" id="title" />
    <span class="hint">
      {error.title}
    </span>
  </div>
  <div>
    <label for="desc">{$t("lot.create.description")}</label>
    <textarea name="Description" cols="40" rows="5" bind:value="{description}" id="desc"></textarea>
    <span class="hint">
      {error.description}
    </span>
  </div>
  <div>
    <label for="bid">{$t("lot.create.startBid")}</label>
    <input bind:value="{startBid}" placeholder="Start bid" id="bid" />
    <span class="hint">
      {error.startBid}
    </span>
  </div>
  <div>
    <label for="preview">{$t("lot.create.preview")}</label>
    <input bind:value="{preview}" placeholder="https://..." id="preview" />
    <span class="hint">
      {error.preview}
    </span>
  </div>
</main>

<style lang="scss">
  main {
    padding: 5px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    overflow: auto;
    height: 100%;

    label {
      display: block;
      margin-left: 5px;
      margin-bottom: 3px;
    }

    div {
      display: flex;
      flex-direction: column;
    }

    span {
      display: block;
      height: 1rem;
      margin-left: 5px;
    }
  }
</style>
