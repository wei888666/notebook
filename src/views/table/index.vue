<template>
  <div class="app-container">
    <search @alterHeight="(h) => { tableHeight = h }"
            @clickResetFn="searchResetFn(seekFrom)"
            @clickSeekFn="seekFn">
      <template slot="button">
        <el-button type="primary"
                   @click="popupType=true">新 增</el-button>
      </template>
      <template>
        <el-form ref="form"
                 @keyup.enter.native="seekFn"
                 label-position="top">
          <el-form-item label="活动名称:">
            <el-input v-model="seekFrom.couponNo"></el-input>
          </el-form-item>
          <el-form-item label="上架状态:">
            <el-select v-model="seekFrom.status"
                       placeholder=" ">
              <el-option label="未上架"
                         :value="0" />
              <el-option label="上架"
                         :value="1" />
              <el-option label="下架"
                         :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="购买SPU:">
            <el-input v-model="seekFrom.couponName"></el-input>
          </el-form-item>
          <el-form-item label="赠送SPU:">
            <el-input v-model="seekFrom.couponName"></el-input>
          </el-form-item>
          <el-form-item label="UTC活动时间"
                        prop="time">
            <el-date-picker type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            is-range
                            v-model="seekFrom.time"
                            range-separator="-"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="折扣类型:">
            <el-select v-model="seekFrom.status"
                       placeholder=" ">
              <el-option label="未上架"
                         :value="0" />
              <el-option label="上架"
                         :value="1" />
              <el-option label="下架"
                         :value="2" />
            </el-select>
          </el-form-item>

        </el-form>
      </template>
    </search>

    <div class="word-module-padding "
         v-loading="loading">
      <div class="word-table-module">
        <el-table :max-height="tableHeight"
                  :empty-text="emptyText"
                  :data="tableData"
                  ref="itsmDataTable"
                  border
                  fit>
          <el-table-column type="index"
                           fixed="left"
                           :index="index => {return (pageNum - 1) * pageSize + index + 1;}"
                           align="center"></el-table-column>
          <el-table-column label="邮件名称"
                           align="center"
                           show-overflow-tooltip
                           prop="emailName"></el-table-column>
          <el-table-column label="邮件主题"
                           align="center"
                           show-overflow-tooltip
                           prop="emailThemeStr">
          </el-table-column>
          <el-table-column>
            <template slot="header">闪购ID<br />批次号</template>
            <template slot-scope="{ row }">{{ row.id }}<br />{{ row.couponName }}</template>
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           width="120">
            <template slot-scope="{ row }">
              <a class="btn"
                 href="javascript:;"
                 title="编辑">
                <svg aria-hidden="true"
                     class="icon svg-icon">
                  <use xlink:href="#icon-edit"></use>
                </svg>
              </a>
              <a class="btn"
                 href="javascript:;"
                 title="开启">
                <svg aria-hidden="true"
                     class="icon svg-icon">
                  <use xlink:href="#icon-start"></use>
                </svg>
              </a>
              <a class="btn"
                 href="javascript:;"
                 title="关闭">
                <svg aria-hidden="true"
                     class="icon svg-icon">
                  <use xlink:href="#icon-disable"></use>
                </svg>
              </a>

            </template>
          </el-table-column>
        </el-table>
        <pagination :total="total"
                    :page.sync="pageNum"
                    :limit.sync="pageSize"
                    @pagination="paginationFn" />
      </div>
    </div>
    <!-- 新增弹窗 -->
    <el-dialog title=" "
               append-to-body
               :visible.sync="popupType"
               :close-on-click-modal="false"
               width="100%"
               style="margin: 0 auto;max-width: 600px;">

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="popupType = false">取 消</el-button>
        <el-button type="primary"
                   :loading='editLoading'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'FullList',
  data () {
    return {
      popupType: false,/** 新增弹窗 */
      seekFrom: {},  /** 搜索数据 */
      loading: false, /** 加载的状态 */
      tableHeight: 300, /** 表格的自适应高度 */
      tableData: [], /** 表格数据 */
      emptyText: '暂无数据~', /** 表格提示语 */
      pageNum: 1,    /** 当前页数 */
      pageSize: 10,  /** 查询数据大小 */
      total: 0,      /** 总条数*/
      editLoading: false, /** 弹窗按钮状态 */
    }
  },
  watch: {
    editPopupType () {
      if (!this.editPopupType) {
        this.searchResetFn(this.editForm);
        this.editForm = {};
        this.$refs.editForm.clearValidate();
      }
    }
  },
  mounted () {

  },
  methods: {
    /** 获取数据 */
    gainData () {
      this.$ajax({
        method: "POST",
        url: `/flashdeals/findFlashdealsPage`,
        data: {
          "pageNum": this.pageNum,
          "pageSize": this.pageSize,
          ...this.seekFrom,
        }
      })
        .then(ret => {
          if (ret.code == 0) {
            this.emptyText = "暂无数据~";
            let { records } = ret.data.page;
            this.titleData = ret.data;
            this.tableData = records;
          } else {
            this.emptyText = ret.msg;
            this.tableData = [];
          }
        })
        .catch(err => {
          this.emptyText = err.msg;
          this.tableData = [];
        })
        .finally(() => {
          this.loading = false;
          this.tableDataOrigin = this.tableData;
        });
    },
    /** 分页 */
    paginationFn ({ pageNum, pageSize }) {
      this.pageNum = pageNum
      this.pageSize = pageSize
      this.gainData()
    },
    /** 搜索方法 */
    seekFn () {
      this.pageNum = 1
      this.gainData()
    },
  },
}
</script>

<style scoped>
</style>