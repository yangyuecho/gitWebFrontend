import axios from 'axios'
import router from '@/router'

function setToken(token: string) {
    localStorage.setItem('token', token)
}

function getToken() {
    return localStorage.getItem('token')
}

const service = axios.create({
  baseURL: '/api',
  timeout: 300000
})

service.interceptors.response.use(
  (response) => {
    console.log('response', response)
    return response
  },
  (error) => {
    const { response } = error
    console.log('error', response)
    let status = response.status
    if (status === 401) {
      router.replace({ name: 'login' })
    }
    // 判断是否执行自定义的错误处理方法 (接口配置 config 中, 自定义 transformResponse)
    // 否则, 执行默认接口错误处理
    //   const { useCustomMethod = false } = response.data || {};
    //   if (!useCustomMethod) {
    //     const errorCallback = {
    //       // 未登录
    //       401: () => {
    //         router.replace({ name: "login" });
    //       },
    //     };
    //     // 存在响应内容, 执行默认的错误处理方法
    //   }
    return Promise.reject(error)
  }
)

const addQuery = (url: string, query: any ) => {
    // console.log(`adding ${url} query: `, query)
    let queryStr = ''
    for (let key in query) {
        let value = query[key]
        if (value !== "" && value != null) {
            queryStr += `${key}=${value}&`
        }
    }
    queryStr = queryStr.slice(0, queryStr.length - 1)
    // console.log(`adding ${url} query: `, queryStr)
    return `${url}?${queryStr}`
}

// export default service

export { 
    setToken, 
    getToken,
    service,
    addQuery,
}

