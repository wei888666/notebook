<template>
  <!-- 新老客权益 -->
  <div :style="`margin-bottom:${states.componentSpace}`"
       class="equity-box">
    <div class="title"
         v-if="states.componentName">{{states.componentName}}</div>
    <el-carousel :height="bannerHeight+'px'"
                 indicator-position='none'
                 arrow="never">
      <el-carousel-item v-for="item of states.topicImages"
                        :key="item.id">
        <img ref="bannerHeight"
             :src="item.imgHost+item.imagePath"
             alt=""
             @load="imgLoad"
             style="width: 100%">
      </el-carousel-item>
    </el-carousel>
  </div>

</template>

<script>
export default {
  props: ['states'],
  name: 'HomeEquity',
  data () {
    return {
      bannerHeight: "",
    };
  },

  mounted () {
    this.imgLoad();
    window.addEventListener('resize', () => {
      this.bannerHeight = this.$refs.bannerHeight[0]?.height;
      this.imgLoad();
    }, false)
  },
  methods: {
    imgLoad () {
      this.$nextTick(() => {
        this.bannerHeight = this.$refs.bannerHeight[0]?.height;
      })
    }
  },
  beforeDestroy () {
    this.imgLoad()
  }
}
</script>

<style lang="scss" scoped>
.equity-box {
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
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