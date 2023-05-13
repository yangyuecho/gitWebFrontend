<script lang="ts">
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
import { defineComponent, watch } from 'vue'
import { useStore } from '@/store.js'
import {service, getToken} from '@/utils'
import router from '@/router'

const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle', customRender: 'name' }
  },
  {
    title: 'Action',
    key: 'action',
    slots: { customRender: 'action' }
  },
  {
    title: 'Uniuqe Name',
    dataIndex: 'unique_name',
    key: 'uniqueName'
  }
]

export default defineComponent({
  data() {
    let data: any = []
    return {
      columns,
      data: data,
      isLoading: true
    }
  },
  methods: {
    getRepos() {
    //   const store = useStore()
      const token = getToken()
      let self = this
      console.log('sss', token)
      service({
        method: 'get',
        url: '/repo/',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(function (response) {
          console.log(response)
          for (let i = 0; i < response.data.length; i++) {
            self.data.push(response.data[i])
          }
          self.isLoading = false
        })
        .catch(function (error) {
          // console.log(error)
        })
    },
    click_repo(uniqueName: string) {
      console.log('click_repo', uniqueName)
      router.push({ name: 'repoContent', params: { path: uniqueName } })
    }
  },
  mounted() {
    this.getRepos()
    console.log('mounted', this.isLoading)
  },
  components: {
    SmileOutlined,
    DownOutlined
  }
})
</script>

<template>
  <div v-if="!isLoading">
    <a-table :columns="columns" :data-source="data" rowKey="id">
      <template #name="{ record }">
        <a @click="click_repo(record.unique_name)">{{ record.name }}</a>
      </template>
      <template #customTitle>
        <span>
          <smile-outlined />
          Name
        </span>
      </template>
      <!-- <template #tags="{ text: tags }">
      <span>
        <a-tag
          v-for="tag in tags"
          :key="tag"
          :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
        >
          {{ tag.toUpperCase() }}
        </a-tag>
      </span>
    </template> -->
      <template #action="{ record }">
        <span>
          <a>onwer: {{ record.name }}</a>
          <a-divider type="vertical" />
          <a>Delete</a>
          <a-divider type="vertical" />
          <a class="ant-dropdown-link">
            More actions
            <down-outlined />
          </a>
        </span>
      </template>
    </a-table>
  </div>
</template>
