

<template>
  <!-- FD商品 -->
  <div :style="`margin-bottom:${states.componentSpace}`"
       class="fd-box">
    <div class="flex">
      <div class="flex-1 title">{{setData.activityEnName}}</div>
      <div class="flex-1 li-hight">Start at
        <span class="dsp">0</span>
        <span class="dsp">0</span>:
        <span class="dsp">0</span>
        <span class="dsp">0</span>:
        <span class="dsp">0</span>
        <span class="dsp">0</span>

      </div>
    </div>
    <div>
      <div class="boxs"
           v-if="arr.length>0">
        <div class="card"
             v-for="(item,index) of arr"
             :key="index">
          <el-image style="width: 100%; height: 100%"
                    :src="setData.imgHost+item.imageUrl"
                    fit="fill"></el-image>
          <div style="padding: 2px;">
            <span class="mon-text">$ {{item.activityPrice}}</span>
            <span class="del">$ {{item.salePrice}}</span>
          </div>
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
      setData: {},
      arr: []
    }
  },
  mounted () {
    this.init()

  },
  methods: {
    init () {
      this.$ajax({
        method: 'GET',
        url: '/flashdeals/getValidFlash'
      }).then(ret => {
        if (ret.code == 0) {
          this.setData = ret.data || {}
          if (this.setData.page.records != []) {
            this.arr = this.setData.page.records || []
          }
        }
      }).catch(err => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fd-box {
  .flex {
    display: flex;
  }
  .flex-1 {
    flex: 1;
  }
  .li-hight {
    line-height: 32px;
    font-size: 12px;
  }
  .boxs {
    width: 100%;
    height: 144px;
    white-space: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .title {
    font-size: 14px;
    color: #f11135;
    font-weight: 600;
    padding: 8px;
  }
  .card {
    width: 75px;
    height: 100px;
    margin: 6px;
    display: inline-block;
  }
  .mon-text {
    color: red;
    font-size: 12px;
  }
  .image {
    width: 100%;
    height: 100%;
  }
  .del {
    text-decoration: line-through;
    font-size: 10px;
    padding-left: 2px;
  }

  .dsp {
    display: inline-block;
    width: 12px;
    height: 20px;
    background: #fc5959;
    color: #fff;
    line-height: 20px;
    text-align: center;
    font-weight: 800;
    margin-right: 2px;
  }
}
</style>