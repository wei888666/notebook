<template>
  <div :style="`margin-bottom:${states.componentSpace}`"
       class="topbar">
    <div class="title"
         v-if="states.componentName">{{states.componentName}}</div>
    <el-carousel height="26px"
                 class="top-bar-hight "
                 indicator-position='none'
                 arrow="never"
                 :style="`background:${data.backgroundColor};color:${data.fontColor}`">
      <el-carousel-item v-for="item of data.scrollingList"
                        :key="item.id">
        <img :src="item.imgHost+item.imagePath"
             class="img-size"
             v-if="item.imagePath">
        <span class="top-bar-text ellipsis">
          {{item.imageTitle}}
        </span>
      </el-carousel-item>
    </el-carousel>
  </div>

</template>

<script>
export default {
  props: ['states'],
  name: "HomeTopBar",
  data: function () {
    return {
      data: {}
    };
  },
  watch: {
    states: {
      handler (newValue) {
        this.data = newValue
      },
      immediate: true,
      deep: true
    }
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
.topbar {
  .top-bar-hight {
    line-height: 30px;
    font-size: 14px;
    text-align: center;
  }
  .img-size {
    width: 11px;
    height: 11px;
    line-height: 26px;
    margin: 8px 4px;
  }
  .top-bar-text {
    display: inline-block;
    overflow-y: hidden;
    height: 26px;
    line-height: 26px;
    font-size: 11px;
    max-width: 86%;
  }
  .title {
    font-size: 14px;
    color: #222222;
    font-weight: 600;
    padding-left: 12px;
    padding-bottom: 12px;
  }
}
</style>