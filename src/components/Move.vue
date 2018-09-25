<template>
  <div class="move-container">
    <el-radio-group class="title" v-model="moveMode">
      <el-radio-button :label=1>输入关节目标位置</el-radio-button>
      <el-radio-button :label=2>输入末端位置</el-radio-button>
    </el-radio-group>

    <div v-if="moveMode==1" class="axis-field">
      <div v-for="(o, index) in 7" :key="o" class="item text">
        <span class="tag">{{'axis' + o}}</span>
        <el-input class="edit" placeholder="0.0" v-model="targetAxisPos[index]"></el-input>
      </div>
    </div>
    
    <div v-if="moveMode==2" class="line-field">
      <div v-for="(o, index) in lineTags" :key="o" class="item text">
        <span class="tag">{{o}}</span>
        <el-input class="edit" placeholder="0.0" v-model="targetPos[index]"></el-input>
      </div>
    </div>

    <el-button type="primary" @mousedown.native="move" @mouseup.native="pause">按住移动</el-button>
  </div>
</template>

<script>
import {moveTask, pauseTask, moveTo} from '@/api/index'
export default {
  data() {
    return {
      moveMode: 1,
      lineTags: ['X', 'Y', 'Z', 'RX', 'RY', 'RZ'],
      targetAxisPos: [],
      targetPos:[]
    }
  },
  props:{
    speed: {
      type: Number,
      default: 50,
      validator: function(value) {
        return value >= 0 && value <= 100
      }
    }
  },
  computed: {
    jointPos() {
      var pos = []
      for (let i = 0; i < 7; i++) {
        let v = this.$store.state.status.fromPLC.jointInfo[i].actualPos
        pos.push(Math.round(v * 100)/100)
      }
      return pos
    },
    cordPos() {
      var pos = this.$store.state.status.fromPLC.cartesianInfo.actPos
      return pos.map(x=>Math.round(x*100)/100)
    }
  },
  methods: {
    init() {
      for (let i = 0; i < 6; i++)
        this.targetPos[i] = this.cordPos[i]
      for (let i = 0; i < 7; i++)
        this.targetAxisPos[i] = this.jointPos[i]
    },
    move() {
      console.log("move press")
      if (this.moveMode == 1) {
        moveTo(0, this.targetAxisPos, this.speed).then((res) =>{
          console.log(res)
        }).catch((err)=>{
          console.log(err)
        })
      } else if (this.moveMode == 2) {
        moveTo(1, this.targetPos, this.speed).then((res) =>{
          console.log(res)
        }).catch((err)=>{
          console.log(err)
        })
      }
      
    },
    pause() {
      pauseTask().then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style scoped>
.move-container{
  width: 500px;
  height: 500px;
}
.title {
  height: 60px;
  text-align: center;
}
.axis-field {
  height: 360px;
  padding-left: 50px;
}
.line-field {
  height: 360px;
  padding-left: 50px;
}
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 10px;
  text-align: left;
}
.tag {
  width: 60px;
  display: inline-block;
}
.edit {
  width: 100px;
  display: inline-block;
}
</style>
