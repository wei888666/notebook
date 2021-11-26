<template>
  <div class="app-container  word-table-module">
    <search @alterHeight="(h) => { tableHeight = h }"
            :seekHtmlType='false'>
      <template slot="button">
        <div>
          <div v-if="editTitle"
               style="display: inline-block;">
            <!-- <el-tag size="medium"
                effect="plain"
                style="margin-right:10px;cursor:pointer"
                @click="editTitle = false"></el-tag> -->
            <span style="font-size: 20px;font-weight: 700;"
                  @click="editTitle = false"> {{confirmForm.emailName}}</span>
            <a class="btn"
               href="javascript:;"
               title="修改名称"
               @click="editTitle = false">
              <svg aria-hidden="true"
                   class="icon svg-icon">
                <use xlink:href="#icon-edit"></use>
              </svg>
            </a>

          </div>
          <div v-else
               style="display: inline-block;">
            <el-input v-model="confirmForm.emailName"
                      style="width:120px;margin-right:10px;"
                      maxlength="50"
                      placeholder="请输入角色名称"></el-input>
            <el-button @click="editTitle = true"
                       type="primary">确定</el-button>
          </div>

          <el-button class="right"
                     type="primary"
                     @click="handleEmail"
                     v-if="ifPageButtonType('buttomEmailConfigOpen')">开启邮件流</el-button>
          <el-button class="right"
                     style="margin-right:10px"
                     @click="handleCloseEmail"
                     v-if="ifPageButtonType('buttomEmailConfigClose')">关闭邮件流</el-button>
          <el-button class="right"
                     style="margin-right:10px"
                     @click="saveData"
                     v-if="ifPageButtonType('buttomEmailConfigUpdate')">保存</el-button>
          <el-button class="right"
                     style="margin-right:10px"
                     @click="closeFn">关闭</el-button>
        </div>
      </template>
    </search>
    <div class="word-flow-main">
      <el-alert :closable="false"
                show-icon
                title="温馨提示：选择“选择”功能，然后双击连线可删除链接线，分支节点操作需要点击保存才能生效~~"
                type="warning"></el-alert>
      <div class="appcontainer">
        <div class="flow-menu"
             v-if="pageType != 3">
          <div class="menu-item"
               v-for="(item, index) in menueList"
               :key="index"
               draggable="true"
               @dragstart="drag(item)">
            <svg aria-hidden="true"
                 class="icon svg-icon">
              <use :xlink:href="'#icon-'+item.icon"></use>
            </svg>
            <div>{{item.name}}</div>
          </div>
          <hr>
          <div class="menu-item"
               @click="isConnect=true">
            <i class="el-icon-share"></i>
            <div>连线</div>
          </div>
          <div class="menu-item"
               @click="isConnect=false">
            <i class="el-icon-rank"></i>
            <div>选择</div>
          </div>
        </div>
        <div class="flow-detail">
          <div id="flowContent"
               ref="flowContent"
               @drop="drop($event)"
               @dragover="allowDrop($event)"
               @click="editFlow()"
               @dblclick="isConnect=false">
            <flowNode v-for="node in data.nodeList"
                      :key="node.id"
                      :pageType="pageType"
                      :node="node"
                      :id="node.id"
                      :data-type="node.Type"
                      :isconnect="isConnect"
                      @delete-node="deleteNode"
                      @changeNodeSite="changeNodeSite"
                      @edit-node="editNode">
            </flowNode>
          </div>
        </div>
        <div class="flow-edit">
          <div class="flow-edit-content">
            <!-- <edit-flow ref="flowEdit"
                     v-show="editType=='flow'"
                     :pageType="pageType"></edit-flow> -->
            <edit-node ref="nodeForm"
                       :pageType="pageType"
                       @confirmSucceed="nodeConfirmSucceed"></edit-node>
            <edit-line ref="lineForm"
                       v-show="editType=='line'"
                       :pageType="pageType"
                       @line-save="lineLabelSave"></edit-line>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * pageType 表示页面的状态，1 是新增 2是拷贝 3是查看
 */
