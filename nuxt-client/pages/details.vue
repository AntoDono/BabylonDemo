<template>
  <div class="body" :class="[darkMode ? 'dark-mode' : 'light-mode']">
    <div class="wrap">
      <div class="wordLogo">
        <img
          :class="[darkMode ? 'dark-mode-color-logo' : 'light-mode-color-logo']"
          src="~/assets/skrunkleWord.png"
          alt="Skrunkle"
        />
      </div>
      <label class="switch">
        <input type="checkbox" @click="toggleDark" />
        <span class="slider round"></span>
      </label>
    </div>

    <div class="main">
      <div class="main-left">
        <div
          class="box1"
          :class="[darkMode ? 'dark-mode-color' : 'light-mode-color']"
        >
          <input
            class="enterName"
            type="text"
            value="Placeholder5375"
            id="name"
            name="name"
          />
          <button
            class="customizeButton"
            :class="[
              darkMode ? 'dark-mode-color-button' : 'light-mode-color-button',
            ]"
          >
            Customize
          </button>
          <button class="signInButton">Sign In</button>
        </div>
        <div
          class="box2"
          :class="[darkMode ? 'dark-mode-color' : 'light-mode-color']"
        ></div>
      </div>

      <div class="main-middle">
        <div class="characterCircle">
          <div
            class="circle"
            :class="[darkMode ? 'dark-mode-color' : 'light-mode-color']"
          ></div>
          <img class="chicken" src="../assets/chicken2.png" alt="" />
        </div>
        <button
          @click="routePlay"
          class="joinButton"
          :class="[
            darkMode ? 'dark-mode-color-button' : 'light-mode-color-button',
          ]"
        >
          <img class="play" src="../assets/play.png" alt="play button" />
          Join
        </button>
      </div>
      <div class="main-right">
        <div
          class="box3"
          :class="[darkMode ? 'dark-mode-color' : 'light-mode-color']"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      darkMode: false,
    };
  },
  methods: {
    toggleDark() {
      this.darkMode = !this.darkMode;
    },
    routePlay() {
      this.$router.push("/play");
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Titan+One&display=swap");
* {
  overflow: hidden;
  padding: 0;
  margin: 0;
  font-family: "Titan One", cursive;
  box-sizing: border-box;
}
.wordLogo {
  margin-top: 3rem;
  text-align: center;
}
.body {
  background-size: 130vw;
  height: 100vh;
  animation: animatedBackground 30s infinite linear alternate-reverse;
}
.light-mode {
  background-image: url("../assets/forest day.png");
}
.dark-mode {
  background-image: url("../assets/forest night.png");
}
.light-mode-color {
  background-color: #fd551b !important;
  border: solid rgb(247, 247, 247) 5px;
}
.dark-mode-color {
  background-color: #9b713a !important;
  border: solid rgb(214, 194, 128) 5px !important;
}
.light-mode-color-button {
  border: solid #fff2d8 5px !important;
  background-color: #f1b441 !important;
}
.dark-mode-color-button {
  border: solid #f7b148 5px !important;
  background-color: #e0761e !important;
}
.light-mode-color-logo {
  filter: hue-rotate(0deg);
}
.dark-mode-color-logo {
  filter: hue-rotate(23deg);
}
@keyframes animatedBackground {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 0; /* The image width */
  }
}
.main {
  display: flex;
  justify-content: center;
  margin-top: 4rem;
}
.main-left {
  width: 25%;
  margin-left: 4rem;
  margin-right: 15rem;
}
.main-middle {
  width: 40%;
  margin-right: 15rem;
}
.main-right {
  width: 25%;
  margin-right: 4rem;
}
.box1 {
  background-color: #fd551b;
  width: 100%;
  border-radius: 35px;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 1rem;
  border: solid rgb(247, 247, 247) 5px;
}
.box2 {
  background-color: #fd551b;
  width: 100%;
  border-radius: 35px;
  height: 57%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: solid rgb(247, 247, 247) 5px;
}
.box3 {
  background-color: #fd551b;
  width: 100%;
  border-radius: 35px;
  height: 65%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: solid rgb(247, 247, 247) 5px;
}
.enterName {
  background-color: #feefdd;
  border-radius: 35px;
  width: 83%;
  height: 3rem;
  margin: auto;
  padding: 0rem 1.5rem 0rem 1.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}
.customizeButton {
  width: 83%;
  border-radius: 35px;
  height: 6rem;
  margin: auto;
  background-color: #feefdd;
  margin-bottom: 1rem;
  font-size: 2rem;
  border: solid rgb(247, 247, 247) 5px;
}
.signInButton {
  width: 83%;
  border-radius: 35px;
  height: 4rem;
  margin: auto;
  background-color: #feefdd;
  margin-bottom: 1rem;
  font-size: 2rem;
  border: solid rgb(247, 247, 247) 5px;
}
.joinButton {
  width: 20rem;
  border-radius: 35px;
  height: 7rem;
  margin: 2rem;
  margin-bottom: 0rem;
  margin-left: 5rem;
  background-color: #fd551b;
  font-size: 4rem;
  border: solid rgb(247, 247, 247) 5px;
}
.play {
  width: 3rem;
}
.circle {
  background-color: #fd551b;
  height: 32rem;
  width: 32rem;
  border-radius: 50%;
  position: relative;
  margin-right: 8rem;
}
.chicken {
  height: 30rem;
  position: absolute;
  top: 35%;
  right: 38%;
}
/* The switch - the box around the slider */
.switch {
  position: absolute;
  display: inline-block;
  width: 60px;
  height: 34px;
  top: 7%;
  left: 90%;
}
/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: black;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}
input:checked + .slider {
  background-color: #9b713a;
}
input:focus + .slider {
  box-shadow: 0 0 1px #9b713a;
}
input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}
/* Rounded sliders */
.slider.round {
  border-radius: 34px;
  margin-right: 0;
  position: absolute;
  left: 0;
}
.slider.round:before {
  border-radius: 50%;
}
.wordLogo {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.wrap {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
