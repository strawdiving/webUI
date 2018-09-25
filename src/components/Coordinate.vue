<template>
  <div>
    <el-button type="primary" @click="addCoord('tcp')" >添加工具坐标系</el-button>
    <el-button type="primary" @click="addCoord('userCord')">添加用户坐标系</el-button>
    <div class="status-content">
      <tcp class="container-tcp" v-show="coordType==='tcp'"></tcp>
      <user-cord class="container-user-cord" v-show="coordType==='userCord'"></user-cord>
    </div>
  </div>
</template>

<script>
  import Tcp from '@/components/Tcp'
  import UserCord from '@/components/UserCord'
  export default {
    data() {
      return {
        coordType: 'tcp'
      }
    },
    methods: {
      addCoord(type) {
        this.coordType = type;
      }
    },
    components: {
      Tcp,
      UserCord
    }
  }
</script>

<style scoped>

</style>
