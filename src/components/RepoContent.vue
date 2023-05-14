<script lang="ts">
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
import { defineComponent, reactive } from 'vue'
import { useStore } from '@/store.js'
import {service, getToken, addQuery} from '@/utils'
import router from '@/router'
import { useRoute } from 'vue-router'

const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle', customRender: 'name' }
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type'
  }
]

export default defineComponent({
  data() {
    let data: any = []
    return {
      columns,
      data: data,
      isLoading: true,
      repoUuid: this.$route.params.path,
      path: this.$route.params.filePath,
    }
  },
  watch: {
    '$route' (to, from) {
      console.log('watch', to, from)
      // 对路由变化作出响应...
      // this.getRepoContent()
    }
  },
  methods: {
    getRepoContent() {
      let repoUuid = this.repoUuid
      let filePath = this.path ? this.path : ''
      console.log(repoUuid, filePath)
      let self = this
      const token = getToken()
      let queryDict = {
        branch: '',
        path: filePath
      }
      let url = `/repo/${repoUuid}/tree/`
      url = addQuery(url, queryDict)
      service({
        method: 'get',
        url: url,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(function (response) {
          console.log(response)
          for (let i = 0; i < response.data.length; i++) {
            self.data.push(response.data[i])
          }
          // console.log(self.data)
          self.isLoading = false
        })
        .catch(function (error) {
          // console.log(error)
        })
    },
    click(path: string, fileType: string) {
      // console.log('click', this.repoUuid, path, fileType)
      if (fileType == 'file') {
        console.log('click', this.repoUuid, path, fileType)
        router.push({ name: 'repoFileMeta', params: { path: this.repoUuid, filePath: path } })
      } else if (fileType == 'dir') {
        console.log('click', this.repoUuid, path, fileType)
        router.push({ name: 'repoTree', params: { path: this.repoUuid, filePath: path } })
      }
    },
    getCommits() {
      let repoUuid = this.repoUuid
      let filePath = this.path
      console.log(repoUuid, filePath)
      // const store = useStore()
      let self = this
      // console.log('sss', store.token)
      const token = getToken()
      service({
        method: 'get',
        url: `/repo/${repoUuid}/commits`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(function (response) {
          console.log(response)
          // for (let i = 0; i < response.data.length; i++) {
          //   self.data.push(response.data[i])
          // }
          // self.isLoading = false
        })
        .catch(function (error) {
          // console.log(error)
        })
    },
  },
  mounted() {
    this.getRepoContent()
    // this.getCommits()
    console.log('mounted', this.isLoading)
  },
  components: {
    SmileOutlined, // <a-icon type="smile" />
    DownOutlined // <a-icon type="down" />
  }
})
</script>

<template>
  <div v-if="!isLoading">
    <a-table :columns="columns" :data-source="data" rowKey="id">
      <template #name="{ record }">
        <a @click="click(record.path, record.type)">{{ record.name }}</a>
      </template>
      <template #customTitle>
        <span>
          <smile-outlined />
          Name
        </span>
      </template>
    </a-table>
  </div>
</template>
