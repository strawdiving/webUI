<template>
  <div>
    <el-col :span="12">
      <div v-for="(value, key) in bias" :key="key" class="bias-item">
        <span class="item-text">{{key}}</span>
         <input type="text" v-number-only class="item-input" v-model="bias[key]"/>
        <!-- <input type="text"/> -->
      </div>
    </el-col>

    <el-col :span="12" class="load-field">
      <div class="load-item">
        质量(kg)
        <input type="text" v-number-only class="item-input">
      </div>
      <fieldset>
        <legend>质心位置</legend>
        <div v-for="(value, key) in loadPos" :key="key" class="load-item">
          <span class="item-text">{{key}}</span>
          <input type="text" v-number-only class="item-input" v-model="loadPos[key]">
        </div>
      </fieldset>
    </el-col>
    <div class="button-group">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirmTcp">设定工具坐标系</el-button>
      <el-button type="primary" @click="loadTcps">加载工具坐标系</el-button>
    </div>
    <div class="button-group">
      <el-button @click="caliTcp">TCP标定</el-button>
      <el-button @click="setLoad">负载参数设置</el-button>
    </div>

    <!-- <div>
      选择标定种类
      <el-button>4点标定</el-button>
      <el-button>6点标定</el-button>
      <div>
        请输入工具姿态后点击下一步
        <span>RX(rad) <input type="text"/></span>
        <el-button type="primary" @click="nextStep">下一步</el-button>
      </div>
      <div>
        请移动到第一个点后点击下一步
        <el-button type="primary">下一步</el-button>
      </div>
    </div>
    <div>
      请沿工具X轴正方向移动后点击下一步
    </div>
    <div>
      请沿工具Y轴正方向移动后点击下一步
    </div>

    <el-dialog :visible.sync="caliFinished" :close-on-click-modal="false">
      TCP标定完成

      是否加载此坐标系
      <el-button @click="back">返回</el-button>
      <el-button type="primary" @click="confirmTcp">确定</el-button>
    </el-dialog> -->

  </div>
</template>

<script>
import {setTcp, getTcpCoords} from '@/api'
export default {
  data(){
    return {
      biasItems: ['X(mm)', 'Y(mm)', 'Z(mm)', 'RX(rad)', 'RY(rad)', 'RZ(rad)'],

      tcpData:{
        bias:{
          X: 0,
          Y: 0,
          Z: 0,
          RX: 0,
          RY: 0,
          RZ: 0
        },
        load: 0,
        loadPos:{
          X: 0,
          Y: 0,
          Z: 0
        }
      },

      bias: {
        'X(mm)': 0,
        'Y(mm)': 0,
        'Z(mm)': 0,
        'RX(rad)': 0,
        'RY(rad)': 0,
        'RZ(rad)': 0,
      },
      load: 0,
      loadPos: {
        'X(mm)': 0,
        'Y(mm)': 0,
        'Z(mm)': 0,
      },
      tcps:[],
      showTcps: false,
      showLoad: false,
      cali4Step: 0,
      cali6Step: 0,
      caliFinished: false,
    }
  },
  methods:{
    confirmTcp(){
      let para = {

      }
      setTcp(para).then((res)=>{
        console.log(res)
      }).catch((err)=>{
        console.log(err)
      })
    },
    cancel(){

    },
    loadTcps(){
      getTcpCoords().then((res) => {

      }).catch((err) => {
        this.$message('无法获取')
      })
    },
    caliTcp(){

    },
    setLoad(){
      this.showLoad = true
    },
    nextStep() {

    },
    back() {

    },

  }
}
</script>

<style scoped>
.bias-item {
  width: 600px;
  height: 50px;
}

.bias-item span {
  width: 80px;
  height: 50px;
}

.item-input {
  width: 200px;
  margin-left: 100px;
  display: inline-block;
}

.load-field {
  width: 440px;
  margin-top: 5px;
}

.load-field fieldset{
  width: 400px;
}

.load-item {
  width: 400px;
  height: 50px;
}
.button-group{
  width: 500px;
  margin-top: 10px;
}
</style>
