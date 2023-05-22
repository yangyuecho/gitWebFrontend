<script lang="ts">
import { defineComponent, ref } from 'vue'
import { service, getToken, addQuery } from '@/utils'
import * as Diff2Html from 'diff2html'

export default defineComponent({
  data() {
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

    const options: any = [
      {
        id: 'branches',
        name: 'branches',
        type: 'category',
        children: []
      },
      {
        id: 'tags',
        name: 'tags',
        type: 'category',
        children: []
      }
    ]
    // console.log(options)
    let branches: any = []
    let commits: any = []
    let tags: any = []
    let base: string = ''
    let compare: string = ''
    return {
      repoUuid: this.$route.params.path,
      branches,
      commits,
      tags: tags,
      diffs: '',
      options,
      base,
      compare,
      isLoading: true,
      columns
    }
  },
  computed: {
    prettyHtml: function () {
      return Diff2Html.html(this.diffs, {
        drawFileList: true,
        matching: 'lines',
        outputFormat: 'side-by-side'
      })
    }
  },
  methods: {
    getdiff() {
      console.log('click', this.base, this.compare)
      if (this.base == '' || this.compare == '') {
        return
      }
      this.getCommits()
      let repoUuid = this.repoUuid
      let self = this
      const token = getToken()
      let queryDict = {
        base: this.base,
        compare: this.compare
      }
      let url = `/repo/${repoUuid}/compare/`
      url = addQuery(url, queryDict)
      service({
        method: 'get',
        url: url,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(function (response) {
        self.diffs = response.data
      })
    },
    getBranches() {
      let repoUuid = this.repoUuid
      let self = this
      const token = getToken()
      service({
        method: 'get',
        url: `/repo/${repoUuid}/branches`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(function (response) {
        // console.log('branch', response)
        for (let i = 0; i < response.data.length; i++) {
          let e = response.data[i]
          self.branches.push(e)
          self.options[0].children.push({
            id: e.name,
            name: e.name,
            type: 'branch'
          })
        }
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
        // console.log('tags', response)
        for (let i = 0; i < response.data.length; i++) {
          let e = response.data[i]
          self.options[1].children.push({
            id: e.tag,
            name: e.tag,
            type: 'tag'
          })
        }
      })
    },
    getCommits() {
      let repoUuid = this.repoUuid
      const token = getToken()
      let queryDict = {
        base: this.base,
        compare: this.compare
      }
      let url = `/repo/${repoUuid}/commits/compare/`
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
        self.commits = response.data.commits
        self.isLoading = false
        // 获取数据
      })
    },
    focus() {
      console.log('focus')
    },
    handleChangeA(value: string) {
      this.base = value
    },
    handleChangeB(value: string) {
      this.compare = value
    }
  },
  mounted() {
    this.getBranches()
    this.getTags()
  }
})
</script>

<style>
@import '~/diff2html/bundles/css/diff2html.min.css';
</style>

<template>
  <a-space>
    <a-select
      ref="select"
      style="width: 120px"
      :options="options"
      :field-names="{ label: 'name', value: 'id', options: 'children' }"
      @focus="focus"
      @change="handleChangeA"
    ></a-select>
    <a-select
      ref="select"
      style="width: 120px"
      :options="options"
      :field-names="{ label: 'name', value: 'id', options: 'children' }"
      @focus="focus"
      @change="handleChangeB"
    ></a-select>
  </a-space>
  <a-descriptions-item>
    <a-button type="primary" html-type="submit" @click="getdiff()">compare</a-button>
  </a-descriptions-item>

  <div v-if="!isLoading">
    <a-table :columns="columns" :data-source="commits" rowKey="hash"> </a-table>
  </div>

  <div v-html="prettyHtml"></div>
</template>