import { jsPlumb } from 'jsplumb'
import flowNode from './flowNode.vue'
import editFlow from './editFlow.vue'
import editNode from './editNode.vue'
import editLine from './editLine.vue'
export default {
  name: 'FlowMain',
  props: {
    pageType: {
      type: String,
      default: 1
    }
  },
  data () {
    return {
      routeName: this.$route.name,
      confirmForm: {
        emailName: '流程图',
      },
      editTitle: true,

      saveButType: false, /** 提交按钮的状态 */
      menueList: [
        // {
        //   type: 1,
        //   name: '开始',
        //   label: '开始触发邮件工作流',
        //   icon: 'start-ruan'
        // },
        {
          type: 3,
          name: '时间维度',
          label: '触发时间：XXX',
          icon: 'time'
        },
        {
          type: 4,
          name: '邮件内容',
          label: '邮件标题',
          icon: 'email'
        },
        {
          type: 2,
          name: '结束',
          label: '结束邮件工作流',
          icon: 'over'
        }
      ],
      jsPlumb: null, /** jsPlumb 实例 */
      index: 1,
      /** 默认设置参数 */
      jsplumbSetting: {
        /** 动态锚点、位置自适应 */
        Anchors: ['Top', 'TopCenter', 'TopRight', 'TopLeft', 'Right', 'RightMiddle', 'Bottom', 'BottomCenter',
          'BottomRight', 'BottomLeft', 'Left', 'LeftMiddle', 'Left'
        ],
        Container: 'flowContent',
        /** 连线的样式 StateMachine、Flowchart,有四种默认类型：Bezier（贝塞尔曲线），Straight（直线），Flowchart（流程图），State machine（状态机） */
        Connector: 'Flowchart',
        /** 这个是鼠标拉出来的线的属性 */
        ConnectionOverlays: [
          ["Label", {
            label: "",
            id: "label-1",
            cssClass: "csslabel"
          }]
        ],
        /** 鼠标不能拖动删除线 */
        ConnectionsDetachable: false,
        /** 删除线的时候节点不删除 */
        DeleteEndpointsOnDetach: false,
        /**
         * 连线的端点
         * Endpoint: ["Dot", {radius: 5}],
        */
        Endpoint: ["Rectangle", {
          height: 10,
          width: 10
        }],
        /** 线端点的样式 */
        EndpointStyle: {
          fill: 'rgba(255,255,255,0)',
          outlineWidth: 3
        },
        /** 绘制线 */
        PaintStyle: {
          stroke: '#409eff',
          joinstyle: 'round',
          strokeWidth: 3
        },
        HoverPaintStyle: { stroke: '#1565C0', strokeWidth: 3 },
        /** 绘制箭头 */
        Overlays: [
          ['Arrow', {
            width: 8,
            length: 8,
            location: 1
          }],
        ],
        RenderMode: "svg"
      },
      /** jsplumb连接参数 */
      jsplumbConnectOptions: {
        isSource: true,
        isTarget: true,
        /** 动态锚点、提供了4个方向 Continuous、AutoDefault */
        anchor: "Continuous",
      },
      jsplumbSourceOptions: {
        filter: ".flow-node-drag",  /** 触发连线的区域 */
        /*"span"表示标签，".className"表示类，"#id"表示元素id*/
        filterExclude: false,
        anchor: "Continuous",
        allowLoopback: false
      },
      jsplumbTargetOptions: {
        filter: ".flow-node-drag",
        /*"span"表示标签，".className"表示类，"#id"表示元素id*/
        filterExclude: false,
        anchor: "Continuous",
        allowLoopback: false
      },
      /** 是否加载完毕 */
      loadEasyFlowFinish: false,
      /** 数据 */
      data: {
        flowInfo: {
          Id: this.getUUID(),
          Name: '邮件配置',
          Remark: ''
        },
        nodeList: [],
        lineList: []
      },
      currentItem: '', //临时存添加的元素
      isConnect: false, //判断是否连接
      timer: null, //定时器,判断单双击,
      currentConnect: '', //当前的连接线
      currentLine: '', //当前连接线数据
      editType: '', //编辑的类型
      editNodeId: '', /** 编辑的 nodeId */
      /** 保存值进行元素排序使用 */
      nodeData: {},  /** 获取模块的值 */
      lineData: {},  /** 获取连接线的值 */
      startVal: 0,   /** 定义排序的值 */
      startID: '' /** 开始ID */
    }
  },
  components: {
    flowNode,
    editFlow,
    editNode,
    editLine
  },
  mounted () {
    this.$nextTick(() => {
      if (this.$route.query.id) {
        /** 获取可以编辑的数据 */
        this.$store.dispatch('app/callLoading', { name: this.routeName, type: true })
        this.$ajax({
          method: "POST",
          url: `/emailConfig/detail`,
          data: {
            id: this.$route.query.id
          }
        }).then(ret => {
          this.$store.dispatch('app/callLoading', { name: this.routeName, type: false })
          if (ret.code == 0) {
            this.confirmForm.emailName = ret.data.emailName
            this.confirmForm.id = ret.data.id
            this.jsPlumb = jsPlumb.getInstance()
            let jsonData = JSON.parse(ret.data.processJson)
            if (jsonData) {
              this.data.flowInfo = jsonData.flowInfo || []
              this.data.nodeList = jsonData.nodeList || [{
                Type: 1,
                componentType: 1,
                id: this.getUUID(),
                label: "开始触发邮件工作流",
                left: "41px",
                top: "17px",
                endType: 0
              }]/** 默认加载开始流程 */
              jsonData.lineList.forEach(v => {
                v.label = ''
              })
              this.data.lineList = jsonData.lineList || []
            } else {
              this.data.flowInfo = []
              this.data.nodeList = [{
                Type: 1,
                componentType: 1,
                id: this.getUUID(),
                label: "开始触发邮件工作流",
                left: "41px",
                top: "17px",
                endType: 0
              }]
              this.data.lineList = []
            }
            setTimeout(() => {
              this.init()
            })
            this.editFlow()
          } else if (this.ajaxRetStatusIf(this, ret)) { /** 检测是否登录及端口拦截判断 */
            /** 接口报错弹窗提示 */
            this.$message.error(ret.msg)
          }
        }).catch(err => {
          this.$store.dispatch('app/callLoading', { name: this.routeName, type: false })
          this.$message.error(err.msg)
        })
      } else {
        this.jsPlumb = jsPlumb.getInstance();
        this.init();
        this.editFlow()
      }
    });
  },
  methods: {
    init () {
      const _this = this
      this.jsPlumb.ready(function () {
        /** 导入默认配置 */
        _this.jsPlumb.importDefaults(_this.jsplumbSetting)
        /** 会使整个jsPlumb立即重绘 */
        _this.jsPlumb.setSuspendDrawing(false, true);
        /** 初始化节点 */
        _this.loadEasyFlow()
        /** 单点连接线（编辑label） */
        _this.jsPlumb.bind('click', function (conn, originalEvent) {
          //clearTimeout(this.timer);
          //this.timer = setTimeout(function () { // 这里采用执行自定义事件的方式
          //    console.log("click", conn);
          //    _this.editLine(conn);
          //}, 300); // 延迟300ms执行单击事件,区分双击事件
          //console.log("click", conn);
          _this.editLine(conn);
        })
        /** 双击连接线（删除） */
        _this.jsPlumb.bind('dblclick', function (conn, originalEvent) {
          if (_this.pageType != 3) {
            clearTimeout(this.timer);
            //console.log("dblclick", conn)
            _this.$confirm('确定删除所点击的线吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              _this.jsPlumb.deleteConnection(conn)
              _this.data.nodeList.filter((item) => {
                if (item.id === conn.targetId) {
                  if (item.sort) {
                    return item.sort = null
                  }
                }
              })
            }).catch(() => { })
          }
        })
        /** 连线 */
        _this.jsPlumb.bind("connection", function (evt) {
          //console.log('connection', evt)
          let from = evt.source.id
          let to = evt.target.id
          /** 获取元素的 type */
          let sourceType = evt.source.getAttribute('data-type');
          if (_this.loadEasyFlowFinish) {
            _this.data.lineList.push({
              from: from,
              to: to,
              label: sourceType == 4 ? 1 : 2,
              id: _this.getUUID(),
              Remark: '',
            })
          };
          setTimeout(function () {
            _this.editLine(evt.connection);
          }, 100);
        })
        /** 删除连线 */
        _this.jsPlumb.bind("connectionDetached", function (evt) {
          _this.deleteLine(evt.sourceId, evt.targetId)
        })
        /** 改变线的连接节点 */
        _this.jsPlumb.bind("connectionMoved", function (evt) {
          _this.changeLine(evt.originalSourceId, evt.originalTargetId)
        })
        /** 单击endpoint */
        /* jsPlumb.bind("endpointClick", function (evt) {
          console.log('endpointClick', evt)
        })*/

        /** 双击endpoint */
        /*jsPlumb.bind("endpointDblClick", function (evt) {
          console.log('endpointDblClick', evt)
        }) */

        /** contextmenu 右键 */
        _this.jsPlumb.bind("contextmenu", function (evt) {
          //console.log('contextmenu', evt)
        })
        /** beforeDrop */
        _this.jsPlumb.bind("beforeDrop", function (evt) {
          //console.log('beforeDrop', evt)
          let from = evt.sourceId
          let to = evt.targetId
          /** 判断链接条数，只能链接两条 */
          let six_ = 0
          _this.data.lineList.forEach(n => {
            if (n.from == from) {
              six_++
            }
          });
          if (six_ >= 1) {
            _this.$message.warning('箭头指向只能添加1条')
            return false
          }
          if (from === to) {
            _this.$message.warning('不能连接自己')
            return false
          }
          if (_this.hasLine(from, to)) {
            _this.$message.warning('不能重复连线')
            return false
          }
          /*if (_this.hashOppositeLine(from, to)) {
            _this.$message.error('不能回环哦');
            return false
          }*/
          return true
        })
        // beforeDetach
        _this.jsPlumb.bind("beforeDetach", function (evt) {
          //console.log('beforeDetach', evt)
        })
      })
    },
    /** 加载流程图 */
    loadEasyFlow () {
      /** 初始化节点 */
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i]
        // 设置源点，可以拖出线连接其他节点
        this.jsPlumb.makeSource(node.id, this.jsplumbSourceOptions)
        // // 设置目标点，其他源点拖出的线可以连接该节点
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
        // jsPlumb.addEndpoint(node.id)
        // 设置可拖拽
        // jsPlumb.draggable(node.id, {
        //     containment: 'parent',
        //     grid: [10, 10]
        // })
        this.jsPlumb.draggable(node.id, {
          containment: 'parent'
        })
        // jsPlumb.draggable(node.id)
      }
      /** 初始化连线 */
      for (var i = 0; i < this.data.lineList.length; i++) {
        let line = this.data.lineList[i]
        let connection = this.jsPlumb.connect({
          source: line.from,
          target: line.to,
        }, this.jsplumbConnectOptions);
        connection.getOverlay("label-1").setLabel(line.label); //初始化label
      }
      this.$nextTick(function () {
        this.loadEasyFlowFinish = true
      })
    },
    /** 添加新的节点 */
    addNode (temp) {
      if (temp.Type === 1) {
        if (this.data.nodeList.findIndex(n => n.Type === 1) != -1) {
          this.$message.warning('只允许有一个开始节点')
          return
        }
      }
      if (temp.Type === 2) {
        if (this.data.nodeList.findIndex(n => n.Type === 2) != -1) {
          this.$message.warning('只允许有一个结束节点')
          return
        }
      }
      this.data.nodeList.push(temp)
      this.$nextTick(function () {
        this.jsPlumb.makeSource(temp.id, this.jsplumbSourceOptions)
        this.jsPlumb.makeTarget(temp.id, this.jsplumbTargetOptions)
        this.jsPlumb.draggable(temp.id, {
          containment: 'parent'
        })
      })
    },
    /** 删除线 */
    deleteLine (from, to) {
      this.data.lineList = this.data.lineList.filter(function (line) {
        return line.from !== from && line.to !== to
      })
    },
    /** 改变连线 */
    changeLine (oldFrom, oldTo) {
      this.deleteLine(oldFrom, oldTo)
    },
    /** 改变节点的位置 */
    changeNodeSite (data) {
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i]
        if (node.id === data.nodeId) {
          this.data.nodeList[i].left = data.left
          this.data.nodeList[i].top = data.top
        }
      }
    },
    /** 删除节点 */
    deleteNode (node) {
      this.$confirm('确定要删除节点 【' + node.label + '】 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.data.nodeList.forEach((item, index) => {
          if (item.id === node.id) {
            this.data.nodeList.splice(index, 1);
          }
        })
        this.$nextTick(function () {
          this.jsPlumb.removeAllEndpoints(node.id);
        })
      }).catch(() => { })
      return true
    },
    /** 编辑节点 */
    editNode (nodeId) {
      this.editType = 'node_';
      setTimeout(() => {
        this.editType = 'node';
        this.editNodeId = nodeId;
        this.$nextTick(function () {
          this.$refs.nodeForm.init(this.data, nodeId)
        })
      });
    },
    editLine (conn) {
      var _this = this;
      _this.currentConnect = conn;
      _this.data.lineList.forEach(function (item, index) {
        if (item.from == conn.sourceId && item.to == conn.targetId) {
          _this.currentLine = item;
          _this.editType = 'line';
          _this.$nextTick(function () {
            _this.$refs.lineForm.init(item)
          })
          return;
        }
      });
    },
    /** 删除线 */
    delLine (conn) {
      if (this.pageType != 3) {
        this.$confirm('确定删除所点击的线吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.jsPlumb.deleteConnection(conn)
        }).catch(() => { })
      }
    },
    /** 是否具有该线 */
    hasLine (from, to) {
      for (var i = 0; i < this.data.lineList.length; i++) {
        var line = this.data.lineList[i]
        if (line.from === from && line.to === to) {
          return true
        }
      }
      return false
    },
    /** 是否含有相反的线 */
    hashOppositeLine (from, to) {
      return this.hasLine(to, from)
    },
    lineLabelSave (line) {
      this.currentConnect.getOverlay("label-1").setLabel(line.label);
    },
    drag (item) {
      this.currentItem = item;
    },
    drop (event) {
      //event.preventDefault();
      var _obj = this.$refs.flowContent;
      var temp = {
        id: this.getUUID(),
        label: this.currentItem.label,
        top: event.offsetY + 'px',
        left: event.offsetX + 'px',
        Type: this.currentItem.type,
        componentType: this.currentItem.type,
      }
      this.addNode(temp);
      this.editNode(temp.id);
    },
    allowDrop (event) {
      event.preventDefault()
    },
    getUUID () {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = "4";
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
      s[8] = s[13] = s[18] = s[23] = "-"
      var uuid = s.join("")
      return uuid
    },
    /** 循环遍历数据并赋值对象数据 */
    eachDataSort () {
      this.startID = this.lineData[this.startID]
      if (this.startID) {
        this.startVal++
        this.nodeData[this.startID].sort = this.startVal
        this.eachDataSort()
      }
    },
    compare (property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      }
    },
    saveData () {
      /** 连线排序 */
      this.nodeData = {}  /** 获取模块的值 */
      this.lineData = {}  /** 获取连接线的值 */
      this.startVal = 0   /** 定义排序的值 */
      this.startID = '' /** 开始ID */
      this.data.nodeList.map((v) => {
        this.nodeData[v.id] = v
        if (v.Type == 1) {
          this.startID = v.id || ''
          this.nodeData[v.id].sort = this.startVal
        }
      })
      this.data.lineList.forEach((v) => {
        this.lineData[v.from] = v.to
      })
      /** 执行遍历顺序 */
      this.eachDataSort()
      this.confirmForm.processJson = JSON.stringify(this.data)
      if (this.data.nodeList.length <= 3) {
        return this.$message.warning('请完善流程图')
      }
      this.confirmForm.configs = this.data.nodeList.sort(this.compare('sort'))
      for (let i = 0; i < this.confirmForm.configs.length; i++) {
        const item = this.confirmForm.configs[i]
        //  工作流设置
        if (item.componentType == 1 && item.repeatFlag == 1) {
          if (item.timePeriod == '') {
            return this.$message.warning('请完善【邮件工作流设置】-- 时间周期')
          }
          if (item.buyEndTime == '') {
            return this.$message.warning('请完善【邮件工作流设置】-- 时间周期内产生购买')
          }
        }
        // 时间验证
        if (item.componentType == 3 && !item.triggerType) {
          return this.$message.warning('请完善【邮件触发时间设置】')
        } else {
          if (item.componentType == 3 && item.triggerType == 1) {
            if (item.delayTime == '' || item.delayTime == undefined || item.delayTimeUnit == undefined) {
              return this.$message.warning('请完善【邮件触发时间设置】-- 延迟时间')
            }
          }
          if (item.componentType == 3 && item.triggerType == 2) {
            if (item.fixedTimeZone == undefined || item.fixedTimeHour == undefined || item.fixedTimeMinute == undefined || item.fixedTimeType == undefined) {
              return this.$message.warning('请完善【邮件触发时间设置】-- 固定时间')
            }
          }
        }
        // 邮件设置验证
        if (item.componentType == 4) {
          if (item.emailTheme == '' || item.emailTheme == undefined) {
            return this.$message.warning('请完善【邮件内容设置】-- 邮件主题')
          }
          if (item.senderName == '' || item.senderName == undefined) {
            return this.$message.warning('请完善【邮件内容设置】-- 发送人名称')
          }
          if (item.emailTemplate == '' || item.emailTemplate == undefined) {
            return this.$message.warning('请完善【邮件内容设置】-- 邮件模板')
          }
        }
        // 连线
        if (item.sort == undefined) {
          return this.$message.warning('请将流程图进行连线')
        }
      }
      this.$store.dispatch('app/callLoading', { name: this.routeName, type: true })
      this.$ajax({
        method: "POST",
        url: `/emailConfig/update`,
        data: {
          ...this.confirmForm
        }
      }).then((res) => {
        if (res.code == 0) {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err.msg)
      }).finally(() => {
        this.$store.dispatch('app/callLoading', { name: this.routeName, type: false })
      })
    },
    /** 关闭方法 */
    closeFn () {
      this.errorGoFn(this, `/email/email-lists`)
    },
    editFlow () {
      this.editType = 'flow'
      // this.$nextTick(function () {
      //   this.$refs.flowEdit.init(this.data.flowInfo)
      // })
    },
    /** 编辑模块成功的回调方法 */
    nodeConfirmSucceed (editForm) {
      this.data.nodeList.filter((node) => {
        if (node.id === editForm.id) {
          for (let key in editForm) {
            node[key] = editForm[key];
          }
        }
      })
    },
    /** 开启邮件流 */
    handleEmail () {
      this.$confirm(`亲，一旦开启，触发相关的条件则会发送邮件给到用户，请你确认配置项是否正常并且真的开启？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('app/callLoading', { name: this.routeName, type: true })
        this.$ajax({
          method: 'POST',
          url: `/emailConfig/open`,
          data: {
            'id': this.$route.query.id,
          }
        }).then((res) => {
          if (res.code == 0) {
            this.$message.success('操作成功')
          } else {
            this.$message.error(res.msg)
          }
        }).catch((err) => {
          this.$message.error(err.msg)
        }).finally(() => {
          this.$store.dispatch('app/callLoading', { name: this.routeName, type: false })
        })
      }).catch(() => {
      })
    },
    handleCloseEmail () {
      this.$confirm(`亲，一旦关闭邮件工作流，邮件将不会再发送给到用户，你是否确认关闭？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('app/callLoading', { name: this.routeName, type: true })
        this.$ajax({
          method: 'POST',
          url: `/emailConfig/close`,
          data: {
            'id': this.$route.query.id,
          }
        }).then((res) => {
          if (res.code == 0) {
            this.$message.success('操作成功')
          } else {
            this.$message.error(res.msg)
          }
        }).catch((err) => {
          this.$message.error(err.msg)
        }).finally(() => {
          this.$store.dispatch('app/callLoading', { name: this.routeName, type: false })
        })
      }).catch(() => {
      })
    },
  }
}
</script>

