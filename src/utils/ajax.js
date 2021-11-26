import axios from "axios" /** 引入axios方法并定义全局 */
axios.defaults.withCredentials = true
import { getToken, removeToken } from "@/utils/auth"

const $ajax = (ajaxData) => {
  return new Promise((resolve, reject) => {
    /** 设置接口的 headers 携带登录后需要传递的token */
    let token = getToken()
    let tokenData = token ? { headers: { common: { token } } } : {}
    ajaxData.url = process.env.VUE_APP_URL + ajaxData.url
    axios(Object.assign(tokenData, ajaxData)).then(ret => {
      /** 判断是否登录，未登录直接跳转登录 */
      if (ret.data.code == 4) {
        removeToken()
        window.location.href = `/#/index.html`
      } else {
        resolve(ret)
      }
    }).catch(err => {
      reject({ msg: '服务器繁忙，请稍后重试~~' })
    })
  })
}
export default $ajax