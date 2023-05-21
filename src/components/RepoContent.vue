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
    let tags: any = []
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
      currTag: this.$route.query?.tag,
      currCommit: currCommit,
      branches,
      commits,
      tags,
      currCommitObj,
      commitCount: 0
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
        tag: this.currTag,
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
        // console.log(self.currCommitObj, self.commits.length)
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
      router.push({
        name: 'CommitList',
        params: { path: this.repoUuid },
        query: { branch: this.$route.query.branch }
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
        let res = []
        for (let i = 0; i < response.data.length; i++) {
          let e = response.data[i]
          // 当没有选择分支和标签时, 选择 is_head 为 true 的分支
          if (e.is_head && !self.currBranch && !self.currTag) {
            self.currBranch = e.name
          }
          res.push(e)
        }
        self.branches = res
        console.log('tag', self.$route.query?.tag)
        if (!self.$route.query?.tag && self.$route.query?.branch != self.currBranch) {
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
    getTags() {
      let repoUuid = this.repoUuid
      let self = this
      const token = getToken()
      service({
        method: 'get',
        url: `/repo/${repoUuid}/tags`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(function (response) {
        self.tags = response.data
      })
    },
    gotoCompare() {
      router.push({
        name: 'compareDiff',
        params: { path: this.repoUuid }
        // query: { branch: this.$route.query.branch }
      })
    }
  },
  mounted() {
    this.getBranches()
    this.getTags()
    console.log('mounted', this.isLoading)
  },
  watch: {
    currBranch: {
      handler(newVal, oldVal) {
        console.log('branches changed', newVal, oldVal)
        if ((!oldVal && !this.currTag) || (this.currTag && !newVal)) {
          console.log('branches changed', '不触发')
          return
        }
        router.push({
          name: 'repoContent',
          params: { path: this.$route.params.path },
          query: { branch: this.currBranch }
        })
      }
    },
    currCommit: {
      handler(newVal, oldVal) {
        console.log('commit changed', this.currCommit, oldVal)
        // 默认是第一个 commit, 第一次切换 commit 时, 不触发
        if (!oldVal || this.currTag) {
          console.log('commit changed', '不触发')
          return
        }
        router.push({
          name: 'repoContent',
          params: { path: this.$route.params.path },
          query: { branch: this.$route.query.branch, commit: this.currCommit }
        })
      }
    },
    currTag: {
      handler(newVal, oldVal) {
        console.log('tag changed', this.currTag)
        this.currCommit = ''
        for (let i = 0; i < this.tags.length; i++) {
          let e = this.tags[i]
          if (e.tag == this.currTag) {
            this.currCommit = e.hash
            this.currCommitObj = e
            break
          }
        }
        router.push({
          name: 'repoContent',
          params: { path: this.$route.params.path },
          query: { tag: this.currTag, commit: this.currCommit }
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
      v-model:value="currTag"
      style="width: 120px"
      :options="tags.map((ele: any) => 
      { return ({ value: ele.tag })})"
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
      <a-badge status="processing" />
      <div @click="goToCommitList()">{{ commitCount }}</div>
    </a-descriptions-item>
    <a-descriptions-item>
      <a-button type="primary" html-type="submit" @click="gotoCompare()"
        >create pull request</a-button
      >
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
