<script>
  import LotList from "../components/slot/LotList.svelte";
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
  import { getTelegramApp } from "$lib/telegram";
  import TutorialView from "../components/slot/TutorialView.svelte";

  export let data;
  let tgApp;
  let lots = data.lots;
  let showTutorial = false;
  const showTutorialKey = 'show_tutorial';

  onMount(() => {
    try {
      tgApp = getTelegramApp();
      if (!tgApp) {
        return;
      }
      tgApp.MainButton.hide();

      if (tgApp.isVersionAtLeast(6.9)) {
        tgApp.CloudStorage.getItems([showTutorialKey], (error, values) => {         
          if (!error) {
            showTutorial =  !Boolean(values["show_tutorial"]);
          }
        });
      }else{
        showTutorial = !localStorage.getItem(showTutorialKey);
      }    
    } catch (e) {}
  });

  async function swiped() {
   
    showTutorial = false;
    if (tgApp.isVersionAtLeast(6.9)) {
      tgApp?.CloudStorage?.setItem(showTutorialKey, true);
      }else{
        localStorage.setItem(showTutorialKey,true);
      }
  }
</script>

<div in:fly="{{ duration: 400, y: '100vh', opacity: 0 }}">
  <LotList lots="{lots}" on:swiped="{swiped}" />

  {#if showTutorial}
    <TutorialView />
  {/if}
</div>
