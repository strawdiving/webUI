<template>
  <div class="innerContainer">
    <el-col :span="12">
      <div class="row">
        <!-- <span></span>
        <input type="text" v-number-only v-model.lazy="oldNum"/> -->
        <div v-for="(o, index) in tags" :key="index" class="param-item">
          <span class="item-text">{{o}}</span>
          <input type="text" v-number-only class="item-input" v-model.number="params[index]"/>
          <!-- <input type="text"/> -->
        </div>

        <div class="desc-item">
          <span class="desc-tag">备注</span>
          <el-input class="desc" type="textarea" :rows="2" placeholder="可输入备注信息" v-model="desc" resize="none"></el-input>
        </div>
      </div>

      <div class="button-group">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">设定用户坐标</el-button>
        <el-button @click="addNew">保存</el-button>
        <el-button @click="load">加载用户坐标</el-button>
      </div>
    </el-col>

    <el-col :span="12">
      <transition name="fade">
        <div class="list-area" v-if="showList">
          <!-- <h4>使用记录</h4> -->
          <table class="list-table">
            <caption>保存的参数</caption>
            <tr>
              <th>#</th>
              <th>参数</th>
              <th>备注</th>
            </tr>
            <tr v-for="(o,index) in coords" :key="index" class="list-item" :class="index===selectIndex?'selected':''" @click="select(index)">
              <td class="tag"> {{index + 1}}. </td>
              <td> {{o.param}} </td>
              <td class="list-desc"> {{o.desc}} </td>
            </tr>
          </table>

          <!-- <div v-for="(o,index) in coords" :key="index" class="list-item">
            <span class="tag">{{index + 1}}. </span>
            <span>{{o.param}}</span>
            <span class="备注">{{o.desc}}</span>
          </div> -->
        </div>
      </transition>
    </el-col>
  </div>
</template>

<script>
import {getUserCoords, addUserCoord, updateUserCoord, deleteUserCoord} from '@/api/index'
export default {
  data(){
    return {
      showList: false,
      coords: [],
      tags: ['X(mm)', 'Y(mm)', 'Z(mm)', 'RX(rad)', 'RY(rad)', 'RZ(rad)'],
      params: [0,0,0,0,0,0],
      //备注
      desc: '',
      selectIndex: -1,
    }
  },
  computed: {

  },
  methods: {
    cancel(){

    },
    load(){
      getUserCoords().then((res) => {
        this.coords = res.data.coords;
        if (this.coords == null || this.coords.length === 0) {
          this.$message('没有保存的坐标系');
          return
        }
        this.showList = !this.showList
      }).catch((err) => {
        this.$message('无法获取');
        console.log(err)
      })
    },
    addNew() {
      let p = {
        desc: this.desc,
        param: this.params
      };
      addUserCoord(p).then((res) => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      }).catch((err) => {
        console.log(err);
        this.$message({
          message: '保存失败',
          type: 'warning'
        })
      })
    },
    confirm(){
      this.addNew()
    },
    select(val) {
      this.selectIndex = val
    },
  }
}
</script>

<style scoped>
.innerContainer {
  width: 90%;
  margin: auto;
}
.param-item {
  width: 500px;
  height: 50px;
  text-align: left;
}
.param-item span {
  width: 80px;
  height: 50px;
  display: inline-block;
}
.item-input {
  width: 200px;
  margin-left: 80px;
  display: inline-block;
}
.desc-item {
  width:500px;
  height: 90px;
  text-align: left;
  margin-top: 10px;
}
.desc-item span {
  width: 80px;
  display: inline-block;
  vertical-align: top;
}
.desc {
  width: 200px;
  margin-left: 80px;
}
.button-group {
  width: 500px;
}
.list-area {
  width: 360px;
  height: 300px;
  padding: 12px 10px 20px 10px;
  background-color: white;
  overflow: auto;
}
.list-item {
  height: 40px;
  text-align: left;
}
.list-item .list-desc {
  width: 100px;
}
.list-item .tag{
  width: 20px;
}
.list-item:hover {
  background-color: #c0c4cc;
  cursor: pointer;
}
.list-item:active {
  background-color: #65acf3;
}
.selected {
  background-color: #65acf3;
}
</style>
