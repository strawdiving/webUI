<template>
  <div class="container">
    <el-tabs :tab-position="'top'" style="height:580px;" type="border-card">
      <el-tab-pane label="坐标系">
        <coordinate></coordinate>
      </el-tab-pane>
      <el-tab-pane label="默认程序">
        <default-prog></default-prog>
      </el-tab-pane>
      <el-tab-pane label="函数">
        <custom-functions></custom-functions>
      </el-tab-pane>
      <el-tab-pane label="Modbus">
        <modbus></modbus>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {getConfigs, updateConfig} from '@/api/index'
import Coordinate from '@/components/Coordinate'
import DefaultProg from '@/components/DefaultProg'
import CustomFunctions from '@/components/CustomFunctions'
import Modbus from '@/components/Modbus'
export default {
  data(){
    return {

    }
  },
  components: {
    DefaultProg,
    Modbus,
    CustomFunctions,
    Coordinate
  },
  methods: {
    initConfig(){
      getConfigs().then((res) => {
        if (res.status === 200) {
          sessionStorage.setItem('config', JSON.stringify(res.data))
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  mounted(){

  }
}
</script>

<style scoped>
  .container {
    padding: 20px;
    font-size: 1.05rem;
  }
  .el-tab-pane {
    padding: 20px;
  }
</style>


