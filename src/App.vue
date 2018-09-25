<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
import io from "socket.io-client";
export default {
  name: 'App',
  components: {
  },
  computed: {
    errorInfo() {
      return this.$store.state.status.errorInfo
    }
  },
  watch: {
    errorInfo: function (newVal, oldVal) {
      if (newVal.errorIndex !== oldVal.errorIndex) {
        this.warn(newVal.errorMsg)
      }

    }
  },
  methods: {
    warn(msg){
      this.$message.error(msg)
    }
  },
  mounted() {
    let self = this;
    // var socket = io("http://192.168.12.250:3000");
    // socket.on("message", function(data) {
    //   // console.log(data)
    //   self.$store.commit("updateState", data);
    // });
  }
}
</script>

<style>
@import './../static/css/global.css';
body {
  margin-top: 0px;
  padding: 0px;
  /* width: 1600px;
  margin-left: auto;
  margin-right: auto; */
  overflow: hidden;
  background-color: #f1f2f7;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
