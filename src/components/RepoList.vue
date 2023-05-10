<script lang="ts">
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
import { defineComponent, watch } from 'vue'
import { useStore } from '@/store.js'
import service from '@/utils'
// import { reactive } from 'vue'

const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle', customRender: 'name' }
  },
  //   {
  //     title: 'Address',
  //     dataIndex: 'address',
  //     key: 'address'
  //   },
  //   {
  //     title: 'Tags',
  //     key: 'tags',
  //     dataIndex: 'tags',
  //     slots: { customRender: 'tags' }
  //   },
  {
    title: 'Action',
    key: 'action',
    slots: { customRender: 'action' }
  }
]

export default defineComponent({
  data() {
    let data: any = []
    return {
      columns,
      data: data,
      isLoading: false
    }
  },
  methods: {
    getRepos() {
      const store = useStore()
      let self = this
      console.log('sss', store.token)
      service({
        method: 'get',
        url: '/repo/',
        headers: {
          Authorization: `Bearer ${store.token}`
        }
      })
        .then(function (response) {
          console.log(response)
          for (let i = 0; i < response.data.length; i++) {
            self.data.push(response.data[i])
          }
          // self.data = self.data.concat(response.data)
          self.isLoading = false
        })
        .catch(function (error) {
          // console.log(error)
        })
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
    <a-table :columns="columns" :data-source="data">
      <template #name="{ text }">
        <a>{{ text }}</a>
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
