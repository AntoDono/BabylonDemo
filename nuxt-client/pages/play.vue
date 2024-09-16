<template>
  <div class="outer">
    <LoadingBar
      class="loading"
      :percent="percent"
      :loadtext="loadtext"
      ref="load"
    />
    <button v-if="vr" class="play" @click="play()">Enter VR Mode</button>
    <div id="debug">
      <p id="name"></p>
      <p id="id"></p>
      <p id="pcount"></p>
      <p id="x"></p>
      <p id="y"></p>
      <p id="z"></p>
      <p id="PickupItem"></p>
      <p id="PickedupItem"></p>
      <p id="vr"></p>
      <div class="instructionPopup" v-if="showPopup">
        <h1>Welcome to Skrunkle!</h1>
        <p>Instructions:</p>
        <ul>
          <li>Move with "W" "A" "S" "D"</li>
          <li>Collect 10 Whalen sheeps 🐑</li>
          <li>Beat the clock!⏰</li>
        </ul>
        <button class="button-54" role="button" @click="startGame">
          Start Game
        </button>
      </div>
      <div class="winPopup" v-if="showPopup2">
        <div class="firework"></div>
        <div class="firework"></div>
        <div class="firework"></div>
        <div class="firework"></div>
        <h1>You won!</h1>
        <img src="../assets/sheep.png" alt="sheep jumping for joy" />
        <p>Great job collecting!</p>
        <p>Final time : {{ this._time_elapsed }} s</p>
        <button class="button-54" role="button" @click="endGame">
          Play again
        </button>
      </div>
    </div>

    <!-- <div id="chatIcon">
      <img src="~/assets/chat.png" alt="" class="chatIcon" />
    </div>

    <div id="chat" class="hidden">
      <section class="message-history">
        <ul id="chat-ul">
          <li>TEST</li>
        </ul>
      </section>
      <form @submit.prevent="sendChat" class="message-bar">
        <input type="text" id="chat-box" v-model="chatMessage" required />
        <button id="chat-send">Send</button>
      </form>
    </div> -->

    <canvas id="renderCanvas" ref="renderCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { World } from "../src/world/world";

