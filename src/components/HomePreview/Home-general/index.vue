<template>
  <!-- 常规专题 -->
  <div :style="`margin-bottom:${states.componentSpace}`"
       class="general-box">
    <div class="title"
         v-if="states.componentName">{{states.componentName}}</div>
    <!-- states.componentWidthType==1  盒宽 -->
    <div :class="states.componentWidthType==1?'box-width-show':''">
      <div class="width-50"
           v-for="(item,index) of states.topicImages"
           :key="index">
        <el-image class="size"
                  :src="item.imgHost+item.imagePath"
                  fit="fill"></el-image>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: ['states']
}
</script>

<style lang="scss" scoped>
.general-box {
  .title {
    font-size: 14px;
    color: #222222;
    font-weight: 600;
    padding-left: 12px;
    padding-bottom: 12px;
  }
  .width-50 {
    display: inline-block;
    width: calc(50% - 2px);
  }
  .width-50:nth-child(2n + 1) {
    margin-right: 4px;
  }
  .size {
    width: 100%;
    height: 100%;
  }
  .box-width-show {
    margin: 0 12px 0 12px;
  }
}
</style>