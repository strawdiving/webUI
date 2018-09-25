<template>
  <div class="innerContainer">
    <div class="row">
      <el-button type="primary" @click="createFunction(true)">创建自定义函数</el-button>
    </div>

    <div v-show="createVisible=== true">
      <label>添加自定义函数</label>
      <el-form :model="Function" label-position="left" label-width="80px"  class="Function">
        <el-form-item label="名称">
          <el-input v-model="Function.name" placeholder="函数名称"></el-input>
        </el-form-item>
        <el-form-item label="参数列表">
          <div>
            <el-button @click="createArgs(true)">+</el-button>
            <el-form-item label="参数类型" v-show="argVisible===true">
              <el-select :v-model="arg.type" placeholder="参数类型">
                <el-option v-for="item in argTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="参数名称" v-show="argVisible===true">
              <el-input :v-model="arg.name" placeholder="参数名称"></el-input>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="Function.content" placeholder="函数内容"></el-input>
        </el-form-item>
        <el-form-item label="返回值">
          <el-input v-model="Function.return" placeholder="返回值"></el-input>
        </el-form-item>
      </el-form>
      <div class="button-group">
        <el-button @click="createFunction(false)">取消</el-button>
        <el-button type="primary" @click="createFunction(false)">确定</el-button>
      </div>
    </div>

    <!--<el-dialog title="添加自定义函数" width="50%" :visible.sync="dialogVisible">-->
      <!--<el-form :model="Function" label-position="left" label-width="80px"  class="Function">-->
        <!--<el-form-item label="名称">-->
          <!--<el-input v-model="Function.name" placeholder="函数名称"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="参数">-->
          <!--<el-input v-model="Function.args" placeholder="参数">-->
          <!--</el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="内容">-->
          <!--<el-input v-model="Function.content" placeholder="函数内容"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="返回值">-->
          <!--<el-input v-model="Function.return" placeholder="返回值"></el-input>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div class="button-group">-->
        <!--<el-button @click="showDialog(false)">取消</el-button>-->
        <!--<el-button type="primary" @click="addFunction">确定</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->
    <el-button type="primary" icon="el-icon-plus" @click="showDialog(true)"></el-button>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        dialogVisible: false,
        createVisible: false,
        argVisible:false,
        arg: {
          type: 1,
          name: 'arg0',
        },
        Function: {
          name: '',
          args: [],
          content: '',
          return: 0
        },


        argTypes: [
          {value: 1, label: 'int'},
          {value: 2, label: 'string'},
          {value: 3, label: 'float'},
        ],
        modbusData: []
      }
    },
    methods:{
      createFunction(show){
        this.createVisible = show
      },
      createArgs(show){
        this.argVisible = show
      },
      addFunction(){
        var data = _.defaults({index: this.index++}, this.ModbusInfo)
        console.log(data)
        this.modbusData.push(data)
        this.dialogVisible = false
      },

      handleClick(row) {
        console.log(row);
      }
    }
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



