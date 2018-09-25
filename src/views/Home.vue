<template>
<div class="main">
  <el-row class="header">
    <el-col :span="6" class="logo">
      <img src="../assets/siasun.png" class="logo-icon" height="70"/>
      <span class="title">{{sysName}}</span>
    </el-col>
    <el-col :span="12" class="menu">
        <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" background-color="transparent" text-color="#fff"
                 active-text-color="#ffd04b" unique-opened router>
          <el-menu-item v-for="item in items" :index="item.path" :key="item.path">
            <div><i class="el-icon-menu"></i>{{item.name}}</div>
          </el-menu-item>
        </el-menu>
        <!-- <ul class="el-menu collapsed" >
          <li class="el-menu-item" v-for="item in items" :key="item" >
            <div :class="item.icon"><br/>{{item.name}}</div>
          </li>
        </ul> -->
    </el-col>
    <el-col :span="4" class="userinfo">
      <i class="iconfont icon-guanbi" ></i>
    </el-col>
  </el-row>

  <el-row class="outerContainer">
    <section class="content-container">
      <div class="grid-content bg-purple-light">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </section>
  </el-row>
</div>

</template>

<script>
import io from "socket.io-client";
export default {
  data() {
    return {
      sysName: "新松机器人",
      items: [
        // { name: "移动", icon: "el-icon-menu", path: "/ctrl" },
        { name: "编程", icon: "el-icon-menu", path: "/program" },
        // { name: "运行", icon: "el-icon-menu", path: "/run" },
        { name: "状态", icon: "el-icon-menu", path: "/status" },
        { name: "设置", icon: "el-icon-menu", path: "/settings" }
      ]
    };
  },
  mounted() {
    let self = this;
    var socket = io("http://localhost:3000");
    socket.on("message", function(data) {
      console.log(data)
      self.$store.commit("updateState", data);
    });
  }
};
</script>

<style lang="css" scoped>
@import "../../static/iconfont.css";
.main {
  height: 100%;
}
.header {
  height: 70px;
  line-height: 80px;
  background: #324057;
  color: #fff;
}
.logo {
  font-size: 22px;
  text-align: left;
  margin-left: 20px;
}
.logo-icon {
  vertical-align: middle;
}
.menu {
  display: flex;
  bottom: 0;
  height: 100%;
  padding-left: 20px;
  overflow: hidden;
}
.el-menu-item {
  font-size: 16px;
  line-height: 80px;
  height: 70px;
}
/*.collapsed {*/
  /*width: 60px;*/
/*}*/
/*.menu-collapsed {*/
  /*flex: 0 0 60px;*/
  /*width: 60px;*/
/*}*/
.userinfo {
  float: right;
  text-align: right;
  margin-right: 50px;
}
.icon-guanbi {
  cursor: pointer;
  font-size: 30px;
  color: rgb(202, 25, 25);
}
.outerContainer {
  position: absolute;
  top: 70px;
  bottom: 0;
  width: 100%;
  min-height: 100%;
  background: #e5e5e5;
  background-image: url(../assets/bg.svg);
  background-size: cover;
  background-attachment: fixed;
  background-position: center center;
}
.content-container {
  flex: 1;
  position: absolute;
  width: 100%;
  overflow-y: scroll;
  /*padding: 20px;*/
}
  .grid-content {
    height: 100%;
  }
</style>


