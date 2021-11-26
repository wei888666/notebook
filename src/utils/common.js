import axios from "axios" /** 引入axios方法并定义全局 */
axios.defaults.withCredentials = true
import $ajax from "./ajax"
import store from "@/store/index"
let cosy = {}
cosy.install = function (Vue, options) {
  /**
   * 搜索重置方法
   * seekData 传递搜索的参数，必传
  */
  Vue.prototype.searchResetFn = (seekData = {}) => {
    let seekArray = Object.entries(seekData);
    for (let [key, val] of seekArray) {
      if (val instanceof Array) { /** 判断是否是数组，是数组重置为空数组 */
        seekData[key] = []
      } else if (typeof val == "number") { /** 判断是否是数字，是数字则重置为 undefined */
        seekData[key] = undefined
      } else if (typeof val == "object") {
        seekData[key] = {}
      } else {
        seekData[key] = ""
      }
    }
  };

  /**
   * 返回图片预览功能，支持预览组件可以多图预览切换
   * 配合 el-image 组件的 preview-src-list 方法，预览使用
   * item    返回预览图片数据
   * imgHost 图片前缀
   * imgUrl  图片地址
  */
  Vue.prototype.previewSrcListFn = (item = [], imgHost = 'imgHost', imgUrl = 'imgUrl') => {
    let previewImgs = []
    for(let img of item){
      let img_url = (img[imgUrl].indexOf('http') < 0 && img[imgHost] ? img[imgHost] : '') + img[imgUrl]
      previewImgs.push(img_url)
    }
    return previewImgs
  }

  /**
   * 判断页面按钮的显示权限
   * 传递按钮的 name 值来进行匹配查找
   */
  Vue.prototype.ifPageButtonType = (buttonName) => {
    if(store.state.user.userInfo && store.state.user.userInfo.buttonListsData){
      return store.state.user.userInfo.buttonListsData[buttonName]
    }else {
      return false
    }
  };

  /** 计算 table 的 max-height */
  Vue.prototype.calculateTableHeight = () => {
    return new Promise((resolve, reject) => {
      let appContainerHiehgt = document.querySelector('#app').clientHeight,
        paginationContainer = document.querySelector('.pagination-container'),
        paginationContainerHeight = paginationContainer ? paginationContainer.clientHeight : 0,
        tableModule = document.querySelector('.word-table-module'),
        tableHeight = tableModule ? (appContainerHiehgt - tableModule.offsetTop - paginationContainerHeight - 74) : 0
      resolve((tableHeight > 300 ? Math.floor(tableHeight) : 300))
    })
  }

  /** 
   * 页面报错或者跳转删除当前页面
   * 传递当前页面的 that === this
   * 传递需要跳转的 URL 地址
   */
  Vue.prototype.errorGoFn = (that, url) => {
    that.$store.dispatch('tagsView/delView', that.$route).then(({ visitedViews }) => {
      that.$router.replace(url)
    })
  }

  /**
   * 配置全局 ajax 方法
   * ajaxData 为传递的接口参数，跟原先调用一致
   * 例：
   *   method: 'POST',
       url: ajax地址,
       data: { }
   */
  Vue.prototype.$ajax = (ajaxData) => {
    return new Promise((resolve, reject) => {
      $ajax(ajaxData).then(ret => {
        resolve(ret.data || {})
      }).catch(err => {
        reject(err)
      })
    })
  }
}
export default cosy