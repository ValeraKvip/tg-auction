<script>
  import ClockIcons from "../icons/ClockIcon.svelte";
  import { goto } from "$app/navigation";
  import UserView from "./UserView.svelte";
  import { t } from "$lib/i18n";

  export let lot;

  async function goToLot() {
    goto(`/lots/${lot.id}?lt=${new URLSearchParams(lot).toString()}`);
  }
</script>

<div class="lot">
  <div class="preview">
    <img src="{lot.preview}" alt="{lot.title}" />
  </div>
  <div class="info">
    <div class="header">
      <h2>{lot.title}</h2>
    </div>
    <div class="desc">{lot.description}</div>
    <div class="bid-nav">
      <div>
        <div class="bid">
          {lot.bid > 0 ? lot.bid : lot.startBid}$
        </div>
        {#if lot.finished}
          <span class="hint">{$t("lot.soldFor")}</span>
        {:else}
          <span class="hint">{lot.bid > 0 ? $t("lot.currentBid") : $t("lot.startBid")}</span>
        {/if}
      </div>
      <button on:click="{() => goToLot()}">
        {lot.finished ? $t("lot.view") : $t("lot.bidNow")}
      </button>
    </div>

    <div class="date">
      <ClockIcons />
      {#if lot.finished}
        <h3>{$t("lot.over")}</h3>
      {:else}
        <div class="time">
          <div>
            {$t("lot.startAt")}:
            <div class="hint">
              {new Date(lot.startAt).toLocaleDateString()}
            </div>
          </div>
          <div>
            {$t("lot.finishAt")}:
            <div class="hint">
              {new Date(lot.finishAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      {/if}
    </div>

    <UserView user="{lot.owner}" />
  </div>
</div>

<style lang="scss">
  @import "$lib/style.scss";
  .lot {
    width: 100vw;
    display: flex;
    flex-direction: column;
    flex-basis: 100vw;
    flex-grow: 0;
    flex-shrink: 0;
    width: 100vw;
    background-color: var(--tg-theme-secondary-bg-color);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    @media (orientation: landscape) {
      flex-direction: row;      
    }
  }

  .bid-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .bid {
      color: $accent-color;
      font-weight: 700;
      font-size: 2.5rem;
      text-align: center;
      margin-top: 10px;
    }

    span {
      font-size: 0.9rem;
      text-align: center;
    }

    button {
      padding: 15px;
      border-radius: 15px;
      border: none;
      height: fit-content;
      display: block;
    }
  }

  .desc {
    max-height: 75px;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .preview {
    background-color: var(--tg-theme-bg-color);
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    min-height: 200px;

    @media (orientation: landscape) {
    min-width: 40%;
    }
  }

  .preview img {
    max-width: 100%;
    max-height: 100%;
    object-fit: fill;
    height: 100%;
  }

  .info {
    padding: 16px;
    color: #fff;
    flex: 2;
    display: flex;
    flex-direction: column;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  h2 {
    font-size: 24px;
    margin: 0;
  }

  p {
    font-size: 16px;
    margin-bottom: 10px;
  }

  .date {
    margin-top: 10px;
    display: flex;
    gap: 10px;
    align-items: center;

    .time {
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
  }

  .action-button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 0;
    padding: 12px;
    cursor: pointer;
  }

  .action-button:hover {
    background-color: #0056b3;
  }
</style>
