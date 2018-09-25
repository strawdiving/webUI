<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="11" class="prog-area">
        <div class="prog-title">
          <el-button type="primary" @click="showDialog()">选择程序</el-button>
          <span class="prog-name">
            程序名称：
            <span>&nbsp;&nbsp;{{scriptName}}</span>
          </span>
        </div>
        <div class="repeat">
          <el-radio-group v-model="repeated">
            <el-radio label="1"><label>单次</label></el-radio>
            <el-radio label="2"><label>无限重复</label></el-radio>
            <el-radio label="3" @change="showRepeat"><label>重复次数： </label></el-radio>
          </el-radio-group>
          <!--<el-checkbox v-model="repeated" @change="showRepeat"><label>重复</label></el-checkbox>-->
          <span v-if="repeatedTimes > 0">{{ repeatedTimes}}</span>
        </div>
        <!-- <textarea ref="tv" class="prog-content" readonly wrap="off" v-model="script">
        </textarea> -->
        <div id="showDiv" class="prog-div" ref="showDiv">
          <div v-for="(o, index) in scriptContent" :key="index" :class="index===programLine?'selectRow':'otherRow'">
            <span class="font-index">{{index + 1}}.</span>&nbsp; <span :class="o.trim().startsWith('#')?'prog-annotation':''">{{o}}</span>
          </div>
        </div>
        <div class="run-time">
          运行时间：
          <label>{{runTimeString}}</label>
          <span class="program-status">运行状态：
            <label>{{programStatus}}</label>
          </span>
        </div>
        <!-- <div class="debug-div" v-if="programRun">
          <div v-for="(o) in debugMsg" :key="o" >
            {{o}}
          </div>
        </div> -->
        <div class="move" v-if="moveVisible">
          <button @mousedown="moveStartPoint" @mouseup="moveStartRelease">按住移动</button>
        </div>
      </el-col>
      <el-col :span="12" class="setup">
        <el-row>
          <el-col :span="13">
            <div class="option-container">
              <div class="item-label">
                <img v-if="collisionDetect" src="../assets/node_enable.png" width="18px"/>
                <img v-else src="../assets/node_disable.png" width="18px"/>
                <span v-if="collisionDetect">碰撞检测开</span>
                <span v-else>碰撞检测关</span>
              </div>
              <div class="item-label">
                <img v-if="simulation" src="../assets/node_enable.png" width="18px" @click="switchSimulation"/>
                <img v-else src="../assets/node_disable.png" width="18px" @click="switchSimulation"/>
                <span v-if="simulation">仿真运行</span>
                <span v-else>真机运行</span>
              </div>
            </div>
          </el-col>
          <el-col :span="11">
            <div class="speed">
              <span>速度</span>
              <el-slider class="speed-slider" v-model="speed" :show-tooltip="false" :min="5" :max="100" @change="adjustSpeed"></el-slider>
              <span>{{speed}} %</span>
            </div>
          </el-col>
        </el-row>
        <div class="info-container">
          <pos></pos>
        </div>
        <div class="control-group">
          <el-button @click="stopProgram" type="primary">停止</el-button>
          <el-button @click="runProgram" type="primary">启动</el-button>
          <el-button @click="stepProgram" type="primary">单步</el-button>
          <el-button @click="pauseProgram" type="primary">暂停</el-button>
        </div>
      </el-col>
    </el-row>
    <el-dialog class="run-dialog" title="选择脚本程序" :visible.sync="selectListVisible" :close-on-click-modal="false" center>
      <el-table :data="scriptList" height="250" highlight-current-row @current-change="handleSelect" :default-sort="{prop: 'name', order:'ascending'}">
        <el-table-column prop="name" label="名称" width="180" sortable></el-table-column>
        <el-table-column prop="mtime" label="修改日期" width="200" sortable></el-table-column>
        <el-table-column prop="size" label="大小" width="100"></el-table-column>
      </el-table>

      <el-upload ref="upload" action="http://localhost:3000/scripts/upload" class="upload-demo" name="scriptFile" accept=".spf" :on-success="uploadSuccess">
        <el-button type="text">从本地导入...</el-button>
      </el-upload>

      <!-- <form action="http://localhost:3000/photos/upload"  method="post" enctype="multipart/form-data">
        <p>选择文件: <input type="file" name="test"></p>
        <input type="submit" value="提交"/>
      </form> -->

      <div class="button-group">
        <el-button @click="cancelItem">取消</el-button>
        <el-button type="primary" @click="confirmItem">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="repeatVisible" width="36%">
    <span class="repeat-input">请输入重复次数
      <input type="text" v-number-only placeholder="默认为无限" v-model.number="repeatedTimes" maxlength="2"/>
    </span>
      <div class="button-group">
        <el-button @click="cancelRepeat">取消</el-button>
        <el-button type="primary" @click="confirmRepeat">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pos from '@/components/Pos'
  import {getScripts, readScript, scriptTask, stopTask, moveTo} from '@/api/index'
  import StatusCard from '@/components/StatusCard'
  export default {
    data() {
      return {
        scriptName: '',
        selectName: '',
        scriptList: [],
        script: '',
        scriptContent: [],
        listLoading: false,
        contentLoading: false,
        selectListVisible: false,
        collisionDetect: false,
        simulation: true,
        speed: 50,
        debugMsg: [],
        programStatus: '',
        runTime: 0,
        runTimeString: '',
        //
        //定时器id
        intervalId: 0,
        repeatVisible: false,
        repeated: false,
        repeatedTimes: 0,

        // 是否需要检查起始点
        checkStartPoint: true,
        programAxisMoveTo: [],
        xyzMoveTo: [],
        startPointMoveType: 0,

        moveVisible: false,

      }
    },
    computed: {
      programRun(){
        return this.$store.state.status.progInfo.progRunning
      },
      debugUpdate(){
        return this.$store.state.status.progInfo.printIndex
      },
      jointPos() {
        var pos = []
        for (let i = 0; i < 7; i++) {
          let v = this.$store.state.status.fromPLC.jointInfo[i].actualPos
          pos.push(v)
        }
        return pos
      },
      cordPos() {
        return this.$store.state.status.fromPLC.cartesianInfo.actPos
      },
      programLine() {
        return this.$store.state.status.progInfo.programLine
      }
    },
    watch: {
      debugUpdate: function (newIndex, oldIndex) {
        this.debugMsg.push(this.$store.state.status.progInfo.printMsg)
      },
      programRun: function (newVal, oldVal) {
        if (newVal && !oldVal) {
          this.startTimer()
        }
        if (!newVal && oldVal) {
          this.stopTimer()
          this.checkRepeat()
        }
      },
      programLine: function (newVal, oldVal){
        // 根据programLine确定滚动条位置
        this.$refs.showDiv.scrollTop = newVal * 30
      }
    },
    methods: {
      // 获取脚本文件列表
      requireList() {
        this.listLoading = true
        getScripts().then((res) => {
          this.scriptList = res.data.data
          this.listLoading = false
          this.$store.commit('updateScriptList', this.scriptList)
        }).catch((err) => {
          console.log(err)
        })
      },
      //获取脚本文件内容
      requireScript(name) {
        let para = {
          name:name
        }
        this.contentLoading = true
        readScript(para).then((res) => {
          this.contentLoading = false
          this.script = res.data.content
          // console.log(this.script)
          this.scriptContent = this.script.trim().split('\n')
          // console.log(this.scriptContent)
          this.updateProgStatus('READY')
        }).catch((err) => {
          this.$message.error('打开脚本错误')
        })
      },
      //显示脚本选择对话框
      showDialog(){
        //检测是否有程序在运行中
        if (this.programRun) {
          this.$confirm('是否停止当前程序', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '返回',
            type: 'warning'
          }).then(()=>{
            this.stopProgram()
          }).catch(()=>{
            return
          })
        }
        this.selectListVisible = true
        this.requireList()
        this.$refs.upload.clearFiles()
        this.moveVisible = false
      },
      handleSelect(val){
        this.selectName = val.name
      },
      cancelItem(){
        this.selectName = ''
        this.selectListVisible = false
      },
      confirmItem(){
        this.selectListVisible = false
        this.scriptName = this.selectName

        this.requireScript(this.scriptName)
      },
      uploadSuccess(res, file, fileList){
        this.selectName = file.name
      },

      runProgram(){
        if (!this.programRun) {
          // check if need to move to the start point manually
          if (!this.repeated && this.checkStartPoint &&(this.repeatedTimes === 0)) {
            var index = 0
            var line = this.scriptContent[index]
            var keyword = line.split('(')[0].trim()
            while (!['Start', 'MoveJ', 'MoveL', 'MoveC_1', 'movej', 'movel', 'movec', 'movec_1'].includes(keyword)) {
              if (index === this.scriptContent.length - 1) break
              line = this.scriptContent[++index]
              keyword = line.split('(')[0].trim()
            }
            if (['Start', 'MoveJ', 'MoveL', 'MoveC_1', 'movej'].includes(keyword)) {
              let para = []
              let pass = false
              if (keyword === 'movej') {
                para = line.split('([')[1].split('],')[0].split(',')
                if (para.length !== 7)  pass = true
              } else {
                para = line.split('(')[1].split(')')[0].split(',')
              }

              let variance = 0
              for (let i = 0; i < 7; i++) {
                if (keyword === 'movej') {
                  variance += Math.abs(para[i] - this.jointPos[i])
                } else {
                  variance += Math.abs(para[i + 8] - this.jointPos[i])
                }
              }

              if (variance > 1 && !pass) {
                if (keyword === 'movej') {
                  for(let i = 0; i < 7; i++) this.programAxisMoveTo[i] = Number(para[i])
                } else {
                  for(let i = 8; i < 15; i++) this.programAxisMoveTo[i - 8] = Number(para[i])
                }

                ///
                this.moveVisible = true
                this.startPointMoveType = 0
                console.log(this.programAxisMoveTo)
                return
              }
            }

            if (['movel', 'movec', 'movec_1'].includes(keyword)) {
              let para = []
              let pass = false
              para = line.split('([')[1].split('],')[0].split(',')
              if (para.length !== 6) pass = true

              let variance = 0
              for(let i = 0; i < 6; i++){
                variance += Math.abs(para[i] - this.cordPos[i])
              }
              if (variance > 1 && !pass) {
                for(let i = 0; i < 7; i++) this.xyzMoveTo[i] = Number(para[i])

                //
                this.moveVisible = true
                this.startPointMoveType = 1
                console.log(this.xyzMoveTo)
                return
              }
            }
          }
        }
        this.moveVisible = false
        this.handleScriptTask(this.scriptName, 'start', this.speed)

        this.updateProgStatus('RUN')
        this.checkStartPoint = true
      },
      stopProgram(){
        this.handleScriptTask(this.scriptName, 'stop', this.speed)
        this.updateProgStatus('READY')
      },
      pauseProgram(){
        this.handleScriptTask(this.scriptName, 'pause', this.speed)
        this.updateProgStatus('PAUSE')
      },
      stepProgram(){
        this.handleScriptTask(this.scriptName, 'step', this.speed)
        this.updateProgStatus('STEP')
      },
      adjustSpeed(val){
        this.handleScriptTask(this.scriptName, 'adjustSpeed', val)
      },

      handleScriptTask(scriptName, task, speed){
        if (this.scriptName === '') {
          this.$message({
            message: '请选择程序文件',
            type: 'warning'})
          return
        }
        if (!['start', 'stop', 'step', 'pause', 'adjustSpeed'].includes(task)) {
          return
        }
        if (speed < 5 || speed > 100) {
          return
        }
        let para ={
          deviceId: 1,
          cmd: "script",
          data: {
            name: scriptName,
            task: task,
            speed: speed
          }
        }
        scriptTask(para).then((res) => {
          console.log(res)
        }).catch((err) => {
          console.log(err)
        })
      },
      switchSimulation(){
        this.simulation = !this.simulation
      },
      // 移动到启动点
      moveStartPoint() {
        if (this.startPointMoveType === 0) {
          moveTo(0, this.programAxisMoveTo, 80).then((res)=>{

          }).catch((err)=>{

          })
        } else if (this.startPointMoveType === 1) {
          moveTo(3, this.xyzMoveTo, 80).then((res)=>{

          }).catch((err)=>{

          })
        }
      },
      moveStartRelease() {
        stopTask()
      },
      //启动程序运行计时
      startTimer(){
        this.runTime = 0
        this.runTimeString = ''
        var self = this
        this.intervalId = window.setInterval(function(){
          self.runTime += 500
          self.showTimeString(self.runTime)
        }, 500)
      },
      // 停止计时
      stopTimer(){
        window.clearInterval(this.intervalId)
      },
      //格式化时间显示
      showTimeString(timeMs){
        var temp = parseInt(timeMs / 1000)
        var ms = timeMs % 1000
        var seconds = temp % 60
        var minutes = parseInt(temp / 60)
        if (minutes === 0) {
          this.runTimeString = seconds + "." + ms + "s"
        } else {
          this.runTimeString = minutes + "m " + seconds + "." + ms + "s"
        }
        console.log(this.runTimeString)
      },
      updateProgStatus(state) {
        switch (state) {
          case 'READY':
            this.programStatus = '就绪'
            break
          case 'RUN':
            this.programStatus = '运行中'
            break
          case 'PAUSE':
            this.programStatus = '暂停'
            break
          case 'STEP':
            this.programStatus = '单步运行'
            break
        }
      },
      showRepeat(){
        if (this.repeated) {
          this.repeatVisible = true
        }
      },
      checkRepeat() {
        if (this.repeated) {
          if (this.repeatedTimes > 0) {
            this.runProgram()
            this.repeatedTimes--
          } else if (this.repeatedTimes < 0) {
            this.runProgram()
          } else if (this.repeatedTimes === 0) {
            this.repeated = false
          }
        }
      },
      cancelRepeat() {
        this.repeated = false
        this.repeatVisible = false
      },
      confirmRepeat() {
        if (this.repeatedTimes < 0) {
          this.repeatedTimes = -1
        }
        this.repeatVisible = false
      }
    },
    components: {
      Pos,
      StatusCard,
    }
  }