export default {
  data() {
    return {
      world: undefined,
      percent: 0,
      loadtext: "Loading...",
      vr: false,
      showPopup: false,
      showPopup2: false,
    };
  },
  mounted() {
    const canvas = this.$refs.renderCanvas;
    const world = new World(
      <HTMLCanvasElement>canvas,
      this.$config.public,
      this.update_loading,
      this.startGame,
      (time_elapsed) => {
        this.showPopup2 = true;
        this._time_elapsed = time_elapsed.toFixed(2);
      }
    );
    this.world = world;

    window.addEventListener("resize", this.resize);
    window.addEventListener(
      "click",
      () => {
        canvas.requestFullscreen();
      },
      { once: true }
    );
  },
  methods: {
    resize() {
      this.world.resize();
    },
    startGame() {
      this.showPopup = false;
      this.world.start_timer();
      let unmute = document.querySelector("#babylonUnmuteIconBtn");
      console.log(document.querySelector("#babylonUnmuteIconBtn"));
      if (unmute != undefined) {
        unmute.click();
      }
      console.log(this.world._music);
      this.world._music.play();
    },
    endGame() {
      this.showPopup2 = false;
      window.location.reload();
    },
    update_loading(loaded, total, message) {
      if (message == "server") {
        this.percent = 0;
        this.loadtext = "Fetching Server";
      } else if (message == "meshes") {
        this.percent = loaded / total;
        this.loadtext = `Creating Meshes (${loaded}/${total})`;
      }

      if (this.percent == 1) {
        this.vr = this.world.vr;
        if (!this.vr) this.play();
        (() => {
          this.showPopup = true;
        })();
      }
    },
    play() {
      this.$refs["load"].load();
      if (this.vr) this.world.enterVR();
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Titan+One&display=swap");
.outer {
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

.play {
  z-index: 1000;
  width: 20rem;
  height: 5rem;
  border-radius: 15px;
}

* {
  overflow: hidden;
  padding: 0;
  margin: 0;
}
canvas {
  z-index: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.customLoadingScreenDiv {
  width: 100vw;
  height: 100vh;
  background-color: #ffb238;
  z-index: 800;
  position: absolute;
  top: 0;
  left: 0;
  display: none;
}

#chat {
  background-color: rgba(245, 85, 54, 0.2);
  display: flex;
  height: 500px;
  width: 500px;
  z-index: 0;
  position: absolute;
  right: 0;
}
#chat:focus-within {
  background-color: rgba(245, 85, 54, 0.7);
}

#debug {
  position: absolute;
  color: green;
  font-size: larger;
  top: 0;
  left: 0;
  z-index: 999;
}

.chatIcon {
  background-color: white;
  display: flex;
  height: 70px;
  width: 70px;
  z-index: 100;
  position: absolute;
  right: 0;
  padding: 1rem;
  border-radius: 4rem;
}
.instructionPopup,
.winPopup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: orange;
  color: black;
  font-family: "Titan One", cursive;
  box-shadow: 0 10px 10px rgba(33, 29, 29, 0.3);
  text-align: center;
  padding: 2rem;
  border-radius: 2rem;
  border: solid white 0.2rem;
}
h1 {
  margin-bottom: 1rem;
}
ul {
  margin-bottom: 1rem;
}

.button-54 {
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
  touch-action: manipulation;
  margin-top: 0.7rem;
}

.button-54:active {
  box-shadow: 0px 0px 0px 0px;
  top: 5px;
  left: 5px;
}

@media (min-width: 768px) {
  .button-54 {
    padding: 0.25em 0.75em;
  }
}
img {
  max-width: 30%;
  height: auto;
}
@keyframes firework {
  0% {
    transform: translate(var(--x), var(--initialY));
    width: var(--initialSize);
    opacity: 1;
  }
  50% {
    width: 0.5vmin;
    opacity: 1;
  }
  100% {
    width: var(--finalSize);
    opacity: 0;
  }
}

/* @keyframes fireworkPseudo {
  0% { transform: translate(-50%, -50%); width: var(--initialSize); opacity: 1; }
  50% { width: 0.5vmin; opacity: 1; }
  100% { width: var(--finalSize); opacity: 0; }
}
 */
.firework,
.firework::before,
.firework::after {
  --initialSize: 0.5vmin;
  --finalSize: 45vmin;
  --particleSize: 0.2vmin;
  --color1: yellow;
  --color2: rgb(168, 64, 35);
  --color3: white;
  --color4: lime;
  --color5: rgb(42, 160, 111);
  --color6: rgb(106, 60, 179);
  --y: -30vmin;
  --x: -50%;
  --initialY: 60vmin;
  content: "";
  animation: firework 2s infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, var(--y));
  width: var(--initialSize);
  aspect-ratio: 1;
  background: 
    /*
    radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 0% 0%,
    radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 100% 0%,
    radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 100% 100%,
    radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 0% 100%,
    */ radial-gradient(
        circle,
        var(--color1) var(--particleSize),
        #0000 0
      )
      50% 0%,
    radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 100% 50%,
    radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 50% 100%,
    radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 0% 50%,
    /* bottom right */
      radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 80%
      90%,
    radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 95% 90%,
    radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 90% 70%,
    radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 100% 60%,
    radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 55% 80%,
    radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 70% 77%,
    /* bottom left */
      radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 22%
      90%,
    radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 45% 90%,
    radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 33% 70%,
    radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 10% 60%,
    radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 31% 80%,
    radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 28% 77%,
    radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 13% 72%,
    /* top left */
      radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 80%
      10%,
    radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 95% 14%,
    radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 90% 23%,
    radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 100% 43%,
    radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 85% 27%,
    radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 77% 37%,
    radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 60% 7%,
    /* top right */
      radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 22%
      14%,
    radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 45% 20%,
    radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 33% 34%,
    radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 10% 29%,
    radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 31% 37%,
    radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 28% 7%,
    radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 13% 42%;
  background-size: var(--initialSize) var(--initialSize);
  background-repeat: no-repeat;
}

.firework::before {
  --x: -50%;
  --y: -50%;
  --initialY: -50%;
  /*   transform: translate(-20vmin, -2vmin) rotate(40deg) scale(1.3) rotateY(40deg); */
  transform: translate(-50%, -50%) rotate(40deg) scale(1.3) rotateY(40deg);
  /*   animation: fireworkPseudo 2s infinite; */
}

.firework::after {
  --x: -50%;
  --y: -50%;
  --initialY: -50%;
  /*   transform: translate(44vmin, -50%) rotate(170deg) scale(1.15) rotateY(-30deg); */
  transform: translate(-50%, -50%) rotate(170deg) scale(1.15) rotateY(-30deg);
  /*   animation: fireworkPseudo 2s infinite; */
}

.firework:nth-child(2) {
  --x: 30vmin;
}

.firework:nth-child(2),
.firework:nth-child(2)::before,
.firework:nth-child(2)::after {
  --color1: pink;
  --color2: violet;
  --color3: fuchsia;
  --color4: orchid;
  --color5: plum;
  --color6: lavender;
  --finalSize: 40vmin;
  left: 30%;
  top: 60%;
  animation-delay: -0.65s;
}

.firework:nth-child(3) {
  --x: -30vmin;
  --y: -50vmin;
}

.firework:nth-child(3),
.firework:nth-child(3)::before,
.firework:nth-child(3)::after {
  --color1: cyan;
  --color2: lightcyan;
  --color3: lightblue;
  --color4: PaleTurquoise;
  --color5: SkyBlue;
  --color6: lavender;
  --finalSize: 35vmin;
  left: 70%;
  top: 60%;
  animation-delay: -0.9s;
}
</style>
