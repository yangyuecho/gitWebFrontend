<script lang="ts">
import { useStore } from '@/store.js'
import { defineComponent, reactive } from 'vue'
import { service, setToken } from '@/utils'

export default defineComponent({
  setup() {
    const formState = reactive({
      username: '',
      password: '',
      remember: true
    })
    const onFinish = (values: any) => {
      console.log('Success:', values)
    }
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo)
    }
    return {
      formState,
      onFinish,
      onFinishFailed
    }
  },
  methods: {
    login(event: any) {
      // 方法中的 `this` 指向当前活跃的组件实例
      console.log(`${this.formState.username}, ${this.formState.password}`)
      service({
        method: 'post',
        url: '/user/login',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          username: this.formState.username,
          password: this.formState.password
        }
      })
        .then(function (response) {
          console.log(response)
          let token = response.data.access_token
          // 调用函数 获得Store
          const store = useStore()
          store.token = token
          setToken(token)
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
  <br />
  <br />
  <br />
  <a-row type="flex" justify="space-around" align="middle">
    <a-col :span="3"> </a-col>
    <a-col :span="10">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        id="id-login-form"
      >
        <a-form-item
          label="Username"
          name="username"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>
        <!-- 
    <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
      <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
    </a-form-item> -->

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit" @click="login">登录</a-button>
        </a-form-item>
      </a-form>
    </a-col>
    <a-col :span="3"> </a-col>
  </a-row>
</template>

<style scoped></style>
