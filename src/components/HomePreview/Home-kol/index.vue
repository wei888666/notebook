<template>
  <div class="kol-box"
       :style="`margin-bottom:${states.componentSpace}`">
    <div class="kol-box-title"
         v-if="states.componentName">{{states.componentName}}</div>
    <div class="kol-box-img">
      <div class="kol-box-item"
           v-for="(item,index) of imgArr"
           :key="index">
        <div class="item-relative">
          <el-image class="item-img"
                    :src="item.materials?item.materials[0].materialUrl:''"
                    fit="fill"></el-image>
          <div class="item-absolute">
            <div class="text">{{item.kolProduct.name?"@"+item.kolProduct.name:''}}</div>
            <span class="item-text-title">
              {{item.kolProduct.kolComment}}
            </span>
            <a href="javascript:;"
               class="btn shop-icon">
              <svg aria-hidden="true"
                   class="icon svg-icon">
                <use xlink:href="#icon-add-shoppingbag-normal"></use>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['states'],
  name: "HomeKol",
  data () {
    return {
      imgArr: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.$ajax({
        method: 'POST',
        url: `/kol/product/queryKolComponentList`
      }).then((res) => {
        this.imgArr = res.data
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },

  },
}
</script>

<style lang="scss" scoped>
.kol-box {
  overflow: hidden;
  .kol-box-title {
    font-size: 14px;
    color: #222222;
    font-weight: 600;
    padding-left: 12px;
    padding-bottom: 12px;
  }
  .kol-box-img {
    display: inline-flex;
    .kol-box-item {
      display: inline-block;
      width: 270px;
      .item-relative {
        position: relative;

        margin-right: 4px;
        .item-img {
          width: 100%;
          margin-right: 4px;
          height: 360px;
        }
        .item-img:last-child {
          margin-right: 0;
        }
        .item-absolute {
          position: absolute;
          bottom: 4px;
          left: 0;
          height: 75px;
          width: 100%;
          padding: 0 12px;
          .text {
            font-size: 16px;
            font-weight: bold;
            color: #ffffff;
            line-height: 16px;
            padding-bottom: 8px;
          }
          .item-text {
            padding: 6px 4px 0 12px;
            display: flex;
            white-space: pre-wrap;
            overflow: hidden;
          }
          .item-text-title {
            width: 80%;
            line-height: 14px;
            font-size: 10px;
            color: #ffffff;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
          }
          .shop-icon {
            position: absolute;
            width: 43px;
            height: 43px;
            padding: 10px;
            border-radius: 25px;
            right: 16px;
            bottom: 16px;
          }
          .btn {
            background: #ffffff;
            .svg-icon {
              fill: currentColor;
              overflow: hidden;
              width: 24px;
              height: 24px;
              background: #ffffff;
            }
          }
        }
      }
    }
  }
  /* 滚动条美化*/
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-track {
    border-radius: 0px;
    background: none;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
    background-color: rgba(255, 255, 255, 0.75);
  }
  ::-webkit-scrollbar-thumb:hover {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
    background-color: rgba(85, 85, 85, 0.4);
  }
}
</style>
