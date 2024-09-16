<template>
  <link
    href="https://fonts.googleapis.com/css2?family=Bungee+Shade&display=swap"
    rel="stylesheet"
  />
  <div class="wrap">
    <div class="container">
      <video id="background-video" autoplay loop muted>
        <source src="~/assets/tree2.mp4" type="video/mp4" />
      </video>
      <div class="viewport-header">
        <h1 class="title">Skrunkle</h1>
        <!-- <img src="~/assets/skrunkleWord.png" alt="skrunk logo" class="logo" /> -->
        <h2 class="slogan">GO GET EM'</h2>
        <router-link to="/details" class="buttonsty">play now</router-link>
      </div>
    </div>
    <div class="container second">
      <h2>SURVIVE IN A HOSTILE OPEN WORLD</h2>
      <p>
        Explore a vast open world, rendered with the award-winning Apex engine,
        featuring a full day/night cycle with unpredictable weather, complex AI
        behavior, simulated ballistics, highly realistic acoustics, and a
        dynamic 1980’s soundtrack.
      </p>
    </div>
    <div class="container third">
      <h2>SURVIVE IN A HOSTILE OPEN WORLD</h2>
      <p>
        Explore a vast open world, rendered with the award-winning Apex engine,
        featuring a full day/night cycle with unpredictable weather, complex AI
        behavior, simulated ballistics, highly realistic acoustics, and a
        dynamic 1980’s soundtrack.
      </p>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Red+Hat+Text:wght@400;700&display=swap");
body {
  padding: 0;
  margin: 0;
  font-family: "Titan One", cursive;
  box-sizing: border-box;
  overflow-x: hidden;
}

.viewport-header {
  font-family: "Bungee Shade", cursive;
  align-items: center;
}

.slogan {
  margin: auto;
  font-size: 3rem;
  margin-top: -5%;
  padding: 0;
}

.title {
  margin-top: -15%;
}

.logo {
  width: 30rem;
}
.buttonsty {
  font-family: "Open Sans", sans-serif;
  font-size: 16px;
  letter-spacing: 2px;
  text-decoration: none;
  text-transform: uppercase;
  color: #000;
  cursor: pointer;
  border: 3px solid;
  padding: 0.25em 0.5em;
  box-shadow: 1px 1px 0px 0px, 2px 2px 0px 0px, 3px 3px 0px 0px, 4px 4px 0px 0px,
    5px 5px 0px 0px;
  position: relative;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  background-color: white;
}
.buttonsty:active {
  box-shadow: 0px 0px 0px 0px;
  top: 5px;
  left: 5px;
}
#background-video {
  height: 100vh;
  width: 100vw;
  object-fit: cover;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
}
body {
  font-family: "Red Hat Text", sans-serif;
}
.container {
  text-align: center;
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
h1 {
  font-weight: 700;
  font-size: 3rem;
}
p {
  max-width: 52ch;
  line-height: 1.5;
  padding: 1em;
}
.second {
  background-image: url("../assets/bac1.jpg");
  background-attachment: fixed;
  height: 1200px;
}
.third {
  background-image: url("../assets/bac2.jpg");
  background-attachment: fixed;
  height: 1200px;
}
h3 {
  font-weight: 700;
  font-size: 1.6rem;
  margin-top: 1em;
}
.img-first {
  background-image: url(https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1606&q=80);
}
.img-second {
  background-image: url(https://images.unsplash.com/photo-1628746404106-4d3843b231b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y2F2aW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60);
}
.img-third {
  background-image: url(https://images.unsplash.com/photo-1632853073412-782bf0279d65?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80);
}
</style>
