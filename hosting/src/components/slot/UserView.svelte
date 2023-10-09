<script>
  import { t } from "$lib/i18n";
  export let user;
</script>

{#if user}
  <div class="owner">
    <img src="{user.avatar}" alt="lot owner's avatar" />
    <div>
      <h4>
        {user.name}
      </h4>
      <div class="hint">{$t("lot.seller")}</div>
    </div>
  </div>
{/if}

<style lang="scss">
  .owner {
    align-items: center;
    margin-top: auto;
    display: flex;
    gap: 20px;
   // padding: 15px;
    img {
      width: 60px;
      height: 60px;
      border-radius: 100%;
      object-fit: cover;
    }

    .hint {
      font-size: 0.9rem;
    }

    h4 {
      margin-top: 0;
      margin-bottom: 0;
    }
  }
</style>