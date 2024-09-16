<template>
    <div class="loading-screen" ref="load">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" cross origin />
      <link
        href="https://fonts.googleapis.com/css2?family=Bungee+Shade&display=swap"
        rel="stylesheet"
      />
      <link href="https://fonts.googleapis.com/css2?family=Bungee+Hairline&family=Montserrat:wght@200&display=swap" rel="stylesheet">
      <h1 class="title">Skrunkle</h1>
      <img class="chicken-img" src="../assets/chicken2.png" alt="chicken" />
      <div class="flex">
        <h2 class="percentage">{{Math.round(percent * 100)}}%</h2>
        <div class="load">
          <div class="inside-bar" :style="{ width: `${percent * 100}%`  }"></div>
        </div>
      </div>
      <div class="load-text">
        <h2>{{loadtext}}</h2>
      </div>
    </div>
  </template>
  
  <style scoped>
  .title {
    font-family: "Bungee Shade", cursive;
    font-size: 150px;
    text-align: center;
  }
  
  * {
    padding: 0;
    margin: 0;
  }
  
  .flex {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    column-gap: 2%;
  }
  
  .loading-screen {
    background-image: linear-gradient(to bottom, #ff7e00, #fae6d2);
    position: absolute;
    top: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    z-index: 999;
  }
  
  .chicken-img {
    width: 80px;
    margin-left: 25%;
    margin-top: 5%;
  }
  
  .percentage {
    font-family: "Bungee Shade", cursive;
    font-size: 40px;
  }
  
  .load-text{
    font-family: 'Bungee Hairline', cursive;
    font-size: 25px;
    display: flex;
    justify-content: center;
  }
  
  .inside-bar {
    height: 100%;
    background-color: orange;
  }
  
  .load {
    overflow: hidden;
    display: block;
    width: 60rem;
    height: 3rem;
    background: (#ff7b00);
    border: solid black 4px;
    border-radius: 25px;
    box-shadow: 4px 5px black;
  }
  
  </style>
  
  <script>
  import gsap from "gsap";
  
  export default{
    name: "LoadingBar",
    props: {
        percent: Number,
        loadtext: String
    },
    methods:{
      load(){
        gsap.to(this.$refs['load'],{
            x: this.$refs['load'].offsetWidth,
            duration: 2
          })
      }
    }
  }
  
  </script>