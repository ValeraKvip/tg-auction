<script>
  import { onDestroy, onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { getTelegramApp } from "$lib/telegram";
  import Countdown from "../../../components/slot/Countdown.svelte";
  import Players from "../../../components/slot/Players.svelte";
  import { getFunctionsEndpoint, getShareLink } from "$lib/firebase-utils";
  import Multiplayers from "../../../components/slot/Multiplayers.svelte";
  import { collection, query, where, doc, onSnapshot } from "firebase/firestore";
  import { db } from "$lib/db";
  import { user } from "$lib/store.js";
  import { page } from "$app/stores";
  import ForwardIcon from "../../../components/icons/ForwardIcon.svelte";
  import NotificationIcon from "../../../components/icons/NotificationIcon.svelte";
  import DeleteIcon from "../../../components/icons/DeleteIcon.svelte";

  import UserView from "../../../components/slot/UserView.svelte";
  import { t } from "$lib/i18n";
  import { fly } from "svelte/transition";

  const lotId = $page.params["lot"];

  let lot = {
    title: "",
    preview: "",
  };
  let currentBid = 0;
  let bidMultiplayer = 10;
  let selectedBid = currentBid;
  let notifyON = false;
  let tgApp;
  let _user = null;
  let isLotSeller = false;

  user.subscribe((u) => {
    _user = u;
  });

  if ($page.url.searchParams.has("lt")) {
    const params = $page.url.searchParams;
    params.forEach((value, key) => {
      lot[key] = value;
    });
    lot.players = [];
    lot.images = [];
  }

  $: {
    if (tgApp && bidMultiplayer > 0 && !lot.finished) {
      selectedBid = Number(currentBid) + Math.ceil((currentBid / 100) * bidMultiplayer);     
      tgApp.MainButton.setText($t("lot.bid", { bid: selectedBid }));
    }
  }

  $: {
    if (import.meta.env.MODE == "development") {
      if (bidMultiplayer == 10_001 && !lot.finished) {
        selectedBid = 10_000;       
        tgApp.MainButton.setText($t("lot.bid", { bid: selectedBid }));
      }
    }
  }
 
  $: {
    if (lot) {
      currentBid = lot.bid || lot.startBid;

      if (lot.finished) {       
        tgApp.MainButton.hide();
      }
    }
  }

  $: {
    isLotSeller = _user?.id == lot?.owner?.id;
    if (!lot.finished) {
    if (isLotSeller) {
      tgApp?.MainButton?.hide();
    } else {
      tgApp?.MainButton?.show();
    }
  }
  }

  onMount(async () => {
    tgApp = getTelegramApp();
    if (!tgApp) {
      return;
    }

    tgApp.MainButton.setText($t("lot.bid", { bid: currentBid }));

    tgApp.MainButton.onClick(sendBid);
  });

  async function sendBid() {
    tgApp.MainButton.showProgress();
    const functionsUrl = await getFunctionsEndpoint();
    const resp = await fetch(`${functionsUrl}/lots/bid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lotId: lot.id,
        bid: selectedBid,
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
      tgApp.openInvoice(json.url, (status) => {
        tgApp.requestWriteAccess();
      });

      tgApp.HapticFeedback.notificationOccurred("success");
    }

    tgApp.MainButton.hideProgress();
  }

  let unsubscribe = onSnapshot(
    doc(db, "lots", lotId),
    (doc) => {
      if (!doc.exists()) {
        tgApp.MainButton.hide();
       tgApp.showAlert($t('lot.404'), ()=>{
        goto('/');
       })
        return;
      }

      lot = doc.data();
      lot.id = doc.id;

      checkSaved();
    },
    (err) => {
      console.error(err);
    }
  );

  function checkSaved() {
    if (_user && _user.favorite && _user.favorite.findIndex((p) => p?.id == lot.id) !== -1) {
      notifyON = true;
    } else {
      notifyON = false;
    }
  }

  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }

    if (!tgApp) {
      return;
    }
    tgApp.MainButton.offClick(sendBid);
    tgApp.MainButton.setText("-");
    tgApp.MainButton.hide();
  });

  async function share() {
    const shareUrl = await getShareLink();
    let welcomeText = $t("lot.share.owner", { title: lot.title });
    if (tgApp && lot.owner.id != tgApp.initDataUnsafe?.user?.id) {
      welcomeText = $t("lot.share.player", { title: lot.title });
    }
    tgApp.openLink(encodeURI(`${shareUrl}?startapp=${lot.id}&text=${welcomeText}`));
  }

  async function save() {
    notifyON = !notifyON;
    const functionsUrl = await getFunctionsEndpoint();
    fetch(`${functionsUrl}/lots/favorite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lotId: lot.id,
        initData: tgApp.initData,
      }),
    });

    if (_user) {
      const index = _user.favorite?.findIndex((f) => f.id == lot.id);

      if (notifyON) {
        if (index == -1 || !_user.favorite?.length) {
          if (!_user.favorite?.length) {
            _user.favorite = [];
          }
          _user.favorite.push(lot);
          user.set(_user);
        }
      } else {
        if (index !== -1) {
          _user.favorite.splice(index, 1);
          user.set(_user);
        }
      }
    }
  }

  async function deleteLot() {
    if (!tgApp) {
      return;
    }

    tgApp.showConfirm($t("lot.delete"), async (ok) => {
      if (ok) {
        const functionsUrl = await getFunctionsEndpoint();
        const resp = await fetch(`${functionsUrl}/lots/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lotId: lot.id,
            initData: tgApp.initData,
          }),
        });

        if (resp.ok) {
          if (_user?.lots?.length) {
            const index = _user.lots.findIndex((f) => f.id == lot.id);
            if (index !== -1) {
              _user.lots.splice(index, 1);
              user.set(_user);
            }
          }
          goto("/");
        } else {
          try {
            tgApp.HapticFeedback.notificationOccurred("error");
            const json = await resp.json();
            if (json.error_code) {
              tgApp.showAlert(json.message);
            }
          } catch (e) {}
        }
      }
    });
  }

  function isLotBuyer() {
    const playerWinner = lot.players?.reduce((prev, current) => (prev && prev.bid > current.bid ? prev : current));
    return _user?.id === playerWinner?.id;
  }
</script>

<div class="lot" in:fly="{{ duration: 400, y: '100vh', opacity: 0 }}">
  {#if lot?.id}
  <div class="action">
    <div class="preview">
      <img src="{lot.preview}" alt="{lot.title}" />

      <!-- <img src="{lot.preview}" alt="{lot.title}" /> -->
      <button class="forward-btn" on:click="{() => share()}">
        <ForwardIcon />
      </button>
      {#if !lot.finished}
        {#if isLotSeller}
          <button class="save-btn glow-on-hover" on:click="{() => deleteLot()}">
            <DeleteIcon />
          </button>
        {:else}
          <button class="save-btn glow-on-hover" on:click="{() => save()}">
            <NotificationIcon on="{notifyON}" />
          </button>
        {/if}
      {/if}
    </div>
    <div class="info">
     
      <div class="header">
        <h2>{lot.title}</h2>
      </div>

      {#if lot.finished}
        <h3>
          <span>The auction is over.</span>
          {#if isLotSeller}
            <span>You have sold the lot, the new owner:</span>
          {:else if isLotBuyer()}
            <span>You bought this lot - it's yours</span>
          {:else}
            <span>The winner is:</span>
          {/if}
        </h3>
        <!-- {#if lot.players?.length}
          <Players players="{[lot.players[0]]}" />
        {:else}{/if} -->
      {:else}
        <Countdown endDate="{lot.finishAt}" />

        {#if !isLotSeller}
          <Multiplayers bind:bidMultiplayer="{bidMultiplayer}" />
        {/if}
      {/if}
      
    </div>
  </div>
  <Players players="{lot.players}" />
  <p>{lot.description}{lot.description}{lot.description}{lot.description}</p>

  <div class="p-15">
    <UserView user="{lot.owner}" />
  </div>
  {/if}
</div>

<style lang="scss">
  .lot {
    width: 100vw;
    display: flex;
    flex-direction: column;
    flex-basis: 100vw;
    flex-grow: 0;
    flex-shrink: 0;
    max-height: 100vh;
    background-color: var(--tg-theme-secondary-bg-color);
    overflow: auto;
  }

  .action {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    @media (orientation: landscape) {
      flex-direction: row;
    }
  }

  .preview {
    background-color: var(--tg-theme-bg-color);
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    min-height: 250px;
    position: relative;
    img {
      object-fit: fill;
      height: 100%;
    }
    .forward-btn {
      position: absolute;
      padding: 0;
      bottom: 15px;
      right: 15px;
      width: 28px;
      height: 28px;
      background: none;
      border: none;
    }
    .save-btn {
      @extend .forward-btn;
      left: 15px;
      right: auto;
    }

    @media (orientation: landscape) {
      min-width: 40%;
    }
  }

  .info {
    padding: 16px;
    color: #fff;
    // flex: 2;
    display: flex;
    flex-direction: column;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  h3 {
    margin-bottom: 0;
  }

  h2 {
    font-size: 24px;
    margin: 0;
  }

  p {
    font-size: 16px;
    margin-bottom: 10px;
    padding:  0 15px;
  }

  .date {
    margin-top: auto;
  }

  .p-15{
    padding: 15px;
  }
</style>
