<template>
  <div class="innerContainer">
    <div class="row">
      <el-button @click="showDialog">加载默认程序</el-button>
      <span>{{scriptName}}</span>
    </div>

    <el-dialog class="run-dialog" title="选择脚本程序" :visible.sync="selectListVisible" :close-on-click-modal="false" center >
      <el-table :data="scriptList" height="250" highlight-current-row @current-change="handleSelect" :default-sort="{prop: 'name', order:'ascending'}">
        <el-table-column prop="name" label="名称" width="180" sortable></el-table-column>
        <el-table-column prop="mtime" label="修改日期" width="200" sortable></el-table-column>
        <el-table-column prop="size" label="大小" width="100"></el-table-column>
      </el-table>

      <el-upload ref="upload1" action="http://localhost:3000/scripts/upload" class="upload-demo" name="scriptFile" accept=".spf" :on-success="uploadSuccess">
        <el-button type="text">从本地导入...</el-button>
      </el-upload>

      <div class="button-group">
        <el-button @click="cancelItem">取消</el-button>
        <el-button type="primary" @click="confirmItem">确定</el-button>
      </div>
    </el-dialog>

    <div class="row">
      当
      <el-select v-model="input" placeholder="请选择" class="select-item">
        <el-option v-for="item in inputOption" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      为
      <el-select v-model="triggerValue" placeholder="请选择" class="select-item">
        <el-option v-for="item in triggers" :key="item" :label="item" :value="item" ></el-option>
      </el-select>
      时
    </div>
    <div class="button-group row">
      <el-button>取消</el-button>
      <el-button type="primary"  @click="loadProg">确认</el-button>
    </div>
  </div>
</template>

<script>
import {getScripts} from '@/api/index'
export default {
  data(){
    return {
      scriptName: '',
      selectName: '',
      scriptList: [],
      listLoading: false,
      selectListVisible: false,
      inputOption: ['DI 1','DI 2','DI 3','DI 4','DI 5','DI 6'],
      input: '',
      triggers: ['高电平', '低电平'],
      triggerValue: '',
    }
  },
  methods: {
    // 获取脚本文件列表
    requireList() {
      this.listLoading = true
      getScripts().then((res) => {
        this.scriptList = res.data.data
        this.listLoading = false
      }).catch((err) => {
        console.log(err)
      })
    },
    //显示脚本选择对话框
    showDialog(){
      this.selectListVisible = true
      this.requireList()
      this.$refs.upload1.clearFiles()
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
    },
    uploadSuccess(res, file, fileList){
      this.selectName = file.name
    },
    //确认设定默认程序
    loadProg(){
      if (this.scriptName === '') {
        this.$message('未选择默认程序')
        return
      }

    },

    // 获取默认程序名称
    requireDefaultProg(){

    },
  },
  mounted(){
    //
    this.requireDefaultProg()
  },
  components:{

  },

}
</script>

<style scoped>
.innerContainer {
  width: 400px;
  margin: auto;
}
.row {
  height: 80px;
  display: -webkit-box;
  -webkit-box-pack: start;
  -webkit-box-align: center;
}
.select-item {
  width: 120px;
}
.button-group {
  margin-left: 60px;
}
</style>

