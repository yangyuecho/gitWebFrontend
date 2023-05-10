<script lang="ts">
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
import { defineComponent } from 'vue'
import { useStore } from '@/store.js'
import service from '@/utils'
import router from '@/router'

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
  methods: {
    getRepoContent() {
      let repoUuid = this.repoUuid
      let filePath = this.path
      console.log(repoUuid, filePath)
      const store = useStore()
      let self = this
      // console.log('sss', store.token)
      service({
        method: 'get',
        url: `/repo/${repoUuid}/tree`,
        headers: {
          Authorization: `Bearer ${store.token}`
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
    click(path: string, fileType: string) {
      console.log('click', this.repoUuid, path, fileType)
      if (fileType == 'file') {
        console.log('click', this.repoUuid, path, fileType)
        router.push({ name: 'repoFileMeta', params: { path: this.repoUuid, filePath: path } })
      } else if (fileType == 'dir') {
        // router.push({ name: 'repoTree', params: { path: this.repoUuid, filePath: path } })
      }
    }
  },
  mounted() {
    this.getRepoContent()
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
