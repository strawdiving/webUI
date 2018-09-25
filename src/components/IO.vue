<template>
<el-row>
  <el-col :span="16" :xs="10">
    <div class="container">
      <div class="title">
        控制柜IO
      </div>
      <fieldset>
        <legend>数字输入</legend>
        <div v-for="(o, index) in 14" :key="o" class="text item">
          <span class="item-tag">{{o}}</span>
          <div :class="inputIO[index]?'icon-highlight':'icon-grey'" class="icon"></div>
        </div>
      </fieldset>
      <fieldset>
        <legend>数字输出</legend>
        <div v-for="(o, index) in 14" :key="o" class="text item" >
          <span class="item-tag">{{o}}</span>
          <div :class="outputIO[index]?'icon-highlight':'icon-grey'" class="icon" @click="switchOutput(0,index)" style="cursor:pointer;"></div>
        </div>
      </fieldset>
    </div>
  </el-col>
  
  <el-col :span="6" :offset="1" :xs="10">
    <div class="container">
      <div class="title">
        工具IO
      </div>
      <fieldset>
        <legend>工具输入</legend>
        <div v-for="(o, index) in 4" :key="o" class="text item" >
          <span class="item-tag">{{o}}</span>
          <div :class="toolIoIn[index]?'icon-highlight':'icon-grey'" class="icon"></div>
        </div>
      </fieldset>
      <fieldset>
        <legend>工具输出</legend>
        <div v-for="(o, index) in 4" :key="o" class="text item" >
          <span class="item-tag">{{o}}</span>
          <div :class="toolIoOut[index]?'icon-highlight':'icon-grey'" class="icon" @click="switchOutput(1,index)" style="cursor:pointer;"></div>
        </div>
      </fieldset>
    </div>
  </el-col>
  <el-col :span="5">

  </el-col>
</el-row>
</template>

<script>
import {ioTask} from '@/api/index'
export default {
  data() {
    return {
      inputState: [false, false, false, false, false, false],
      outputState: [false, false, false, false, false, false],
      toolInputState: [false, false, false, false,],
      toolOutputState: [false, false, false, false,],
    }
  },
  computed: {
    inputIO(){
      return this.$store.state.status.fromPLC.fbRobotData.digitalIn
    },
    outputIO(){
      return this.$store.state.status.fromPLC.fbRobotData.digitalOut
    },
    toolIoIn(){
      return this.$store.state.status.fromPLC.fbRobotData.toolIoIn
    },
    toolIoOut(){
      return this.$store.state.status.fromPLC.fbRobotData.toolIoOut
    }
  },
  methods: {
    /**
     * type, 0: 控制柜; 1: tool
     */
    switchOutput(type, index) {
      if (type !== 0 && type !== 1) {
        return
      }
      if (type == 0 && (index > 5 || index < 0)) {
        return
      }
      if (type == 1 && (index > 3 || index < 0)) {
        return
      }
      let para = {
        deviceId: 1,
        cmd: "io",
        data: {
          type: type,
          port: index,
          status: !this.outputState[index]
        }
      }
      console.log(para)
      ioTask(para).then((res) => {
        console.log(res)
      }).catch((err) =>{
        console.log(err)
      })
    },
  }
}
</script>

<style scoped>
.container {
  float: left;
  background: #fff;
  padding: 10px;
}
.container fieldset {
  margin-top: 10px;
  border-color: #eee;
  border-radius: 3px;
}
.text {
  font-size: 14px;
  text-align: left;
}
.item {
  width: 80px;
  height: 60px;
  display: -webkit-box;
  -webkit-box-pack: center;
  -webkit-box-align: center;
  float: left;
}
/* .clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
} */
.icon {
  width: 16px;
  height: 16px;
  border-radius: 8px;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  vertical-align: text-bottom;
  display: inline-block;
}
.icon-highlight {
  background-color: rgb(18, 196, 228);
}
.icon-grey {
  background-color: #888;
}
</style>
