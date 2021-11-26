<template>
  <div>
    <div class="upload-excel">
      <el-dialog :title="title"
                 append-to-body
                 :visible.sync="popupType"
                 :close-on-click-modal="false"
                 width="100%"
                 style="margin: 0 auto;max-width: 600px;">
        <el-alert v-if="hint"
                  :title="hint"
                  type="warning"
                  show-icon
                  :closable="false"></el-alert>
        <div class="upload-excel-c"
             :class="{ 'margin-t-10': hint }"
             v-if="popupType">
          <el-upload class="upload-demo"
                     :headers="{token: $store.state.user.token }"
                     ref="upload"
                     :action="action"
                     :data="{isEncrypt: 1, ...ajaxData}"
                     :on-remove="handleRemove"
                     :on-progress="progressFn"
                     :on-success="successFn"
                     :on-error="errorFn"
                     :on-exceed="exceedFn"
                     :on-change="changeFn"
                     :before-upload="beforeAvatarUpload"
                     :drag="true"
                     :limit="1"
                     :multiple="false"
                     accept=".xls,.xlsx,.doc,.docx,.txt,.pdf"
                     :auto-upload="false">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip"
                 class="el-upload__tip"
                 v-if="export_url">没有模板？点击此处
              <a class="el-button--text"
                 href="javascript:;"
                 @click="getTemplate">下载导入模板</a>
            </div>
            <div slot="tip"
                 class="el-upload__tip"
                 v-if="tip">
              系统将会覆盖所有已导入的SKU的产品
            </div>
            <div slot="tip"
                 class="el-upload__tip"
                 v-if="sortTemplate">系统只会对文件里有的SPU进行排序
              <a class="el-button--text"
                 href="javascript:;"
                 @click="handleDownTemp">下载导入模板</a>
            </div>
          </el-upload>
        </div>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="popupType = false">取 消</el-button>
          <el-button type="primary"
                     :loading="submitUploadType"
                     @click="submitUpload">提 交</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 导入失败的数据 -->
    <el-dialog title="模板导入结果"
               append-to-body
               :visible.sync="resultListPopupType"
               :close-on-click-modal="false">
      <el-alert :title="`导入成功 ${successCount} 条，失败 ${errorCount} 条`"
                type="warning"
                show-icon
                :closable="false"></el-alert>
      <el-table class="margin-t-10"
                :max-height="tableHeight"
                :data="resultList"
                border
                fit
                highlight-current-row>
        <el-table-column type="index"
                         fixed="left"
                         align="center"></el-table-column>
        <el-table-column label="编号"
                         prop="num"></el-table-column>
        <el-table-column label="状态"
                         prop="status"></el-table-column>
        <el-table-column label="失败原因"
                         prop="msg"></el-table-column>
      </el-table>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="resultListPopupType = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="模板导入结果"
               append-to-body
               :visible.sync="lotteryDialog"
               :close-on-click-modal="false">
      <div v-if="isSucc"
           style="font-size: 16px;font-weight: 700;">
        已成功导入 {{lotteryAccout}} 款SKU
      </div>
      <div v-else>
        以下SKU导入失败
        <el-table class="margin-t-10"
                  :max-height="tableHeight"
                  :data="errList"
                  border
                  fit
                  highlight-current-row>
          <el-table-column type="index"
                           fixed="left"
                           align="center"></el-table-column>
          <el-table-column label="SKU"
                           prop="sku"></el-table-column>
          <el-table-column label="失败原因"
                           prop="reason"></el-table-column>
        </el-table>
      </div>

      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="lotteryDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 全局上传组件
 * title 导入模板弹窗标题
 * @sucCallBack 上传成功的回调方法
 */