<style lang="scss">
.word-flow-main {
  padding-top: 25px;
  .appcontainer {
    margin-top: 5px;
    display: flex;
    height: calc(100vh - 295px);
    color: #606266;
  }
  .flow-detail {
    padding: 12px;
    overflow: auto;
    position: relative;
    flex: 1;
    border: 1px solid #dcdfe6;
    word-break: break-all;
    border-radius: 4px;
    background: url(../../assets/images/gooflow_blank2.gif);
  }
  #flowContent {
    position: relative;
    width: 200%;
    min-width: 1000px;
    height: 300%;
    min-height: 450px;
  }
  .item {
    position: absolute;
    width: 60px;
    height: 90px;
    border: 1px solid #007aff;
  }
  .flow-menu {
    margin: 0 5px 0 0;
    padding: 10px;
    width: 100px;
    word-break: break-all;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: auto;
  }
  .menu-item {
    margin-bottom: 8px;
    padding: 5px 0;
    text-align: center;
    font-size: 14px;
    color: #606266;
    border-radius: 5px;
    box-shadow: 0 0 4px #696969;
    cursor: pointer;
  }
  .menu-item > i {
    font-size: 30px;
  }
  .flow-edit {
    margin: 0 0 0 5px;
    width: 360px;
  }
  .flow-edit-content {
    padding: 10px;
    overflow: hidden;
    text-align: justify;
    line-height: 1.4;
    font-size: 14px;
    height: 100%;
    color: #606266;
    word-break: break-all;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
  .csslabel {
    z-index: 10;
    font-size: 12px;
    color: #409eff;
    font-weight: 400;
    background: #fff;
  }
  .csslabel .label-text {
    background-color: #fff;
  }
}
</style>