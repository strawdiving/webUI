<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="12" class="status-area">
        <status-card v-for="state in states" v-bind:state="state" v-bind:key="state.key"></status-card>
        <status-gauge></status-gauge>
      </el-col>
      <el-col :span="11" class="simulation">
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import StatusCard from '@/components/StatusCard'
  import statusGauge from '@/components/statusGauge'
  export default {
    data() {
      return {
        states: [
          {key: 1, title: '整机运行时间', value:'3 h 28 m', image: '/static/img/siasun.png'},
          {key: 2, title: '本次运行时间', value:'2 m 28 s', image: '/static/img/siasun.png'},
          {key: 3, title: '整机功率(KW)', value:'118 KW', image: '/static/img/siasun.png'},
          {key: 4, title: '当前运行程序', value:'Program1', image: '/static/img/siasun.png'},
        ]
        }
    },
    computed: {

    },
    watch: {

    },
    methods: {

    },
    components: {
      StatusCard,
      statusGauge
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
  .simulation {
    background-color: rgba(255, 255, 255, .5);
    /*background-color: rgba(225, 225, 225, 1);*/
    box-shadow: 0 0 10px #93a3d3;
    /*width: 100%;*/
    padding: 20px 30px;
  }

  .status-area {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: stretch;
  }

</style>

