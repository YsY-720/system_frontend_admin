<script lang='ts' setup>
import { reactive, onMounted, ref, computed } from 'vue'
import { Input, Button, Table } from 'ant-design-vue'
import moment from 'moment'
import type { ColumnsType } from 'ant-design-vue/es/table'
import type { UserListQuery, User } from '@/types/user.type'

import { get_user_list } from '@/api/user-api'
//筛选条件
const queryList: UserListQuery = reactive({
    pageSize: 20,
    pageNum: 1,
    username: '',
    nickName: '',
    email: ''
})

//表格数据
const tableData = ref<User[]>([])
const totalCount = ref<number>(0)
const pagination = computed(() => ({
    total: totalCount.value,
    current: queryList.pageNum,
    pageSize: queryList.pageSize,
}))


//表格列
const columns: ColumnsType = [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        key: 'index'
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
        align: 'center'
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
        key: 'createTime'
    }
]

async function getTableData() {
    const res = await get_user_list(queryList)
    const { code, message: msg, data } = res.data
    if (code === 200 || code === 201) {
        tableData.value = data.users
        totalCount.value = data.totalCount
    } else {
        tableData.value = []
        totalCount.value = 0
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
                <Button type="primary" @click="getTableData">查询</Button>
            </div>
        </div>
        <div class="table-container">
            <Table :data-source="tableData" size="middle" :columns="columns" :pagination="pagination" bordered>
                <template #bodyCell="{ column, record, index }">
                    <template v-if="column.key === 'index'">
                        {{ (queryList.pageNum - 1) * queryList.pageSize + index + 1 }}
                    </template>

                    <template v-if="column.key === 'createTime'">
                        {{ moment(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                </template>
            </Table>
        </div>
    </div>
</template>

<style scoped>
.user-control-container {
    height: 100%;
    width: 100%;
}
</style>