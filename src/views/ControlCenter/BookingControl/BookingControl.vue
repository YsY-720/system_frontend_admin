<script lang='ts' setup>
import { reactive, h, ref, onMounted } from 'vue';
import { Input, Button, Table, Pagination, RangePicker } from 'ant-design-vue';
import { SearchOutlined, PlusOutlined, CheckCircleOutlined, CloseCircleOutlined, IssuesCloseOutlined } from '@ant-design/icons-vue';
import moment from 'moment';


import type { Booking } from '@/types/booking.type';
import type { ColumnsType } from 'ant-design-vue/es/table';
import type { Dayjs } from 'dayjs';

import { getBookingList } from '@/api/booking.api';

onMounted(() => {
    getTableData();
});

const queryList = reactive({
    pageSize: 20,
    pageNum: 1,
    username: '',
    startTime: '',
    endTime: '',
    meetingRoomName: '',
    meetingRoomPosition: ''
});
const timeRange = ref<[Dayjs, Dayjs]>();
function handleTimeChange(dates: [Dayjs, Dayjs] | [string, string], dateStrings: [string, string]) {
    if (dates && dates.length > 0) {
        queryList.startTime = (dates[0] as Dayjs).format('YYYY-MM-DD HH:mm:ss');
        queryList.endTime = (dates[1] as Dayjs).format('YYYY-MM-DD HH:mm:ss');
    } else {
        queryList.startTime = '';
        queryList.endTime = '';
    }
}

//查询
function handleSearch() {
    queryList.pageNum = 1;
    getTableData();
}

//新增
function handleAdd() {

}


const tableData = ref<Booking[]>([]);
const totalCount = ref(0);
const loading = ref(false);
const columns: ColumnsType = [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        key: 'index',
        width: 60,
        customRender: ({ index }) => {
            return (queryList.pageNum - 1) * queryList.pageSize + index + 1;
        }
    },
    {
        title: '会议室名称',
        dataIndex: 'room.name',
        align: 'center',
        key: 'name',
        customRender: ({ record }) => record.room.name
    },
    {
        title: '预定人',
        dataIndex: 'user.username',
        align: 'center',
        key: 'user.name',
        customRender: ({ record }) => record.user.nickName
    },
    {
        title: '会议室位置',
        dataIndex: 'user.room.location',
        align: 'center',
        key: 'user.room.location',
        customRender: ({ record }) => record.room.location
    },
    {
        title: '开始时间',
        dataIndex: 'startTime',
        align: 'center',
        key: 'startTime',
        customRender: ({ record }) => moment(record.startTime).format('YYYY-MM-DD HH:mm:ss')
    },
    {
        title: '结束时间',
        dataIndex: 'endTime',
        align: 'center',
        key: 'endTime',
        customRender: ({ record }) => moment(record.endTime).format('YYYY-MM-DD HH:mm:ss')
    },
    {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        key: 'status',
    },
    {
        title: '备注',
        dataIndex: 'note',
        align: 'center',
        key: 'note',
    },
    {
        title: '操作',
        dataIndex: 'handle',
        align: 'center',
        key: 'handle',
        width: '240px'
    },
];

async function getTableData() {
    const res = await getBookingList<{ bookings: Booking[], totalCount: number; }>(queryList);
    const { code, message: msg, data } = res.data;
    if (code === 200 || code === 201) {
        tableData.value = data.bookings;
        totalCount.value = data.totalCount;
    } else {
        tableData.value = [];
        totalCount.value = 0;
    }
}

</script>

<template>
    <div class="booking-container">
        <div class="search-container">
            <div class="search item">
                <Input v-model:value="queryList.meetingRoomName" placeholder="会议室名称" allowClear />
            </div>
            <div class="search item">
                <Input v-model:value="queryList.meetingRoomPosition" placeholder="会议室位置" allowClear />
            </div>
            <div class="search item" style="width: 350px">
                <RangePicker v-model:value="timeRange" showTime @change="handleTimeChange"></RangePicker>
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
                        <Button type="link" size="small" :icon="h(CheckCircleOutlined)">
                            通过
                        </Button>
                        <Button type="link" danger size="small" :icon="h(CloseCircleOutlined)">
                            驳回
                        </Button>
                        <Button type="link" danger size="small" :icon="h(IssuesCloseOutlined)">
                            解除
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

<style scoped lang="scss">
.booking-container {
    width: 100%;
    height: 100%;
}
</style>