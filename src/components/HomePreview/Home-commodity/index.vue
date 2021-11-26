<template>
  <!--商品专题 -->
  <div :class="states.topicImages.length>0?'components-home-box':'components-home-box-none'"
       class="commodity"
       :style="`margin-bottom:${states.componentSpace}`">
    <div class="title"
         v-if="states.componentName">{{states.componentName}}</div>
    <span v-for="item of states.topicImages"
          :key="item.id">
      <el-image v-if="item.imgHost"
                :src="item.imgHost+item.imagePath"
                style="width: 100%">
      </el-image>
    </span>
    <div :class="states.topicImages.length>0?'boxs':'noneBox'">
      <div class="card"
           v-for="(item,index) of arr"
           :key="index">
        <el-image class="img"
                  :src="item.imgHost+item.backImageUrl"></el-image>
        <div style="margin: 6px 0;">
          <div class="di-text ellipsis">{{item.productEnName}}</div>
          <div class="mon-text">$ {{item.minSalePrice}}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: ['states'],
  name: "HomeCommodity",
  data () {
    return {
      arr: [],
      bannerHeight: ""
    }
  },
  watch: {
    states: {
      handler (newValue) {
        if (newValue.productGroup != '') {
          this.init(newValue.productGroup)
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    init (val) {
      this.$ajax({
        method: 'POST',
        url: '/product/catena/getSpuListPageByCatenaId',
        data: {
          "catenaLinke": val
        }
      }).then(ret => {
        if (ret.code == 0 && ret.data && ret.data.length > 0) {
          this.arr = ret.data.slice(0, 20)
        }
      }).catch(err => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.components-home-box {
  overflow-x: auto;
  height: 326px;
  position: relative;
}
.components-home-box-none {
  overflow-x: auto;
  height: 217px;
  position: relative;
}
.commodity {
  .title {
    font-size: 14px;
    color: #222222;
    font-weight: 600;
    padding-left: 12px;
    padding-bottom: 12px;
  }
  .noneBox {
    position: absolute;
    top: 0px;
    right: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 217px;
    white-space: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .boxs {
    position: absolute;
    top: 105px;
    right: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 217px;
    white-space: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .card {
    width: 115px;
    margin: 4px;
    display: inline-block;
  }
  .mon-text {
    color: red;
    font-size: 14px;
    padding-top: 6px;
  }
  .image {
    width: 100%;
    height: 100%;
  }

  .di-text {
    font-size: 12px;
  }
  .img {
    width: 100%;
    height: 140px;
  }
}
</style>