export default {
  name: 'UploadExcel',
  props: {
    title: {
      type: String,
      default: '上传'
    },
    hint: {
      type: String
    },
    tip: {
      type: Boolean
    },
    sortTemplate: {
      type: Boolean
    }
  },
  data () {
    return {
      popupType: false,
      action: '', /** 导入的地址，通过父组件传递调用来进行修改 */
      ajaxData: {}, /** 传递的参数 */
      submitUploadType: false,
      export_url: '', /** 导出模板的名称，有值则显示，没有值则不显示 */
      fileList: [],
      resultListPopupType: false, /** 失败列表的提示弹窗状态 */
      tableHeight: 400,
      resultList: [], /** 失败列表数据 */
      successCount: 0, /** 成功的条数 */
      errorCount: 0, /** 失败的条数 */

      /** 抽奖系统单独处理 */
      lotteryDialog: false,
      isSucc: false,
      lotteryAccout: 0,
      errList: []
    }
  },
  methods: {
    /**
     * 调用导入方法
     * uploadType 传递导入的类型
     * export_url 传递导出模板的名称，用来下载使用
     * ajaxData   传递的接口参数
     */
    callUploadExcel (uploadType, export_url = '', ajaxData = {}) {
      this.submitUploadType = false
      this.fileList = []
      this.action = `${this.$store.state.app.ajax_url}/import/uploadFile/${uploadType}`
      this.export_url = export_url
      this.ajaxData = ajaxData
      this.popupType = true
    },
    /** 选择文件 */
    changeFn (file, fileList) {
      this.fileList = fileList;
    },
    /** 确认提交 */
    submitUpload (response, file, fileList) {
      if (this.fileList.length <= 0) {
        this.$message.warning('请选择文件再提交');
      } else {
        this.submitUploadType = true;
        this.$refs.upload.submit();
      }
    },
    /** 文件大小判断 */
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.warning('文件不能大于 10MB!');
      }
      return isLt2M;
    },
    /** 上传中回调方法 */
    progressFn (event, file, fileList) {

    },
    /** 删除文件方法 */
    handleRemove (file, fileList) {

    },
    handleDownTemp () {
      this.$emit('shopExportFn')
    },
    /** 下载模板 */
    getTemplate () {
      window.location.href = `${this.$store.state.app.export_url}/${this.export_url}`
    },
    /** 提交成功的回调方法 */
    successFn (response, file, fileList) {
      this.submitUploadType = this.popupType = false;
      if (this.tip) {
        /** 抽奖管理输出成功失败回调 */
        this.lotteryDialog = true
        if (response.code == 0) {
          this.isSucc = true
          this.lotteryAccout = response.data.successCount
        } else {
          this.isSucc = false
          let data = JSON.parse(response.msg)
          let skuA, skuB, skuC, skuD = []
          skuA = data.notExistList?.map((item) => {
            return { sku: item, reason: 'SKU不存在' }
          }) || []
          skuB = data.notShelvesList?.map((item) => {
            return { sku: item, reason: 'SKU未上架' }
          }) || []
          skuC = data.unSyncList?.map((item) => {
            return { sku: item, reason: 'SKU未同步到shopify' }
          }) || []
          skuD = data.notHasInventoryList?.map((item) => {
            return { sku: item, reason: 'sku库存不足' }
          }) || []
          let newArr = skuA.concat(skuB, skuC, skuD,)
          this.errList = newArr.filter((s) => {
            return s
          })
        }
      } else {
        if (response.code == 0) {
          if (response.data && response.data.resultList && response.data.resultList.length > 0) {
            this.resultList = response.data.resultList
            this.resultListPopupType = true
            this.successCount = response.data.successCount
            this.errorCount = response.data.errorCount
          } else {
            this.$message({ message: response.msg, type: 'success' })
          }
          this.$emit('sucCallBack')
        } else {
          this.$message.error(response.msg);
        }
      }



    },
    /** 提交失败的回调方法 */
    errorFn (err, file, fileList) {
      this.popupType = false;
      this.$message.error('服务起繁忙，请稍后重试！');
    },
    exceedFn (files, fileList) {
      this.popupType = false;
      this.$message.warning('只能选择一个元素，请删除选择文件再重新选择');
    }
  }
}
</script>

<style>
.upload-excel .el-dialog__body {
  padding: 10px 20px;
}
.upload-excel-c .el-upload {
  display: block;
}
.upload-excel-c .el-upload .el-upload-dragger {
  width: 100%;
}
.upload-label .el-form-item__label {
  font-weight: 500;
}
</style>
