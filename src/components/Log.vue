<!--Log list, info ,search-->
<template>
<el-row :gutter="20" class="log-container">
  <el-col :span="6" class="list-area">
    <div class="list-title">
      <h3>日志列表</h3>
      <i class="el-icon-refresh" @click="requireLogs"></i>
      <el-button @click="requireLogs" type="primary" size="small">获取</el-button>
    </div>
    <div class="list-content">
      <div class="item" v-for="(item, index) in logs" :key="index" @click="requireLog(logs[index])">
        {{item}}
      </div>
    </div>
  </el-col>
  <el-col :span="18" class="log-area">
    <div class="search-option">
      <el-input class="search-input"></el-input>
      <el-button icon="el-icon-search"></el-button>
    </div>
    <textarea class="log-content" readonly wrap="soft" cols="20" v-model="content">
    </textarea>
  </el-col>
</el-row>
</template>

<script>
import {getLogs, readLog} from '@/api'
export default {
  data() {
    return {
      listLoading: false,
      logs: [],
      logLoading: false,
      content: [],
      // filter
    }
  },
  methods: {
    requireLogs() {
      let para = {
        name
      }
      this.listLoading = true
      getLogs(para).then((res) => {
        this.logs = res.data.data
        this.listLoading = false
      }).catch((err) => {
        console.log(err)
      })
    },
    requireLog(filename) {
      let para = {
        name:filename
      }
      this.logLoading = true
      readLog(para).then((res) => {
        this.content = res.data.content
        this.logLoading = false
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.log-container {
  width: 100%;
  height: 500px;
  background: #fff;
  margin-left: 10px;
  margin-right: 10px;
}
.log-area {
  padding: 20px 20px 20px 20px;
}
.log-area span {
  float: right;
}
.search-input {
  width: 160px;
  margin-bottom: 10px;
}
.list-area {
  height:100%;
}
.list-title {
  height: 80px;
  padding-left: 10px;
  display: -webkit-box;
  -webkit-box-pack: start;
  -webkit-box-align: center;
}
.list-content {
  padding-left: 10px;
  height: 80%;
  scroll-behavior: auto;
  overflow: auto;
}
.item {
  line-height: 40px;
  text-align: left;
  margin-left: 20px;
  padding: 0;
  /*margin: 0px;*/
  cursor: pointer;
}
.item:hover{
  background-color:#bbb;
}
.item:active{
  background-color: beige;
}
.log-content {
  width: 100%;
  height: 400px;
  scroll-behavior: auto;
  overflow: auto;
}
</style>
