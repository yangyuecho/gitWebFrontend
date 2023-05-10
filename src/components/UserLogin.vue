<script lang="ts">
import { useStore } from '@/store.js'
import { defineComponent } from 'vue'
import service from '@/utils'

export default defineComponent({
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login(event: any) {
      // 方法中的 `this` 指向当前活跃的组件实例
      console.log(`${this.username}, ${this.password}`)
      service({
        method: 'post',
        url: '/user/login',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          username: this.username,
          password: this.password
        }
      })
        .then(function (response) {
          console.log(response)
          let token = response.data.access_token
          // 调用函数 获得Store
          const store = useStore()
          store.token = token
          // console.log(token);
          // console.log(store, store.token);
        })
        .catch(function (error) {
          console.log(error)
          alert(error.response.data.detail)
        })
    }
  }
})
</script>

<template>
  <div>
    <p>Message is: {{ username }} {{ password }}</p>
    <input v-model="username" placeholder="请输入用户名" />
    <br />
    <input v-model="password" type="password" placeholder="请输入密码" />
    <button @click="login">登录</button>
  </div>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
