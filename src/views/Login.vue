<template>
  <div class="container">
    <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="login-container">
      <h3 class="title">欢迎使用新松机器人</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.prevent="handleSubmit" :loading="logining">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {requestLogin,start} from '@/api/index'
import {ROBOT_STATE} from '@/constants/robot'
export default {
  data() {
    return {
      logining: false,
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.logining = true
          var loginParams = {
            username: this.loginForm.username,
            password: this.loginForm.password
          }
          requestLogin(loginParams).then(data => {
            this.logining = false

            if (data.status !== 200) {
              this.$message({
                message: msg,
                type: 'error'
              })
            } else {
              sessionStorage.setItem('user', JSON.stringify(data.data.user))
              if (this.robotState != ROBOT_STATE.disable) {
                this.$router.push({path: '/ctrl'})
              } else {
                this.$router.push({path: '/init'})
              }
              
              start().then((res)=>{
                  console.log(res)
              }).catch((err) =>{
                console.log(err)
              })
            }
          })
          
        } else {
          console.log('error submit!')
          return false
        }
      })

    }
  },
  computed: {
    robotState(){
      return this.$store.state.status.fromPLC.fbRobotData.robotState
    }
  }
}
</script>

<style scoped>
.container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: #2d3a4b;

}
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff; 
  border: 1px solid #eaeaea;
}
.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

</style>
