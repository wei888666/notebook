<template>
  <div :style="`margin-bottom:${states.componentSpace}`"
       class="brochure">
    <div class="title"
         v-if="states.componentName">{{states.componentName}}</div>
    <div class="box-flex">
      <el-image ref="bannerHeight"
                v-for="item of states.topicImages"
                :key="item.id"
                :src="item.imgHost+item.imagePath"
                fit="fill"></el-image>
    </div>
  </div>
</template>

<script>
export default {
  props: ['states'],
  name: "HomeBrochure",

}
</script>

<style lang="scss" scoped>
.brochure {
  .title {
    font-size: 14px;
    color: #222222;
    font-weight: 600;
    padding-left: 12px;
    padding-bottom: 12px;
  }
  .box-flex {
    display: flex;
  }
}
</style>