<template>
  <div>
    <div class="content-form">
      <el-form :model="editForm"
               ref="editForm"
               class="flowEditForm margin13"
               size="mini">
        <!-- 开始触发邮件工作流 -->
        <div v-if="componentType == 1">
          <div class="title-head">
            邮件工作流设置
          </div>
          <div style="line-height:26px;
                  display: flex;
                  justify-content: space-between;
                  flex-wrap: wrap;
                  flex-direction: row;
                  align-items: center;">
            <div style="font-weight: 700;"> 防止重复发送</div>
            <el-switch v-model="editForm.repeatFlag"
                       :active-value='1'
                       :inactive-value='0'
                       @change='changeRepeatFlag'>
            </el-switch>
          </div>
          <div v-if="editForm.repeatFlag==1">
            <div style="margin:10px 0">同一个邮箱账户，设置的周期内产生多次行为，都不会重复发送多封邮件</div>
            <el-form-item :prop="editForm.repeatFlag==1?'timePeriod':'noTime'">
              <div>
                <!--                <el-radio v-model="editForm.timePeriodType"-->
                <!--                          :label="0">时间周期</el-radio>-->
                <p>时间周期</p>
              </div>
              <el-input v-model="editForm.timePeriod"
                        style="width:150px"
                        @change="confirmFnStart"></el-input>
              <el-select v-model="editForm.timePeriodUnit"
                         style="width:100px"
                         placeholder=''
                         @change="confirmFnStart">
                <el-option v-for="(item,index) of timingArr"
                           :key="index"
                           :label="item.label"
                           :value="item.val">
                </el-option>
              </el-select>
            </el-form-item>
            <div style="margin:10px 0">同一个邮箱账户，设置的周期内产生了购买行为，则新的工作流不触发</div>
            <el-form-item :prop="editForm.repeatFlag==1?'buyEndTime':'noTime'">
              <div>
                <!--                <el-radio v-model="editForm.buyEndTimeType"-->
                <!--                          :label="0">时间周期内产生购买</el-radio>-->
                <p>时间周期内产生购买</p>
              </div>
              <el-input v-model="editForm.buyEndTime"
                        style="width:150px"
                        @change="confirmFnStart"></el-input>
              <el-select v-model="editForm.buyEndTimeUnit"
                         style="width:100px"
                         placeholder=''
                         @change="confirmFnStart">
                <el-option v-for="(item,index) of timingArr"
                           :key="index"
                           :label="item.label"
                           :value="item.val">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div style="font-weight: 700;margin-top:30px">结束机制</div>
          <el-form-item prop="title">
            <div>
              <!--              <el-radio v-model="editForm.endType"-->
              <!--                        :label="0">-->
              <!--                <div>完成完整流程则结束，弃单邮件产生购买也会结束工作流 </div>-->
              <!--              </el-radio>-->
              <p>完成完整流程则结束，弃单邮件产生购买也会结束工作流</p>
            </div>
          </el-form-item>
        </div>
        <!-- 时间维度 -->
        <div v-if="componentType == 3">
          <div class="title-head">
            邮件触发时间设置
          </div>
          <div style="font-weight: 700;">触发时间</div>
          <div style="margin:10px 0">选择邮件触发的时间节点，可以选择固定时间发送也可以选择延迟时间发送</div>
          <el-form-item prop="triggerType">
            <div>
              <el-radio v-model="editForm.triggerType"
                        :label="1"
                        @change="confirmFnStart">延迟时间</el-radio>
            </div>
            <el-input v-model="editForm.delayTime"
                      style="width:150px"
                      @change="confirmFnStart"></el-input>
            <el-select v-model="editForm.delayTimeUnit"
                       style="width:100px"
                       placeholder=''
                       @change="confirmFnStart">
              <el-option v-for="(item,index) of dayArr"
                         :key="index"
                         :label="item.label"
                         :value="item.val">
              </el-option>
            </el-select>
            <div style="font-size: 10px;">注意：数字配置为0则代表立即发送</div>
          </el-form-item>
          <el-form-item prop="triggerType">
            <div>
              <el-radio v-model="editForm.triggerType"
                        :label="2"
                        @change="confirmFnStart">固定时间</el-radio>
            </div>
            <el-select v-model="editForm.fixedTimeZone"
                       style="width:118px"
                       placeholder=''
                       @change="confirmFnStart">
              <el-option v-for="(item,index) of utcArr"
                         :key="index"
                         :label="item.label"
                         :value="item.val">
              </el-option>
            </el-select>
            <el-select v-model="editForm.fixedTimeHour"
                       style="width:61px"
                       placeholder=''
                       @change="confirmFnStart">
              <el-option v-for="(item,index) of nunberArrA"
                         :key="index"
                         :label="item.label"
                         :value="item.val">
              </el-option>
            </el-select>
            <el-select v-model="editForm.fixedTimeMinute"
                       style="width:61px"
                       placeholder=''
                       @change="confirmFnStart">
              <el-option v-for="(item,index) of nunberArrB"
                         :key="index"
                         :label="item.label"
                         :value="item.val">
              </el-option>
            </el-select>
            <el-select v-model="editForm.fixedTimeType"
                       style="width:68px"
                       placeholder=''
                       @change="confirmFnStart">
              <el-option label="AM"
                         :value="0">
              </el-option>
              <el-option label="PM"
                         :value="1">
              </el-option>
            </el-select>
            <div style="font-size: 10px;">注意：由于邮件发送的定时任务设定为半小时，请往前半小时进行设置</div>
          </el-form-item>
        </div>
        <!-- 邮件内容 -->
        <div v-if="componentType == 4">
          <div style="display: flex;
                  justify-content: space-between;
                  flex-wrap: wrap;
                  flex-direction: row;
                  align-items: center;"
               class="title-head">
            <div>
              邮件内容设置
            </div>
            <el-button @click="handleSendEmail"
                       v-if="ifPageButtonType('buttomEmailConfigSendEmail')">发送测试邮件</el-button>
          </div>
          <el-form-item label="*邮件主题"
                        prop="emailTheme">
            <el-input v-model="editForm.emailTheme"
                      clearable
                      @change="confirmFnStart"></el-input>
          </el-form-item>
          <el-form-item label="*发送人名称"
                        prop="senderName">
            <el-input v-model="editForm.senderName"
                      clearable
                      @change="confirmFnStart"></el-input>
          </el-form-item>
          <div style="margin: 20px 0 5px 0;">UTM参数</div>
          <el-form-item label="Source">
            <el-input v-model="editForm.source"
                      clearable
                      @change="confirmFnStart"></el-input>
          </el-form-item>
          <el-form-item label="Medium">
            <el-input v-model="editForm.medium"
                      clearable
                      @change="confirmFnStart"></el-input>
          </el-form-item>
          <el-form-item label="Campaign">
            <el-input v-model="editForm.campaign"
                      clearable
                      @change="confirmFnStart"></el-input>
          </el-form-item>
          <el-form-item label="其他参数">
            <el-input v-model="editForm.other"
                      clearable
                      @change="confirmFnStart"></el-input>
          </el-form-item>

          <div style="line-height:26px;
                  display: flex;
                  justify-content: space-between;
                  flex-wrap: wrap;
                  flex-direction: row;
                  align-items: center;">
            <div style="font-weight: 700;"> 邮件模板</div>
            <div>
              <a href="javascript:;"
                 class="btn"
                 title="预览"
                 @click="seeEmail">
                <svg aria-hidden="true"
                     class="icon svg-icon">
                  <use xlink:href="#icon-eye-open"></use>
                </svg>
              </a>
            </div>
          </div>
          <el-form-item prop="shopName">
            <el-input type="textarea"
                      :rows="15"
                      v-model="editForm.emailTemplate"
                      @change="confirmFnStart">
            </el-input>
          </el-form-item>
        </div>
      </el-form>

    </div>
    <el-dialog :title="`邮件主题：${emailTitle}`"
               append-to-body
               :close-on-click-modal="false"
               :visible.sync="editPopupType">
      <div v-html="emailConter">
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editPopupType = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    pageType: {
      type: String,
      default: 1
    }
  },
  name: 'EditNode',
  data () {
    return {
      routeName: this.$route.name,
      emailTitle: '',/** 预览标题 */
      emailConter: '',/** 预览内容 */
      editPopupType: false,/** 预览弹窗 */
      node: {},
      resetType: false, /** 判断重置的状态，第一次修改不进行值重置 */
      editForm: {
        title: '', /** 标题 */
        repeatFlag: 0, /**'防止重复发送；0-关闭，1-开启' */
        timePeriodType: 0,/** 时间周期单选 */
        timePeriodUnit: 1,/**时间周期默认小时 */
        buyEndTimeType: 0,/** 时间周期内产生购买默认单选 */
        buyEndTimeUnit: 1,/**时间周期内产生购买默认小时 */
        endType: 0,/** 结束机制默认选择 */
        triggerType: 1,/**触发时间默认选择 */
        emailTheme: '',
        senderName: ""
      },
      // editRules: {
      //   timePeriod: [{ required: true, message: '请输入时间周期', trigger: 'blur' }],
      //   buyEndTime: [{ required: true, message: '请输入时间周期', trigger: 'blur' }],
      //   // emailTheme: [{ required: true, message: '请输入邮件主题', trigger: 'blur' }],
      //   // senderName: [{ required: true, message: '请输入发送人名称', trigger: 'blur' }],
      //   // triggerType: [{ required: true, message: '请选择触发时间', trigger: 'blur' }],
      // },
      componentType: null, /** 判断显示哪个表单 */
      timingArr: [
        { label: '小时', val: 1 },
        { label: '天', val: 2 },
        { label: '周', val: 3 },
      ]/** 时间选择 */,
      dayArr: [
        { label: '分钟', val: 0 },
        { label: '小时', val: 1 },
        { label: '天', val: 2 },
        { label: '周', val: 3 },
        { label: '月', val: 4 }
      ]/** 延迟时间选择 */,
      utcArr: [
        { label: 'UTC - 12:00', val: -12 },
        { label: 'UTC - 11:00', val: -11 },
        { label: 'UTC - 10:00', val: -10 },
        { label: 'UTC - 09:00', val: -9 },
        { label: 'UTC - 08:00', val: -8 },
        { label: 'UTC - 07:00', val: -7 },
        { label: 'UTC - 06:00', val: -6 },
        { label: 'UTC - 05:00', val: -5 },
        { label: 'UTC - 04:00', val: -4 },
        { label: 'UTC - 03:00', val: -3 },
        { label: 'UTC - 02:00', val: -2 },
        { label: 'UTC - 01:00', val: -1 },
        { label: 'UTC + 00:00', val: 0 },
        { label: 'UTC + 01:00', val: 1 },
        { label: 'UTC + 02:00', val: 2 },
        { label: 'UTC + 03:00', val: 3 },
        { label: 'UTC + 04:00', val: 4 },
        { label: 'UTC + 05:00', val: 5 },
        { label: 'UTC + 06:00', val: 6 },
        { label: 'UTC + 07:00', val: 7 },
        { label: 'UTC + 08:00', val: 8 },
        { label: 'UTC + 09:00', val: 9 },
        { label: 'UTC + 10:00', val: 10 },
        { label: 'UTC + 11:00', val: 11 },
        { label: 'UTC + 12:00', val: 12 },
      ]/**  固定UTC时间选择 */,
      nunberArrA: [
        { label: '01', val: 1 },
        { label: '02', val: 2 },
        { label: '03', val: 3 },
        { label: '04', val: 4 },
        { label: '05', val: 5 },
        { label: '06', val: 6 },
        { label: '07', val: 7 },
        { label: '08', val: 8 },
        { label: '09', val: 9 },
        { label: '10', val: 10 },
        { label: '11', val: 11 },
        { label: '12', val: 12 },
      ]
      /** 固定时间0-12选择 */,
      nunberArrB: [
        { label: '00', val: 0 },
        { label: '05', val: 5 },
        { label: '10', val: 10 },
        { label: '15', val: 15 },
        { label: '20', val: 20 },
        { label: '25', val: 25 },
        { label: '30', val: 30 },
        { label: '35', val: 35 },
        { label: '40', val: 40 },
        { label: '45', val: 45 },
        { label: '50', val: 50 },
        { label: '55', val: 55 }]
      /** 固定时间0-55选择 */
    }
  },
  methods: {
    init (data, id) {
      data.nodeList.filter((node) => {
        if (node.id === id) {
          this.node = node
          this.componentType = this.node.componentType
          /** 对默认值进行赋值操作 */
          this.editForm = this.node || this.editForm
        }
      })
    },
    /** 确认编辑 */
    confirmFnStart () {
      this.editForm.id = this.node.id
      this.$emit('confirmSucceed', this.editForm)
    },
    /**发送测试邮件 */
    handleSendEmail () {
      if (!this.editForm.emailTheme) {
        return this.$message.warning('请输入邮件主题')
      }
      if (!this.editForm.senderName) {
        return this.$message.warning('请输入发送人名称')
      }
      if (!this.editForm.emailTemplate) {
        return this.$message.warning('请输入邮件内容')
      }
      this.$store.dispatch('app/callLoading', { name: this.routeName, type: true })
      this.$ajax({
        method: 'POST',
        url: `/emailConfig/sendEmail`,
        data: {
          'senderName': this.editForm.senderName,
          'emailTheme': this.editForm.emailTheme,
          'emailTemplate': this.editForm.emailTemplate,
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
    },
    seeEmail () {
      this.emailTitle = this.editForm.emailTheme
      this.emailConter = this.editForm.emailTemplate
      if (this.emailTitle != '' && this.emailConter != '') {
        this.editPopupType = true
      } else {
        this.$message.warning('请输入邮件名称和邮件内容')
      }
    },
    changeRepeatFlag (val) {
      if (val == 1) {
        this.$set(this.editForm, 'timePeriodType', 0)
        this.$set(this.editForm, 'timePeriodUnit', 1)
        this.$set(this.editForm, 'buyEndTimeType', 0)
        this.$set(this.editForm, 'buyEndTimeUnit', 1)
        this.$set(this.editForm, 'timePeriod', '')
        this.$set(this.editForm, 'buyEndTime', '')
      } else {
        this.$set(this.editForm, 'timePeriodType', null)
        this.$set(this.editForm, 'timePeriodUnit', null)
        this.$set(this.editForm, 'buyEndTimeType', null)
        this.$set(this.editForm, 'buyEndTimeUnit', null)
        this.$set(this.editForm, 'timePeriod', '')
        this.$set(this.editForm, 'buyEndTime', '')
      }
      this.confirmFnStart()
    }
  }
}
</script>

<style scoped lang='scss'>
.content-form {
  padding-right: 5px;
  overflow: auto;
  max-height: calc(100vh - 310px);
  .title-head {
    font-size: 18px;
    font-weight: bolder;
    margin: 10px 0;
    border-bottom: 1px solid;
    line-height: 40px;
  }
}
.el-radio__label > div {
  text-overflow: ellipsis;
  white-space: normal;
  line-height: 18px;
  width: 90%;
  vertical-align: middle;
  display: inline-block;
}
</style>