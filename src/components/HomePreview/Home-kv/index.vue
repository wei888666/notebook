<template>
  <!-- KV -->
  <!-- <el-carousel :height="bannerHeight+'px'"
               :style="`margin-bottom:${states.componentSpace}`"
               arrow="never"
               :indicator-position="states.topicImages.length<=1?'none':''">
    <el-carousel-item v-for="item of states.topicImages"
                      :key="item.id">
      <img ref="bannerHeight"
           :src="item.imgHost+item.imagePath"
           alt=""
           @load="imgLoad"
           style="width: 100%">
    </el-carousel-item>
  </el-carousel> -->
  <div :style="`margin-bottom:${states.componentSpace}`">
    <el-image :src="states.topicImages[0].imgHost+states.topicImages[0].imagePath"
              style="width: 100%"></el-image>
  </div>
</template>

<script>
export default {
  props: ['states'],
  name: "HomeKv",
  data () {
    return {
      // bannerHeight: "",
    };
  },

  // mounted () {
  //   this.imgLoad();
  //   window.addEventListener('resize', () => {
  //     this.bannerHeight = this.$refs.bannerHeight[0]?.height;
  //     this.imgLoad();
  //   }, false)
  // },
  // methods: {
  //   imgLoad () {
  //     this.$nextTick(() => {
  //       this.bannerHeight = this.$refs.bannerHeight[0]?.height;
  //     })
  //   }
  // },
  // beforeDestroy () {
  //   this.imgLoad()
  // }
}
</script>

<style lang="scss" scoped>
</style>