</script>

<style scoped>
  *{
    box-sizing: border-box;
  }
  .container {
    /*width: 100%;*/
    /*top: 60px;*/
    padding: 40px 20px;
  }
  .el-row {
    text-align: left;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    align-items: stretch;

    /*width: 100%;*/
    /*padding: 20px 20px;*/
    /*margin: auto;*/

  }
  .prog-area, .setup {
    background-color: rgba(255, 255, 255, .5);
    /*background-color: rgba(225, 225, 225, 1);*/
    box-shadow: 0 0 10px #93a3d3;
    /*width: 100%;*/
    padding: 20px 30px;
  }

  .prog-area {
    /*float: left;*/

  }
  .setup {
    /*float: right;*/
  }
  .font-index {
    color: #aaa;
    font-size: 14px;
  }
  .prog-title {
    text-align: left;
  }
  .prog-name {
    margin-left: 30%;
  }
  .repeat {
    float: left;
    margin: 20px 0;
  }
  .prog-div {
    width: 100%;
    height: 280px;
    border: 1px solid #a0b2e6;
    background: #fff;
    white-space: nowrap;
    overflow: auto;
    text-align: left;
  }
  /*.prog-annotation {*/
  /*color: #999;*/
  /*font-size: 15px;*/
  /*font-style: italic;*/
  /*}*/
  /*.debug-div {*/
  /*width: 90%;*/
  /*height: 100px;*/
  /*margin-top: 60px;*/
  /*background: #fff;*/
  /*overflow: auto*/
  /*}*/
  .selectRow {
    background: #d6d6d6;
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
  }
  .otherRow {
    height:30px;
    line-height: 30px;
    padding-left: 10px;
  }
  .run-time {
    height: 40px;
    text-align: left;
    vertical-align: middle;
    margin-top: 20px;
  }
  .run-time label {
    color: #409EFF;
  }
  .program-status {
    margin-right: 10%;
    float: right;
  }
  .option-container, .speed, .control-group {
    padding: 10px 0;
    width: 100%;
    display: -webkit-box;
    -webkit-box-pack: center;
    -webkit-box-align: center;
  }
  .speed {
    padding-top: 2px;
  }
  .option-container .item-label {
    margin-right: 20px;
  }

  .speed .el-slider {
    padding-left: 10px;
    padding-right: 10px;
    width: 50%;
  }
  .info-container {
    width: 100%;
    height: 325px;
    background: #fff;
  }

  .control-group .el-button {
    margin-right: 20px;
  }
  .run-dialog {
    width: 80%;
  }
  .button-group {
    text-align: right;
    padding-right: 10px;
  }
  .run-btn {
    margin-top: 40px;
  }
  .repeat-input input {
    width: 30%;
    margin: 0 0 20px 10px;
  }
  .move {
    margin-top: 20px;
    margin-right: 50px;
  }
  .move button{
    /*height: 40px;*/
    width: 100px;
  }
</style>


