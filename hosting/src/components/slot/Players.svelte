<script>
  export let players = [];

</script>

{#if players?.length}
<ul>
  {#each players.sort((a, b) => b.bid - a.bid) as player, index (player.id)}
    <li class="{index === 0 ? 'bid-winner' : ''}">
      <img src="{player.avatar}" alt="player's avatar" />
      <h3>
        {player.name}
      </h3>
      <p>
        {player.bid}$
      </p>
    </li>
  {/each}
</ul>
{/if}

<style lang="scss">
  @import "$lib/style.scss";

  ul {
    display: flex;
    gap: 20px;
    max-width: 100vw;
   // width: 100%;
    padding: 20px;
    overflow: auto;
    flex-shrink: 0;


  }
  li {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid var(--tg-theme-hint-color);
    background: var(--tg-theme-bg-color);
    width: 120px;
    flex-grow: 1;
    flex-shrink: 0;
    text-align: center;
    list-style: none;
    border-radius: 15px;
    padding: 15px;
    img {
      width: 80px;
      height: 80px;
      overflow: hidden;
      border-radius: 100%;
    }

    h3 {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }

    p {
      color: rgb(75, 206, 118);
      font-size: 1.4rem;
      margin: 0;
      width: fit-content;
      block-size: fit-content;
    }
  }

  .bid-winner {
    border: none;
    border-color: $accent-color;
    border-radius: 15px;
    position: relative;
    z-index: 0;
    background: var(--tg-theme-bg-color);
  
    &:before {
      content: "";
      background:$gradient;
      position: absolute;
      top: -2px;
      left: -2px;
      background-size: 400%;
      z-index: -1;
      filter: blur(5px);
      width: calc(100% + 2px);
      height: calc(100% + 2px);
      animation: glowing 120s linear infinite;
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
      background: var(--tg-theme-bg-color);
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
    p {
      color: $accent-color;
      font-size: 1.7rem;
    }
  }
</style>
