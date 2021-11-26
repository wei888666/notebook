<template>
  <!-- 分类导航 -->
  <div class="components-home-box"
       :style="`margin-bottom:${states.componentSpace}`">
    <div class="title"
         v-if="states.componentName">{{states.componentName}}</div>
    <div v-for="(item,index) of states.topicImages"
         :key="index"
         class="scene-box">
      <el-avatar :size="50"
                 indicator-position='none'
                 arrow="never"
                 :src="item.imgHost+item.imagePath"></el-avatar>
      <div class="title-text">{{item.imageTitle}}</div>
    </div>
  </div>

</template>

<script>
export default {
  props: ['states']
}
</script>

<style lang="scss" scoped>
.components-home-box {
  .title {
    font-size: 14px;
    color: #222222;
    font-weight: 600;
    padding-left: 12px;
    padding-bottom: 12px;
  }
  .scene-box {
    width: 50px;
    // margin-bottom: 16px;
    display: inline-block;
    text-align: center;
    margin-left: 20px;
    .title-text {
      padding-top: 7px;
      height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-size: 10px;
      font-weight: 600;
      color: #333333;
    }
  }
}
</style>