<div class="wrapper">
  <svg id="Swipe-horizontal_1" data-name="Swipe horizontal 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <path class="hand-x" d="M139.93,113.56l-41.12-6.93V76.08a9.25,9.25,0,0,0-9.25-9.25h0a9.25,9.25,0,0,0-9.25,9.25v57.36L71,122.65c-3.61-3.61-8.44-3.89-13.08,0,0,0-7.24,5.84-3.83,9.25l34,34h42.63a9.25,9.25,0,0,0,9.07-7.43l6.82-34.09A9.28,9.28,0,0,0,139.93,113.56Z"></path>
    <g class="swipe-horizontal">
      <path class="line-horizontal" d="M70.85,42c19.69-12.46,37,0,37,0"></path>
      <polyline class="arrow-left" points="76.6 46.01 68.37 43.43 68.38 43.41 70.96 35.18"></polyline>
      <polyline class="arrow-right" points="100.21 44.66 108.43 42.08 108.43 42.06 105.85 33.84"></polyline>
    </g>
  </svg>
</div>

<style>
  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  .hand-x {
    fill:  var(--tg-theme-button-text-color);
    stroke:  var(--tg-theme-button-color);
    stroke-width: 3px;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  @keyframes swipe-x {
    0% {
      transform: translateX(0px);
    }
    25% {
      transform: translateX(50px) rotateZ(10deg);
    }
    50% {
      transform: translateX(0px);
    }
    75% {
      transform: translateX(-50px) rotateZ(-10deg);
    }
  }

  .hand {
    transform-origin: 25% 50%;
  }

  .hand-x {
    animation: swipe-x 1.25s ease-in-out backwards;
    animation-iteration-count: infinite;
  }

  .wrapper * {
    transform-origin: 50% 50%;
    perspective: 100px;
  }

  .line-horizontal, 
  .arrow-left, 
.arrow-right {
	fill: transparent;
	stroke:  var(--tg-theme-button-color);
	stroke-width: 3px;
	stroke-linecap: round;
	stroke-linejoin: round;
}
</style>
