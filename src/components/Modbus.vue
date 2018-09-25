<template>
  <div class="modbusContainer">
    <el-table stripe :data="modbusData" style="width: 80%">
      <el-table-column prop="index" label="id"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="ip" label="IP"></el-table-column>
      <el-table-column prop="type" label="类型"></el-table-column>
      <el-table-column prop="slave" label="Slave"></el-table-column>
      <el-table-column prop="addr" label="Addr"></el-table-column>
      <el-table-column prop="addr" label="操作">
        <template slot-scope="scope">
          <el-button @click.native.prevent="deleteRow(scope.$index, modbusData)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加Modbus" width="30%" :visible.sync="dialogVisible">
      <el-form :model="ModbusInfo" label-position="left" label-width="50px"  class="ModbusInfo">
        <el-form-item label="IP">
          <el-input v-model="ModbusInfo.ip" placeholder="192.168.0.1"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="ModbusInfo.type" placeholder="类型">
            <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Slave">
          <el-input v-model="ModbusInfo.slave" placeholder="1"></el-input>
        </el-form-item>
        <el-form-item label="Addr">
          <el-input v-model="ModbusInfo.addr" placeholder="偏移地址"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="ModbusInfo.name" placeholder="Modbus1"></el-input>
        </el-form-item>
      </el-form>
      <div class="button-group">
        <el-button @click="showDialog(false)">取消</el-button>
        <el-button type="primary" @click="addDevice">确定</el-button>
      </div>
    </el-dialog>
    <div class="addButton">
      <el-button type="primary" icon="el-icon-plus" @click="showDialog(true)"></el-button>
    </div>
  </div>
</template>

<script>
export default {
  data(){
   return {
     index: 0,
      dialogVisible: false,
      ModbusInfo: {
        ip: '192.168.0.1',
        type: 1,
        slave: 1,
        addr: 0,
        name: 'Modbus1'
      },
      types: [
        {label: '数字输入', value: 1},
        {label: '数字输出', value: 2},
        {label: '寄存器输入', value: 3},
        {label: '寄存器输出', value: 4},
        ],
      modbusData: []
    }
  },
  methods:{
    showDialog(show){
      this.dialogVisible = show
      this.ModbusInfo.name = this.ModbusInfo.name.slice(0,this.ModbusInfo.name.length-1).concat(this.index)
      console.log(this.ModbusInfo.name)
    },

    addDevice(){
      var data = _.defaults({index: this.index++}, this.ModbusInfo)
      console.log(data)
      this.modbusData.push(data)
      this.dialogVisible = false
    },

    deleteRow(index, rows) {
      rows.splice(index, 1);
    }
  }
}
</script>

<style scoped>

.item {
  height: 40px;
  display: -webkit-box;
  -webkit-box-pack: left;
  -webkit-box-align: center;
}
.el-table {
  margin: auto;
  text-align: start;
}
  .ModbusInfo {
    padding: 20px;
  }
  .modbusContainer {
    clear: both;
  }
  .addButton {
    float: right;
    margin-right: 16%;
    margin-top: 20px;
  }
</style>
