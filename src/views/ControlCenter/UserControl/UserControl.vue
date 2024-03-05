<script lang='ts' setup>
import { reactive, onMounted, ref, h } from 'vue'
import { Input, Button, Table, Pagination, message, Image, Tag } from 'ant-design-vue'
import { UserDeleteOutlined, SearchOutlined } from '@ant-design/icons-vue'
import moment from 'moment'
import type { ColumnsType } from 'ant-design-vue/es/table'
import type { UserListQuery, User } from '@/types/user.type'

import { get_user_list, frozen_user } from '@/api/user-api'

const IMAGE_URL = import.meta.env.VITE_OSS_URL
//筛选条件
const queryList: UserListQuery = reactive({
    pageSize: 20,
    pageNum: 1,
    username: '',
    nickName: '',
    email: ''
})

//查询
function handleSearch() {
    queryList.pageNum = 1
    getTableData()
}

//表格数据
const loading = ref<boolean>(false)
const tableData = ref<User[]>([])
const totalCount = ref<number>(0)

//表格列
const columns: ColumnsType = [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        key: 'index',
        width: 50,
        customRender: ({ index }) => {
            return (queryList.pageNum - 1) * queryList.pageSize + index + 1
        }
    },
    {
        title: '用户名',
        dataIndex: 'username',
        align: 'center'
    },
    {
        title: '昵称',
        dataIndex: 'nickName',
        align: 'center'
    },
    {
        title: '头像',
        dataIndex: 'headPic',
        align: 'center',
        key: 'headPic'
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        align: 'center'
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        align: 'center',
        key: 'createTime',
        customRender: ({ record }) => {
            return moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')
        }
    },
    {
        title: '状态',
        dataIndex: 'isFrozen',
        align: 'center',
        key: 'isFrozen',
        customRender: ({ text, record, index, column }) => {
            return h(Tag, { color: record.isFrozen ? '#CD201F' : '#55ACEE' }, record.isFrozen ? '冻结' : '正常')
        }
    },
    {
        title: '操作',
        dataIndex: 'controls',
        align: 'center',
        key: 'controls'
    }
]

//获取表格数据
async function getTableData() {
    loading.value = true
    const res = await get_user_list(queryList)
    const { code, message: msg, data } = res.data
    if (code === 200 || code === 201) {
        tableData.value = data.users
        totalCount.value = data.totalCount
    } else {
        tableData.value = []
        totalCount.value = 0
    }
    loading.value = false
}

//冻结用户
async function handleFreezUser(user: User, isFrozen: number) {
    const res = await frozen_user({ id: user.id, isFrozen })
    const { code, message: msg, data } = res.data
    if (code === 200 || code === 201) {
        message.success(data)
        handleSearch()
    } else {
        message.success(msg)
    }
}


onMounted(() => {
    getTableData()
})

</script>

<template>
    <div class="user-control-container">
        <div class="search-container">
            <div class="item search">
                <Input v-model:value="queryList.username" placeholder="请输入用户名" />
            </div>
            <div class="item search">
                <Input v-model:value="queryList.nickName" placeholder="请输入用户昵称" />
            </div>
            <div class="item search">
                <Input v-model:value="queryList.email" placeholder="请输入用户邮箱" />
            </div>
            <div class="item btn">
                <Button type="primary" @click="handleSearch" :icon="h(SearchOutlined)">查询</Button>
            </div>
        </div>
        <div class="table-container">
            <Table :data-source="tableData" size="middle" :columns="columns" :loading="loading" :pagination="false"
                bordered :scroll="{ y: '500px' }">
                <template #bodyCell="{ column, record, index }">
                    <template v-if="column.key === 'headPic'">
                        <Image v-if="record.headPic && record.headPic !== ''" :src="IMAGE_URL + record.headPic"
                            height="30px" width="30px" :previewMask='false'>
                        </Image>
                        <span v-else>暂无图片</span>
                    </template>

                    <template v-if="column.key === 'controls'">
                        <Button v-if="!record.isFrozen" :icon="h(UserDeleteOutlined)" type="text" size="small" danger
                            @click="handleFreezUser(record as User, 1)">
                            冻结
                        </Button>
                        <Button v-else :icon="h(UserDeleteOutlined)" type="link" size="small"
                            @click="handleFreezUser(record as User, 0)">
                            解除冻结
                        </Button>
                    </template>
                </template>
            </Table>
            <div class="pagination-container">
                <Pagination v-model:current="queryList.pageNum" v-model:page-size="queryList.pageSize"
                    :total="totalCount" show-size-changer @change="getTableData">
                </Pagination>
            </div>
        </div>
    </div>
</template>

<style scoped>
.user-control-container {
    height: 100%;
    width: 100%;
}
</style>