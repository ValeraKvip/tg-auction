<script>
  import DevIcon from "./icons/DevIcon.svelte";
  import PlusIcon from "./icons/PlusIcon.svelte";
  import { page } from "$app/stores";
  import { navigating } from "$app/stores";
  import BoxIcon from "./icons/BoxIcon.svelte";
  import HomeIcon from "./icons/HomeIcon.svelte";
  import NotificationIcon from "./icons/NotificationIcon.svelte";
  import {  user } from "$lib/store.js";


  export let expandMenu = false;
  let addAnim = false;
  let Adding = false;

  let _user;

//NOTE If you want to hide the menu during navigation, uncomment on the code below.
  // $: if ($navigating) {
  //   (() => {
  //     expandMenu = false;
  //   })();
  // }


  let btns = [
    {
      id: "home",
      path: "/",
      component: HomeIcon,
    },
    {
      id: "create",
      path: "/lots/create",
      component: PlusIcon,
    },
  ];

  const myLotsBtn = {
    id: "my-lots",
    path: "/lots/my-lots",
    component: BoxIcon,
  };

  const purchasedLotsBtn = {
    id: "purchased",
    path: "/lots/purchased",
    component: DevIcon,
  };

  const favoriteLotsBtn = {
    id: "favorites",
    path: "/lots/favorites",
    component: NotificationIcon,
  };

  user.subscribe((u) => {
    const isInit = !_user;
    _user = u;
    if (_user) {
      if (_user.favorite?.length) {
        addBtn(favoriteLotsBtn, !isInit && _user.favorite.length == 1);
      } else {
        removeBtn(favoriteLotsBtn);
      }

      if (_user.lots?.length) {
        addBtn(myLotsBtn, !isInit && _user.lots.length == 1);
      } else {
        removeBtn(myLotsBtn);
      }

      if (_user.purchased?.length) {
        addBtn(purchasedLotsBtn, !isInit && _user.purchased.length == 1);
      } else {
        removeBtn(purchasedLotsBtn);
      }
    }
  });



  function addBtn(btn, showAnim) {
    const index = btns.findIndex((b) => b.id == btn.id);
    console.log("addBtn", index, Adding);
    if (index !== -1 || Adding) {
      return;
    }

    if (!showAnim) {
      btns.push(btn);
      btns = [...btns];
      return;
    }

    Adding = true;
    expandMenu = true;
    setTimeout(() => {
      addAnim = true;      

      btns.push(btn);
      btns = [...btns];

      setTimeout(() => {
        addAnim = false;
        Adding = false;
      }, 10);
    }, 400);
  }

  function removeBtn(btn) {
    const index = btns.findIndex((b) => b.id == btn.id);  
    if (index !== -1) {
      addAnim = true;
      setTimeout(() => {
        addAnim = false;
        btns.splice(index, 1);
        btns = [...btns];
      }, 100);
    }
  }

  let openDistance = 120;
  let openingAngle = Math.PI - 1.7;

  function getStyle(i) {  
    i++;
    const menuItems = btns.length;
    if (addAnim && i == menuItems) {
      return `
      transform: translate3d(0,0, 0);
      transition-duration: ${10 + 60 * i}ms;    
      `;
    }

    if (expandMenu) {
      const angle = (Math.PI - openingAngle) / 2 + ((openingAngle / (menuItems - 1)) * (i - 1) - 11.8);
      return `     
      transition-duration: ${10 + 60 * i}ms;
      transform: translate3d(${Math.cos(angle) * openDistance}px,${Math.sin(angle) * openDistance}px, 0);
  
      `;
    } else {
      return `
      transition-duration: ${10 + 60 * i}ms;
      `;
    }
  }
</script>

<nav class="menu">
  <input type="checkbox" href="#" class="menu-open" name="menu-open" id="menu-open" bind:checked="{expandMenu}" />
  <label class="menu-open-button" for="menu-open">
    <span class="hamburger hamburger-1"></span>
    <span class="hamburger hamburger-2"></span>
    <span class="hamburger hamburger-3"></span>
  </label>

  {#each btns as btn, i}
    <a href="{btn.path}" style="{getStyle(i, expandMenu, btns.length, addAnim)}" class="{($page?.route.id == btn.path ? 'gradient-btn' : '') + ' menu-item'}">
      <svelte:component this="{btn.component}" />
    </a>
  {/each}
</nav>

<style lang="scss">
  @import "$lib/style.scss";

  nav {
    :global(svg) {
      width: 24px !important;
      height: 24px !important;
    }
    :global(path) {
      fill: var(--tg-theme-button-text-color) !important;
    }

    :global(polygon) {
      fill: var(--tg-theme-button-text-color) !important;
    }
  }

  %goo {
    filter: url("#shadowed-goo");
    // debug
    // background:rgba(255,0,0,0.2);
  }
  %ball {
    border-radius: 100%;
    width: 40px;
    height: 40px;
    //margin-right: -50px;
    right: 10px;
    position: absolute;
    top: 10px;
    text-align: center;
    line-height: 80px;
    transform: translate3d(0, 0, 0);
    transition: transform ease-out 200ms;
    color: var(--tg-theme-button-text-color);
    background-color: var(--tg-theme-button-color);
  }
  .menu-open {
    display: none;
  }
  .menu-item {
    @extend %ball;
  }
  .hamburger {
    $width: 18px;
    $height: 3px;
    width: $width;
    height: $height;
    background: white;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -$width/2;
    margin-top: -$height/2;
    transition: transform 200ms;
  }
  $hamburger-spacing: 6px;
  .hamburger-1 {
    transform: translate3d(0, -$hamburger-spacing, 0);
  }
  .hamburger-2 {
    transform: translate3d(0, 0, 0);
  }
  .hamburger-3 {
    transform: translate3d(0, $hamburger-spacing, 0);
  }
  .menu-open:checked + .menu-open-button {
    .hamburger-1 {
      transform: translate3d(0, 0, 0) rotate(45deg);
    }
    .hamburger-2 {
      transform: translate3d(0, 0, 0) scale(0.1, 1);
    }
    .hamburger-3 {
      transform: translate3d(0, 0, 0) rotate(-45deg);
    }
  }
  .menu {
    @extend %goo;

    $width: 200x;
    $height: 10px;
    position: absolute;
    right: 0;
    top: 0px;
    margin-left: -$width/2;
    padding-top: 20px;
    padding-left: $width/2;
    width: $width;
    height: $height;
    box-sizing: border-box;
    font-size: 20px;
    text-align: left;
  }

  .menu-item {
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      @extend .gradient-btn;
      &:before {
        animation: glowing 20s linear infinite;
      }
    }
  }

  .menu-open-button {
    @extend %ball;
    z-index: 2;
    transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transition-duration: 400ms;
    transform: scale(1.1, 1.1) translate3d(0, 0, 0);
    border-radius: 100%;
    cursor: pointer;
  }
  .menu-open-button:hover {
    transform: scale(1.2, 1.2) translate3d(0, 0, 0);
  }
  .menu-open:checked + .menu-open-button {
    transition-timing-function: linear;
    transition-duration: 200ms;
    transform: scale(0.8, 0.8) translate3d(0, 0, 0);
    @extend .gradient-btn;
  }
</style>
