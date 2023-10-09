<script>
  import { fly } from "svelte/transition";
  import LotItem from "./LotItem.svelte";
  import { swipe } from "svelte-gestures";
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

  export let lots;
  let offset = 500;
  let list;

  let lotA;
  let lotB;
  let currentLot;
  let currentLotReplacer = 1;
  let lotADir = 1;
  let lotBDir = 1;

  function swipeHandler(event) {
    event.stopPropagation();
    const direction = event.detail.direction;
    if (!list) {
      return;
    }

    if (direction == "right") {
    //  dispatch('swiped');
      if (leftLots.length > 0) {
        if (currentLotReplacer === 1) {
          lotADir = 1;
          lotBDir = -1;
          lotB = leftLots[0];
        } else {
          lotADir = -1;
          lotBDir = 1;
          lotA = leftLots[0];
        }
        leftLots = leftLots.slice(1);
        rightLots.unshift(currentLotReplacer === 1 ? lotA : lotB);       
        currentLotReplacer = currentLotReplacer === 1 ? 2 : 1;       
      }
    } else if (direction == "left") {
      dispatch('swiped');
      
      if (rightLots.length > 0) {
        if (currentLotReplacer === 1) {
          lotADir = -1;
          lotBDir = 1;
          lotB = rightLots[0];
        } else {
          lotA = rightLots[0];
          lotADir = 1;
          lotBDir = -1;
        }
        rightLots = rightLots.slice(1);
        leftLots.unshift(currentLotReplacer === 1 ? lotA : lotB);       
        currentLotReplacer = currentLotReplacer === 1 ? 2 : 1;      
      }
    }
  }

  let leftLots = [];
  let rightLots = null;
  $: {
    if (lots?.length) {
      if (!rightLots) {
        rightLots = lots.slice(1);
      }

      if (!lotA) {
        lotA = lots[0];
      }
    }
  }
  $: {
    currentLot = currentLotReplacer == 1 ? lotA : lotB;
  }

</script>

{#if lots?.length}
  <div class="lot-list" use:swipe="{{ timeframe: 3000, minSwipeDistance: 50 }}" on:swipe="{swipeHandler}" bind:this="{list}">
    {#if currentLotReplacer === 1}
      <div class="lot" in:fly="{{ x: offset * lotADir, duration: 500 }}" out:fly="{{ x: offset * lotADir, y: 100, duration: 500 }}">
        <LotItem lot="{lotA}" />
      </div>
    {:else if currentLotReplacer === 2}
      <div class="lot" in:fly="{{ x: offset * lotBDir, duration: 500 }}" out:fly="{{ x: offset * lotBDir, y: 100, duration: 500 }}">
        <LotItem lot="{lotB}" />
      </div>
    {/if}
 
  </div>
{/if}

<style lang="scss">
  .lot-list {
    display: flex;
    flex-direction: row;
    overflow: hidden;
    z-index: 0;
    width: 100vw;
    height: var(--tg-viewport-height);
    position: relative;
  }
</style>