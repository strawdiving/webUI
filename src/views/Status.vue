<template>
<div class="status-container">
  <el-radio-group v-model="select" class="radio-group">
    <el-radio-button label="日志" class="radio-item"></el-radio-button>
    <el-radio-button label="IO状态" class="radio-item"></el-radio-button>
  </el-radio-group>
  <div class="status-content">
    <i-o class="container-io" v-show="select==='IO状态'"></i-o>
    <log class="container-log" v-show="select==='日志'"></log>
  </div>
</div>
</template>

<script>
import IO from '@/components/IO'
import Log from "@/components/Log"
export default {
  data() {
      return {
        select: 'IO状态',
      }
  },
  components: {
      IO,
      Log
  }
}
</script>

<style scoped>
.status-container {
  height: 100%;
  padding: 40px 20px;
}
.radio-group {
  margin-top: 20px;
}
.status-content {
  margin-top: 20px;
}

</style>

