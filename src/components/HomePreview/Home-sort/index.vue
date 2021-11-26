<template>
  <!-- 场景专题 -->
  <div class="box-sort"
       :style="`margin-bottom:${states.componentSpace}`">
    <div class="title"
         v-if="states.componentName">{{states.componentName}}</div>
    <div class="flast-left sort-box-width-left">
      <el-image class="size"
                :src="leftUrl"
                fit="fill"></el-image>
    </div>
    <div class="flast-left sort-box-width-right">
      <div class="top">
        <el-image class="size"
                  :src="rightTopUrl"
                  fit="fill"></el-image>
      </div>
      <div class="botton">
        <el-image class="size"
                  :src="rightBtmUrl"
                  fit="fill"></el-image>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['states'],
  name: 'HomeSort',
  data () {
    return {
      leftUrl: '',
      rightTopUrl: '',
      rightBtmUrl: ''
    }
  },
  watch: {
    states: {
      handler (newValue) {
        if (newValue.topicImages) {
          this.init()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    init () {
      var data = this.states.topicImages
      data.map((item) => {
        if (item.sort == 0) {
          this.leftUrl = item.imgHost + item.imagePath
        }
        if (item.sort == 1) {
          this.rightTopUrl = item.imgHost + item.imagePath
        }
        if (item.sort == 2) {
          this.rightBtmUrl = item.imgHost + item.imagePath
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.box-sort {
  overflow: hidden;
  display: block;
  .title {
    font-size: 14px;
    color: #222222;
    font-weight: 600;
    padding-left: 12px;
    padding-bottom: 12px;
  }
  .flast-left {
    float: left;
  }
  .sort-box-width-left {
    width: 148px;
    margin-right: 4px;
  }
  .sort-box-width-right {
    width: 148px;
    .top {
      height: 49%;
      margin-bottom: 2px;
    }
    .botton {
      height: 49%;
    }
  }
  .size {
    width: 100%;
    height: 100%;
    margin: -1px;
  }
}
</style>