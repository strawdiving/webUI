<template>
  <div class="container">
    <h2 class="title">关节初始化</h2>
    <div v-for="(o, index) in 7" :key="o" class="item text">
      <div class="tag">关节 {{o}}</div>
      <div :class="slaveReady[index]? 'icon-enable':'icon-disable'" class="icon"></div>
    </div>
    <div class="robot">
      <img src="../assets/robot.png" height="300">
    </div>
    <div class="group">
      <el-button @click="powerOff">断电</el-button>
      <el-button @click="enableAll">全部使能</el-button>
    </div>
  </div>
</template>

<script>
import {powerOff, enable} from '@/api/index'
export default {
  data(){
    return {
      jogsEnable: []
    }
  },
  computed: {
    slaveReady(){
      return this.$store.state.status.fromPLC.fbRobotData.slaveReady
    }
  },
  methods:{
    powerOff() {
      powerOff().then((res)=>{
        this.$router.push({path: '/login'})
      }).catch((err)=>{

      })
    },
    enableAll() {
      enable().then((res)=>{
        this.$router.push({path: '/ctrl'})
      }).catch((err)=>{

      })
    },
    
  }
}
</script>

<style scoped>
.container {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #2d3a4b;
}
.title {
  margin-top: 5%;
  color: #eee;
  font-weight: normal;
}
.item {
  height: 50px;
  width: 300px;
  display: -webkit-box;
  -webkit-box-pack: left;
  -webkit-box-align: center;
  margin-left: auto;
  margin-right: auto;
}
.tag {
  margin-left: 60px;
}
.text {
  font-size: 18px;
  color: #eee;
}
.icon {
  margin-left: 100px;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  vertical-align: text-bottom;
  display: inline-block;
}
.icon-enable {
  background-color: rgb(18, 196, 228);
}
.icon-disable {
  background-color: rgb(189, 58, 58);
}
.group {
  height: 60px;
  margin: 30px;
}
.el-button {
  width: 100px;
}
.robot {
  position:absolute;
  bottom: 2%;
  right: 2%;
}
</style>

