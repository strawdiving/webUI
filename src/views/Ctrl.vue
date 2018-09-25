<template>
  <div class="container">
    <el-row class="setup">
      <el-col :span="5" class="coord-area">
        <img src="../assets/move_coordinate2.png" width="30px">
        坐标系：
        <el-select v-model="value" placeholder="坐标系">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <!--<el-radio-group v-model="coordsRadio">-->
        <!--<el-radio :label="1">基坐标系</el-radio>-->
        <!--<el-radio :label="2">工具坐标系</el-radio>-->
        <!--<el-radio :label="3">用户坐标系</el-radio>-->
        <!--</el-radio-group>-->
      </el-col>
      <el-col :span="5" class="speed">
        <span class="speed-text">速度</span>
        <el-slider class="speed-slider" v-model="speed" :show-tooltip="false"></el-slider>
        <span>{{speed}}%</span>
      </el-col>
      <el-col :span="5" class="sim">
        <img v-if="simulation" src="../assets/move_3D_enable.png" width="30px" @click="simulate"/>
        <img v-else src="../assets/move_3D.png" width="30px" @click="simulate"/>
        <span v-if="simulation">模拟运行</span>
        <span v-else>真机运行</span>
      </el-col>
      <el-col :span="5" class="teach-area">
        <span>牵 引: </span>
        <el-switch v-model="teachEnable"  active-text="开" @change='startTeach'></el-switch>
        <!--<el-button size="medium" @click="startTeach">牵 引</el-button>-->
      </el-col>
    </el-row>
    <el-row class="control">
      <el-col :span="6" class="simulation">
        <pos></pos>
      </el-col>
      <el-col :span="6" class="axis-area">
        <jog-line :speed=speed></jog-line>
      </el-col>
      <el-col :span="6" class="axis-area">
        <jog-axis :speed=speed></jog-axis>
      </el-col>
    </el-row>
    <el-row class="move-button">
      <el-button class="home-btn" type="primary" @mousedown.native="moveInit" @mouseup.native="stop">归零</el-button>
      <el-button type="primary" @click="moveDialog">移动至...</el-button>
    </el-row>
    <el-dialog :visible.sync="moveVisible">
      <move :speed=speed class="moveParam"></move>
    </el-dialog>


    <el-dialog :visible.sync="teachVisible" class="teach-dialog" :close-on-click-modal="false">
      <h3>点击确定退出牵引模式</h3>
      <el-button type="primary" @click="exitTeach">确定</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import JogAxis from '@/components/JogAxis'
  import Pos from '@/components/Pos'
  import JogLine from '@/components/JogLine'
  import Move from '@/components/Move'
  import {stopTask, switch2Teach, moveInit} from '@/api'
  export default {
    data() {
      return {
        simulation: false,
        speed: 50,
        moveVisible: false,
        coordsRadio: 1,
        teachVisible: false,
        teachEnable: false,
        options: [{
          value: '选项1',
          label: '基座标系'
        }, {
          value: '选项2',
          label: '工具坐标系'
        }, {
          value: '选项3',
          label: '用户坐标系'
        }],
        value: ''
      }
    },
    methods:{
      selectCoord(command) {
        this.$message('click on item ' + command);
      },
      simulate(){
        this.simulation = !this.simulation
      },
      //home
      moveInit() {
        moveInit().then((res) => {
          console.log(res)
        }).catch((err) => {
          console.log(err)
        })
      },
      stop() {
        stopTask().then((res) => {
          console.log(res)
        }).catch((err) => {
          console.log(err)
        })
      },
      moveDialog(){
        this.moveVisible = true
      },
      startTeach() {
        if(this.teachEnable) {
          switch2Teach().then((res) => {
            this.teachVisible = true
          }).catch((err) =>{
            this.$message({
              message: '无法进入牵引模式',
              type: 'warning'
            })
          })
        }
      },
      exitTeach() {
        this.teachVisible = false
        stopTask().then((res)=>{
        }).catch((err)=>{

        })
      }
    },
    components: {
      JogAxis,
      JogLine,
      Pos,
      Move
    },
    mounted() {

    }
  }
</script>

<style scoped>
  * {
    box-sizing: border-box;
  }
  .container {
    padding: 40px 20px;
  }
  .el-row {
    text-align: left;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    align-items: stretch;
    margin-bottom: 20px;
  }
  .setup {
    display: flex;
    flex-flow: row nowrap;
    justify-content: stretch;
    align-items: stretch;
    border-bottom: 1px solid #93a3d3;
    padding: 10px;
  }
  .setup .el-col {

    /*background-color: rgba(255, 255, 255, .5);*/
    /*border-right: 1px solid #93a3d3;*/
  }
  .coord-area {
    /*position: absolute;*/
    /*top: 480px;*/
    /*right: 50px;*/
    flex: 1 1 40%;
  }
  .speed {
    /*height: 60px;*/
    display: -webkit-box;
    -webkit-box-pack: start;
    -webkit-box-align: center;
    flex: 1 1 30%;
  }
  .speed span {
    /*display: inline-block;*/
  }
  .speed-slider {
    width: 60%;
    padding: 0 10px;
  }
  .sim {
    /*height: 60px;*/
    display: -webkit-box;
    -webkit-box-pack: start;
    -webkit-box-align: center;
    flex: 1 1 15%;
    /*margin-left: 20px;*/
  }
  .sim img {
    display: -webkit-box;
    -webkit-box-pack: start;
    -webkit-box-align: center;
    padding-right: 5px;
  }
  .teach-area {
    /*position:absolute;*/
    /*left: 40%;*/
    /*top: 360px;*/
    display: -webkit-box;
    -webkit-box-pack: start;
    -webkit-box-align: center;
    flex: 1 1 15%;
    /*background-image: url("../assets/move_teach2.png");*/
    /*background-repeat: no-repeat;*/
    /*background-position: left bottom;*/
    /*background-size: 25px 25px;*/
  }
  .moveParam {
    margin: auto;
  }
  .move-button {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    margin-bottom: 50px;
    /*position: absolute;*/
    /*top: 450px;*/
    /*left: 80px;*/
  }
  .move-button .el-button {
    width: 100px;
  }

  .simulation, .axis-area {
    background-color: rgba(255, 255, 255, .5);
    box-shadow: 0 0 10px #93a3d3;
    /*width: 100%;*/
    padding: 20px 10px;
    min-width: 380px;
  }

  .teach-dialog {
    width: 50%;
    margin: auto;
    font-size: 20px;
  }
  .teach-dialog .el-button {
    margin-top: 20px;
    width: 50%;
  }
  @media (max-width: 425px) {
    .container {
      padding: 0 10px;
    }
    .el-row {
      flex-flow: column;
      justify-content: center;
      align-items: stretch;
      border-bottom: none;
      margin-bottom: 0;
    }
    .setup {
      margin-left: -5px;
      max-width: 400px;
    }
    .setup .el-col {
      width: 100%;
      text-align: left;
      background-color: rgba(255, 255, 255, .5);
      box-shadow: 0 0 10px #93a3d3;
      padding: 15px 20px;
    }
  }
  @media (min-width: 426px)and (max-width: 1199px)
  {
    .el-row {
      flex-flow: row wrap;
      justify-content: flex-start;
      align-items: stretch;
      border-bottom: none;
      margin-bottom: 0;
    }
    .setup {
      margin-left: -10px;
      max-width: 800px;
    }
    .setup .el-col {
      width: 100%;
      text-align: left;
      background-color: rgba(255, 255, 255, .5);
      box-shadow: 0 0 10px #93a3d3;
      padding: 15px 20px;
    }
  }

</style>
