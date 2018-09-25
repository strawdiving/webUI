<template>
    <div id="temperature" style="width:320px;height:240px"></div>
</template>

<script>
  import echarts from 'echarts'
    export default {
      mounted() {
        var myChart = echarts.init(document.getElementById('temperature'));

        // 指定图表的配置项和数据
        var option = {
          tooltip : {
            formatter: "{a} <br/>{b} : {c}%"
          },
          toolbox: {
            show : true,
            feature : {
              mark : {show: true},
              restore : {show: true},
              saveAsImage : {show: true}
            }
          },
          series : [
            {
              name:'业务指标',
              type:'gauge',
              detail : {formatter:'{value}%'},
              data:[{value: 50, name: '完成率'}]
            }
          ]
        };

        setInterval(function (){
          option.series[0].data[0].value = (Math.random()*100).toFixed(2) - 0;
          myChart.setOption(option, true);
        },2000);
      }
    }
</script>

<style scoped>
  .status {
    margin: 5px 10px;
  }
</style>
