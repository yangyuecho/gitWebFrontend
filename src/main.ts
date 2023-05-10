import '@/assets/main.css'
import Antd from 'ant-design-vue'
import { Button, message, Table } from 'ant-design-vue'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'

const app = createApp(App)
// app.config.productionTip = false;

app.use(createPinia())
// Pinia 是一个用于 Vue 的状态管理库
app.use(router)
app.use(Antd)

app.mount('#app')
