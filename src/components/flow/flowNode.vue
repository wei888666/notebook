<template>
  <div class="word-flow-node node-item"
       ref="node"
       :style="flowNodeContainer"
       @mouseenter="showDelete"
       @mouseleave="hideDelete"
       @mouseup="changeNodeSite"
       @click.stop="editNode">
    <!-- <div class="node-titel">
      <div class="node-icon" v-show="mouseEnter">
        <i class="el-icon-delete" @@click.stop="deleteNode"></i>
      </div>
    </div> -->
    <div class="node-con">
      <svg aria-hidden="true"
           class="icon svg-icon icon-aboust">
        <use :xlink:href="iconClass"></use>
      </svg>
      <span v-if="node.componentType !== 3 && node.componentType !== 4">{{node.label}}</span>
      <span v-if="node.componentType==3">
        <span v-if="node && node.triggerType==1">
          {{(node?'触发时间：' + (node.delayTime?node.delayTime:''):node.label)+( node.delayTimeUnit==0?'分钟后':(node.delayTimeUnit==1?'小时后':(node.delayTimeUnit==2?'天后':(node.delayTimeUnit==3?'周后':(node.delayTimeUnit==4?'月后':'')))))}}</span>
        <span v-else-if="node && node.triggerType==2">
          {{`触发时间：${node.fixedTimeZone || node.fixedTimeZone == 0?'UTC '+ timeTypeA(node.fixedTimeZone)+':00':''}${node.fixedTimeHour?','+timeTypeB(node.fixedTimeHour):''}${node.fixedTimeMinute?':'+timeTypeB(node.fixedTimeMinute):(node.fixedTimeMinute==0?':00':'')} ${node.fixedTimeType==0?'AM':(node.fixedTimeType==1?'PM':'')}`}}
        </span>
        <span v-else>
          {{node.label}}
        </span>
      </span>
      <span v-if="node.componentType==4"
            class="temp-title">
        {{node.emailTheme?node.emailTheme:node.label}}
      </span>
      <div v-if="node.componentType==4"
           class="temp-text">
        {{tempReplace(node.emailTemplate?node.emailTemplate:'')}}
      </div>
    </div>
    <div class="node-del"
         v-show="mouseEnter && pageType != 3 && node.Type != 1"
         @click.stop="deleteNode">
      <i class="el-icon-delete"></i>
    </div>
    <!--连线用--//触发连线的区域-->
    <div class="flow-node-drag"
         v-show="isconnect"></div>
  </div>
</template>

<script>
export default {
  props: {
    node: Object,
    isconnect: Boolean,
    pageType: String
  },
  name: 'FlowNode',
  data () {
    return {
      mouseEnter: false
    }
  },
  computed: {
    /** 节点容器样式 */
    flowNodeContainer: {
      get () {
        return {
          position: 'absolute',
          width: '290px',
          top: this.node.top,
          left: this.node.left,
          padding: '0 25px',
          boxShadow: this.mouseEnter ? '#66A6E0 0 0 12px 0' : ''
        }
      }
    },
    iconClass () {
      if (this.node.componentType == 1) {
        return '#icon-start-ruan'
      } else if (this.node.componentType == 2) {
        return '#icon-over'
      } else if (this.node.componentType == 3) {
        return '#icon-time'
      } else if (this.node.componentType == 4) {
        return '#icon-email'
      }
    }
  },
  methods: {
    tempReplace (str) {
      if (str) {
        str = str.replace(/<[^<>]*>/ig, '')
      }
      return str
    },

    timeTypeA (h) {
      if (h >= 0) {
        h = /^\d$/.test(h) ? '+0' + h : '+' + h
      }
      return h
    },
    timeTypeB (h) {
      h = /^\d$/.test(h) ? '0' + h : h
      return h
    },
    /** 删除节点 */
    deleteNode () {
      this.$emit('delete-node', this.node)
    },
    /** 编辑节点 */
    editNode () {
      this.$emit('edit-node', this.node.id)
    },
    /** 鼠标进入 */
    showDelete () {
      this.mouseEnter = true
    },
    /** 鼠标离开 */
    hideDelete () {
      this.mouseEnter = false
    },
    /** 鼠标移动后抬起 */
    changeNodeSite () {
      this.$emit('changeNodeSite', {
        nodeId: this.node.id,
        left: this.$refs.node.style.left,
        top: this.$refs.node.style.top
      })
    }
  }
}
</script>
<style lang="scss">
.word-flow-node {
  &.node-item {
    padding: 0 25px 0 30px !important;
    overflow: initial;
    background: #fbf4dc;
    border-radius: 4px;
    box-shadow: 0 0 2px #696969;
    cursor: move;
  }
  .node-titel {
    height: 20px;
    background: #ffc400;
  }
  .node-icon {
    position: absolute;
    top: 0;
    right: 0;
    line-height: 20px;
  }
  .node-icon i {
    cursor: pointer;
  }
  .node-con {
    text-align: left;
    line-height: 30px;
    font-size: 13px;
    color: #222;
    font-weight: bold;
    .temp-title {
      overflow: hidden;
      display: block;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      text-align: left;
      font-weight: bold;
    }
    .temp-text {
      margin-bottom: 5px;
      font-size: 12px;
      color: #666;
      font-weight: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      text-align: left;
      line-height: 16px;
    }
  }
  .icon-aboust {
    position: absolute;
    top: 4px;
    left: 4px;
    font-size: 16px;
    color: #827777;
    cursor: pointer;
  }
  .node-del {
    position: absolute;
    top: 6px;
    right: 4px;
    font-size: 16px;
    color: #827777;
    cursor: pointer;
  }
  .flow-node-drag {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: crosshair;
  }
}
</style>