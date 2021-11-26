<template>
  <div>
    <div class="word-search-components">
      <div class="search-tab"
           :class="{'search-no-seek': !seekHtmlType}">
        <div class="button-content">
          <slot name="button"></slot>
        </div>
        <div class="filtrate"
             @click="autoFn"
             v-if="showScreen">
          <svg aria-hidden="true"
               class="icon svg-icon">
            <use xlink:href="#icon-filtrate"></use>
          </svg>
          筛选
        </div>
      </div>
      <div class="search-content"
           :class="{'search-content-s': seekContentType}"
           v-show="autoType || seekContentType">
        <slot></slot>
        <div class="search-button"
             v-if="!seekContentType">
          <a class="unfold"
             href="javascript:;"
             @click="autoFn">
            <span>收起更多</span>
            <svg aria-hidden="true"
                 class="icon svg-icon">
              <use xlink:href="#icon-go-top"></use>
            </svg>
          </a>
          <el-button class="seek"
                     @click="resetFn">重置</el-button>
          <el-button class="seek"
                     type="primary"
                     icon="el-icon-search"
                     @click="seekFn">搜索</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 全局搜索组件
 * @clickSeekFn 表示点击搜索的回调方法
 * @clickResetFn 重置的回调触发方法
 * @alterHeight 搜索模块调整修改表格高度，调整表格属性 :max-height="height"
 * 
 * parentHeightType 判断是否需要做高度计算，默认是 false 表示需要
 * seekHtmlType 判断是否有搜索内容，如果没有，则不显示筛选值，默认为 true 表示都有搜索值
 * seekContentType 判断是否搜索内容优质，默认直接展开，默认为 false 表示不直接展开，纯文本展示，可以是给文本内容添加 class == text-content
 * 
 * ------ 方法回调回将高度传递过来，然后跳转父元素定义的表格高度变量 height 即可实现随着页面等高 ------
 * 调用实例：
 * <search @clickSeekFn="seekFn" @clickResetFn="clickResetFn">
     <template slot="button">存放按钮内容</template>
     <template>
       存放搜索的值，el-form 需要使用 label-position="top"
     </template>
 * </srarch>
 */
export default {
  props: {
    parentHeightType: {
      type: Boolean,
      default: false
    },
    seekHtmlType: {
      type: Boolean,
      default: true
    },
    seekContentType: {
      type: Boolean,
      default: false
    },
    showScreen: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      tableBoxTop: 0, /** 表格到顶部的高度 */
      autoType: false
    }
  },
  methods: {
    /** 调用搜索的方法 */
    seekFn () {
      this.$emit('clickSeekFn');
    },
    /** 调用重置的方法 */
    resetFn () {
      this.$emit('clickResetFn');
    },
    /** 调整表格的高度 */
    async callCalculateTableHeight () {
      let tableHeight = await this.calculateTableHeight()
      this.$emit('alterHeight', tableHeight)
    },
    autoFn () {
      this.autoType = !this.autoType
      this.$emit('alterHeight', 400)
      if (!this.parentHeightType) {
        setTimeout(() => { this.callCalculateTableHeight() })
      }
    }
  },
  created () {
    this.$nextTick(function () {
      if (!this.parentHeightType) {
        this.callCalculateTableHeight()
      }
    })
  }
}
</script>

<style lang="scss">
.word-search-components {
  .upload-demo,
  .el-dropdown {
    margin: 4px;
  }
  .el-button--mini {
    padding: 8px 15px;
  }
  .search-content {
    .text-content {
      font-size: 14px;
      color: #333;
    }
    .el-form::after {
      content: "";
      float: left;
      width: 270px;
      height: 58px;
    }
    &.search-content-s .el-form::after {
      height: 0;
    }
    .el-form-item {
      margin: 8px;
      float: left;
      width: 100%;
      max-width: 254px;
    }
    .el-input,
    .el-cascader,
    .el-select,
    .el-input__inner {
      width: 100%;
    }
    .el-input--mini .el-input__inner,
    .el-input__inner {
      height: 32px !important;
      line-height: 32px !important;
    }
    .el-form-item--mini .el-form-item__label {
      margin-bottom: 4px;
      padding: 0;
      height: 22px;
      line-height: 22px;
      font-size: 14px;
      color: #666;
    }
    .el-cascader__tags .el-tag {
      max-width: 100px;
    }
  }
}
</style>

<style lang="scss" scoped>
.word-search-components {
  border-bottom: #f5f5f5 solid 15px;
  .search-tab {
    padding-right: 100px;
    position: relative;
    min-height: 42px;
    .button-content {
      padding: 2px 20px;
      overflow: hidden;
      & > * {
        margin: 4px;
      }
    }
    .filtrate {
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      display: flex;
      display: -webkit-flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 16px;
      color: #666;
      background: #fff;
      border-left: #e8e8e8 solid 1px;
      cursor: pointer;
      .icon {
        margin-right: 6px;
        width: 18px;
        height: 18px;
      }
    }
    &.search-no-seek {
      padding-right: 0;
      .filtrate {
        display: none;
      }
    }
  }
  .search-content {
    padding: 8px 16px;
    position: relative;
    overflow: hidden;
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      right: 99px;
      content: "";
      height: 1px;
      background: #e8e8e8;
    }
    &.search-content-s::before {
      right: 0;
    }
    .search-button {
      position: absolute;
      right: 24px;
      bottom: 16px;
      z-index: 2;
    }
    .unfold {
      margin-right: 8px;
      display: inline-block;
      line-height: 32px;
      font-size: 14px;
      color: #666;
      .icon {
        position: relative;
        top: 6px;
        width: 24px;
        height: 24px;
      }
    }
    .seek {
      margin-left: 8px;
    }
  }
}
</style>
