<script>
  export let bidMultiplayer = 10;

  const isDevelopmentEnv =  (import.meta.env.MODE == "development") || false;
</script>

<main class="multiplayers">
  {#each [10, 25, 50, 75, 100] as mult}
    <button
      on:click="{() => {
        bidMultiplayer = mult;
      }}"
      class="{bidMultiplayer === mult ? 'selected' : ''}"
    >
      +{mult}%
    </button>
  {/each}

  {#if isDevelopmentEnv}
    <button
      on:click="{() => {
        bidMultiplayer = 10_001;
      }}"
      class="{bidMultiplayer === 10_001 ? 'selected' : ''}"
    >
      Overbid
    </button>
  {/if}
</main>

<style lang="scss">
  @import "$lib/style.scss";

  main {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    button {
      padding: 15px;
      border: none;
      border-radius: 15px;
      cursor: pointer;
    }

    .selected {
      position: relative;
      z-index: 0;
      background-color: var(--tg-theme-button-color);
      &:before {
        content: "";
        background: $gradient;
        position: absolute;
        top: -2px;
        left: -2px;
        background-size: 400%;
        z-index: -1;
        filter: blur(5px);
        width: calc(100% + 2px);
        height: calc(100% + 2px);
        animation: glowing 90s linear infinite;
        opacity: 1;
        transition: opacity 0.3s ease-in-out;
        border-radius: 15px;
      }

      &:after {
        z-index: -1;
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: var(--tg-theme-button-color);
        left: 0;
        top: 0;
        border-radius: 15px;
      }

      @keyframes glowing {
        0% {
          background-position: 0 0;
        }
        50% {
          background-position: 400% 0;
        }
        100% {
          background-position: 0 0;
        }
      }
    }
  }
</style>
