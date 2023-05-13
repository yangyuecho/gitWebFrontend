<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from '@/store.js'
import {service, getToken} from '@/utils'

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
        url: `/repo/${repoUuid}/deferred-metadata/?branch=main&path=${this.filePath}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(function (response) {
          self.content = response.data
          console.log(response)
        })
        .catch(function (error) {
          // console.log(error)
        })
    }
  },
  mounted() {
    this.getFileContent()
    console.log('mounted')
  },
})
</script>

<template>
  <div>{{content}}</div>
</template>
