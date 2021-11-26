<template>
  <!-- 商品推荐 -->
  <div :style="`margin-bottom:${states.componentSpace}`"
       class="ref-box">
    <div class="title"
         v-if="states.componentName">{{states.componentName}}</div>
    <div class="box-padding">
      <div class="card"
           v-for="(item,index) of arr"
           :key="index">
        <div style="margin:0;padding:0">
          <el-image :src="item.imgHost+item.whiteImageUrl"
                    fit="fill"
                    style="width:132px;height:176px">
            <div slot="placeholder"
                 class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </div>
        <div style="padding-top:4px">
          <div class="di-text ellipsis">{{item.productEnName}}</div>
          <div class="mon-text"> US$ {{item.minSalePrice}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['states'],
  data () {
    return {
      arr: []
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
.ref-box {
  .title {
    font-size: 14px;
    color: #222222;
    font-weight: 600;
    padding-left: 12px;
    padding-bottom: 12px;
  }
  .box-padding {
    padding: 0 6px;
    .card {
      width: 132px;
      margin: 0 6px;

      margin-bottom: 28px;
      display: inline-block;
      .di-text {
        font-size: 12px;
        -webkit-transform: scale(0.84);
        padding-right: 6px;
      }
      .mon-text {
        padding-top: 4px;
        font-size: 12px;
        -webkit-transform: scale(0.84);
        color: red;
      }
    }
  }
}
</style>