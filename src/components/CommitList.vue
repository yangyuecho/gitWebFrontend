<script lang="ts">
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
import { defineComponent, reactive } from 'vue'
import { useStore } from '@/store.js'
import { service, getToken, addQuery } from '@/utils'
import router from '@/router'
import { useRoute } from 'vue-router'

const columns = [
  {
    title: 'message',
    dataIndex: 'message',
    key: 'message'
  },
  {
    title: 'author_name',
    dataIndex: 'author_name',
    key: 'author_name'
  },
  {
    title: 'commit_time',
    dataIndex: 'commit_time',
    key: 'commit_time'
  },
  // {
  //   dataIndex: 'name',
  //   key: 'name',
  //   slots: { title: 'customTitle', customRender: 'name' }
  // },
  {
    dataIndex: 'hash',
    key: 'hash',
    title: 'hash'
  }
]

export default defineComponent({
  data() {
    let data: any = []
    let branches: any = []
    let commits: any = []
    return {
      columns,
      data: data,
      isLoading: true,
      repoUuid: this.$route.params.path,
      currBranch: this.$route.query?.branch,
      branches,
      commits
    }
  },
  methods: {
    getCommits() {
      let repoUuid = this.repoUuid
      const token = getToken()
      let queryDict = {
        branch: this.currBranch,
        path: this.$route.params?.filePath,
      }
      let url = `/repo/${repoUuid}/commits`
      url = addQuery(url, queryDict)
      let self = this
      service({
        method: 'get',
        url: url,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(function (response) {
        console.log('commits', response)
        // 第一个 commit 是当前 commit
        let res = []
        for (let i = 0; i < response.data.commits.length; i++) {
          let e = response.data.commits[i]
          res.push(e)
        }
        self.data = res
        self.isLoading = false
        // 获取数据
      })
    },
    getBranches() {
      let repoUuid = this.repoUuid
      // const store = useStore()
      let self = this
      // console.log('sss', store.token)
      const token = getToken()
      service({
        method: 'get',
        url: `/repo/${repoUuid}/branches`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(function (response) {
        console.log('branch', response)
        // 在列表中显示分支, 默认是 is_head 为 true 的分支, 如果没有选择分支的话, 需要修改默认值
        for (let i = 0; i < response.data.length; i++) {
          let e = response.data[i]
          if (e.is_head && !self.currBranch) {
            self.currBranch = e.name
          }
          self.branches.push(e)
        }
        if (self.$route.query?.branch != self.currBranch && !self.$route.params?.filePath) {
          // 修改路由
          router.push({
            name: 'repoContent',
            params: { path: self.$route.params.path },
            query: { branch: self.currBranch }
          })
        }
        // 获取数据
        self.getCommits()
      })
    },
    goToDiff(commit: string) {
      // console.log('goToDiff', commit)
      router.push({
        name: 'commitDiff',
        params: { path: this.$route.params.path },
        query: { branch: this.$route.query.branch, commit: commit }
      })
    }
  },
  mounted() {
    this.getBranches()
    console.log('mounted', this.isLoading)
  },
  watch: {
    currBranch: {
      handler() {
        console.log('branches changed', this.currBranch)
        if (this.$route.params?.filePath) {
          router.push({
            name: 'FileCommitList',
            params: { path: this.$route.params.path, filePath: this.$route.params?.filePath },
            query: { branch: this.currBranch }
          })
        } else {
        router.push({
          name: 'CommitList',
          params: { path: this.$route.params.path },
          query: { branch: this.currBranch }
        })}
      }
    }
  },
})
</script>

<template>
  <a-space>
    <a-select
      v-model:value="currBranch"
      style="width: 120px"
      :options="branches.map((ele: any) => 
      { return ({ value: ele.name })})"
    ></a-select>
  </a-space>

  <div v-if="!isLoading">
    <a-table :columns="columns" :data-source="data" rowKey="hash">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'hash'">
          <a @click="goToDiff(record.hash)">
            {{ record.hash }}
          </a>
        </template>
      </template>
    </a-table>
  </div>
</template>
