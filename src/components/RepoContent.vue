<script lang="ts">
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
import { defineComponent, reactive } from 'vue'
import { useStore } from '@/store.js'
import { service, getToken, addQuery } from '@/utils'
import router from '@/router'
import { useRoute } from 'vue-router'

const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle', customRender: 'name' }
  },
  {
    title: '',
    dataIndex: 'commit_message',
    key: 'commit_message'
  },
  {
    title: '提交时间',
    dataIndex: 'commit_time',
    key: 'commit_time'
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
    let branches: any = []
    let commits: any = []
    let currCommitObj: any = {}
    let currCommit = this.$route.query?.commit
    // console.log(currCommitObj, commits.length)
    return {
      columns,
      data: data,
      isLoading: true,
      repoUuid: this.$route.params.path,
      path: this.$route.params.filePath,
      currBranch: this.$route.query?.branch,
      currCommit: currCommit,
      branches,
      commits,
      currCommitObj,
      commitCount: 0,
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
        branch: this.currBranch,
        commit: this.currCommit,
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
      }).then(function (response) {
        console.log(response)
        let res = []
        for (let i = 0; i < response.data.length; i++) {
          res.push(response.data[i])
        }
        self.data = res
        
        self.isLoading = false
        console.log(self.currCommitObj, self.commits.length)
      })
    },
    click(path: string, fileType: string) {
      // console.log('click', this.repoUuid, path, fileType)
      if (fileType == 'file') {
        // console.log('click', this.repoUuid, path, fileType)
        router.push({ name: 'repoFileMeta', params: { path: this.repoUuid, filePath: path } })
      } else if (fileType == 'dir') {
        // console.log('click', this.repoUuid, path, fileType)
        router.push({ name: 'repoTree', params: { path: this.repoUuid, filePath: path } })
      }
    },
    goToCommitList() {
      router.push({ name: 'CommitList', 
        params: { path: this.repoUuid},
        query: { branch: this.$route.query.branch}
      })
    },
    getCommits() {
      let repoUuid = this.repoUuid
      let filePath = this.path
      console.log(repoUuid, filePath)
      const token = getToken()
      let queryDict = {
        branch: this.currBranch,
        path: filePath
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
          if (!self.currCommit && i == 0) {
            self.currCommit = e.hash
            self.currCommitObj = e
          } else if (self.currCommit == e.hash) {
            self.currCommitObj = e
          }
          res.push(e)
          self.commitCount = i + 1
        }
        console.log('commits', self.commitCount)
        self.commits = res
        self.getRepoContent()
        // 获取数据
      })
    },
    getBranches() {
      let repoUuid = this.repoUuid
      let filePath = this.path
      console.log(repoUuid, filePath)
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
        if (self.$route.query?.branch != self.currBranch) {
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
        router.push({
          name: 'repoContent',
          params: { path: this.$route.params.path },
          query: { branch: this.currBranch }
        })
      }
    },
    currCommit: {
      handler() {
        console.log('commit changed', this.currCommit)
        router.push({
          name: 'repoContent',
          params: { path: this.$route.params.path },
          query: { branch: this.$route.query.branch, commit: this.currCommit}
        })
      }
    }
  },
  components: {
    SmileOutlined, // <a-icon type="smile" />
    DownOutlined // <a-icon type="down" />
  }
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
    <a-select
      v-model:value="currCommit"
      style="width: 120px"
      :options="commits.map((ele: any) => 
      { return ({ value: ele.hash })})"
    ></a-select>
  </a-space>
  
  <a-descriptions title="">
    <a-descriptions-item label="CommitMessage"> {{ currCommitObj.message }}</a-descriptions-item>
    <a-descriptions-item label="CommitTime">{{ currCommitObj.commit_time }}</a-descriptions-item>
    <!-- <a-descriptions-item label="commitHash"> {{ currCommitObj.hash }}</a-descriptions-item> -->
    <a-descriptions-item>
      <a-badge status="processing"/> 
      <div @click="goToCommitList()">{{ commitCount }}</div>
    </a-descriptions-item>
  </a-descriptions>

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
