<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from '@/store.js'
import { service, getToken } from '@/utils'
import router from '@/router'

export default defineComponent({
  data() {
    return {
      content: '',
      repoUuid: this.$route.params.path,
      filePath: this.$route.params.filePath
    }
  },
  methods: {
    getFileContent() {
      let repoUuid = this.repoUuid
      // const store = useStore()
      const token = getToken()
      console.log('sss', token)
      let self = this
      service({
        method: 'get',
        url: `/repo/${repoUuid}/deferred-metadata/?branch=&path=${this.filePath}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(function (response) {
        self.content = response.data
        console.log(response)
      })
    },
    history() {
      router.push({
        name: 'FileCommitList',
        params: { path: this.repoUuid, filePath: this.$route.params?.filePath },
      })
    }
  },
  mounted() {
    this.getFileContent()
    console.log('mounted')
  }
})
</script>

<template>
  <a-descriptions-item>
    <a-button type="primary" html-type="submit" @click="history()">history</a-button>
  </a-descriptions-item>
  <div>{{ content }}</div>
</template>
