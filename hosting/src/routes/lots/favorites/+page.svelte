<script>
  import LotList from "../../../components/slot/LotList.svelte";
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
  import { getTelegramApp, getTelegramUserId } from "$lib/telegram";

export let data;
  let lots = data.lots;
  
  onMount(() => {
    try {
      getTelegramApp()?.MainButton.hide();
    } catch (e) {}
  });
</script>

<div in:fly="{{ duration: 400, y: '100vh', opacity: 0 }}">
  <LotList lots="{lots}" />
</div>