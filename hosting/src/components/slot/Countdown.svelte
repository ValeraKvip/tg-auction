<script>
    import { onMount, afterUpdate } from 'svelte';
    import {t} from '$lib/i18n';

    export let endDate = 0;
 
    const timeLeft = Number(endDate) - new Date();
    let countdownDuration = Math.floor(timeLeft / 1000); 
    let timerInterval;
    let displayTime = '';
    const day =  24*60*60
  
    function formatTime(seconds) {
      
      if(seconds <= 0){
        return "00:00:00";
      }
      if((seconds - day) > 0){
        return `${Math.floor(seconds/day)} ${$t('lot.days')}`
      }
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
  
      const formattedHours = String(hours).padStart(2, '0');
      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
  
    function updateTimer() {
      if (countdownDuration > 0) {
        countdownDuration--;
      } else {
        clearInterval(timerInterval);
      }
    }
  
    onMount(() => {
      timerInterval = setInterval(updateTimer, 1000); 
    });
  
    afterUpdate(() => {
      
      countdownDuration = Math.floor((Number(endDate) - new Date()) / 1000);
      displayTime = formatTime(countdownDuration)
    });
  </script>

  
  <div>    
    {displayTime}
    <span>{$t('lot.timeLeft')}</span>
  </div>
  
  <style lang="scss">
   div{
    text-align: center;
    font-size: 3rem;

    span{
      display: block;
      font-size: .8rem;
      color: var(--tg-theme-hint-color);
    }
   }
  </style>