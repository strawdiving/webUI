<template>
    <el-card class="status" shadow="always">
      <el-row>
        <el-col :span="14">
          <img :src= "state.image">
          <!--<img src="../assets/siasun.png">-->
        </el-col>
        <el-col :span="8">
          <div class="state">
            <p class="title">{{state.title}}</p>
            <p class="value">{{state.value}}</p>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <div style="padding: 8px;">
          <span>状态信息</span>
        </div>
      </el-row>
    </el-card>
</template>

<script>
    export default {
      props: ['state'],
      data() {
          return {

          }
        }
    }
</script>

<style scoped>
  .status {
    margin: 5px 10px;
  }
  .state {
    text-align: end;
  }

</style>
