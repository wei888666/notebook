<template>
  <div :style="`margin-bottom:${states.componentSpace}`">
    <div class="title"
         v-if="states.componentName">{{states.componentName}}</div>
    <el-image ref="bannerHeight"
              :src="states.topicImages[0].imgHost+states.topicImages[0].imagePath"
              style="width: 100%"></el-image>
  </div>
</template>

<script>
export default {
  props: ['states'],
  name: "HomeBanner"
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 14px;
  color: #222222;
  font-weight: 600;
  padding-left: 12px;
  padding-bottom: 12px;
}
</style>
