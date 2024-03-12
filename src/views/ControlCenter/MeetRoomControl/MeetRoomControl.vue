<script lang='ts' setup>
import { h, reactive, ref, onMounted } from 'vue'
import { Input, Button, Table, Pagination, message } from 'ant-design-vue'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons-vue'
import type { ColumnsType } from 'ant-design-vue/es/table'
import type { MeetingRoom } from '@/types/meetingRoom'

import EditMeetRoom from '@/components/MeetRoomList/EditMeetRoom.vue'

import { getMeetRoomList, deleteMeetRoom } from '@/api/meetingRoom-api'


onMounted(() => {
    getTableData()
})


const queryList = reactive({
    pageSize: 20,
    pageNum: 1,
    name: '',
    location: '',
    capacity: '',
    equipment: ''
})

//查询
function handleSearch() {
    queryList.pageNum = 1
    getTableData()
}


const loading = ref(false)
const columns: ColumnsType = [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        key: 'index',
        width: 60,
        customRender: ({ index }) => {
            return (queryList.pageNum - 1) * queryList.pageSize + index + 1
        }
    },
    {
        title: '会议室名称',
        dataIndex: 'name',
        align: 'center',
        key: 'name'
    },
    {
        title: '容量',
        dataIndex: 'capacity',
        align: 'center',
        key: 'capacity'
    },
    {
        title: '设备',
        dataIndex: 'equipment',
        align: 'center',
        key: 'equipment'
    },
    {
        title: '位置',
        dataIndex: 'location',
        align: 'center',
        key: 'location'
    },
    {
        title: '状态',
        dataIndex: 'isBooking',
        align: 'center',
        key: 'isBooking',
        customRender: ({ record }) => {
            return record.isBooking ? '已预定' : '未预定'
        }
    },
    {
        title: '操作',
        dataIndex: 'handle',
        align: 'center',
        key: 'handle',
    },
]
let tableData = reactive<MeetingRoom[]>([])
const totalCount = ref(0)

//获取表格数据
async function getTableData() {
    loading.value = true
    const res = await getMeetRoomList(queryList)
    const { code, message: msg, data } = res.data
    if (code === 200 || code === 201) {
        tableData = data.meetingRooms
        totalCount.value = data.totalCount
    } else {
        tableData = []
        totalCount.value = 0
    }
    loading.value = false
}


const showEdit = ref(false)
const editMeetRoom = ref<InstanceType<typeof EditMeetRoom>>()
//新增
function handleAdd() {
    showEdit.value = true
    editMeetRoom.value?.init()
}

//编辑
function handleEdit(data: MeetingRoom) {
    showEdit.value = true
    editMeetRoom.value?.init(data.id as number)
}

//删除
async function handleDelete(id: number) {
    const res = await deleteMeetRoom(id)
    const { code, message: msg, data } = res.data
    if (code === 200 || code === 201) {
        message.success(data)
        getTableData()
    } else {
        message.error(msg)
    }
}

</script>

<template>
    <div class="meet-room-control">
        <div class="search-container">
            <div class="search item">
                <Input v-model:value="queryList.name" placeholder="会议室名称" allowClear />
            </div>
            <div class="search item">
                <Input v-model:value="queryList.location" placeholder="会议室位置" allowClear />
            </div>
            <div class="search item">
                <Input v-model:value="queryList.capacity" placeholder="会议室容量" allowClear />
            </div>
            <div class="search item">
                <Input v-model:value="queryList.equipment" placeholder="会议室设备" allowClear />
            </div>
            <div class="btn item">
                <Button type="primary" :icon="h(SearchOutlined)" @click="handleSearch">查询</Button>
            </div>
            <div class="btn item">
                <Button type="primary" :icon="h(PlusOutlined)" @click="handleAdd">新增</Button>
            </div>
        </div>
        <div class="table-container">
            <Table :data-source="tableData" size="middle" :columns="columns" :loading="loading" :pagination="false"
                bordered :scroll="{ y: '500px' }">
                <template #bodyCell="{ column, record, index }">
                    <template v-if="column.key === 'handle'">
                        <Button type="link" @click="handleEdit(record as MeetingRoom)">编辑</Button>
                        <Button type="link" danger @click="handleDelete(record.id)">删除</Button>
                    </template>
                </template>
            </Table>
            <div class="pagination-container">
                <Pagination v-model:current="queryList.pageNum" v-model:page-size="queryList.pageSize"
                    :total="totalCount" show-size-changer @change="getTableData">
                </Pagination>
            </div>
        </div>
        <EditMeetRoom ref="editMeetRoom" @refreh="getTableData" v-model:show="showEdit" />
    </div>
</template>

<style scoped lang="scss">
.meet-room-control {
    width: 100%;
    height: 100%;
}
</style>