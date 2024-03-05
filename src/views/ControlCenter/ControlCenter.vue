<script lang='ts' setup>
import { GroupOutlined, AppstoreOutlined, TeamOutlined, GoldOutlined } from '@ant-design/icons-vue'
import { Menu, } from 'ant-design-vue'
import type { ItemType } from 'ant-design-vue'
import { h, reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const $router = useRouter()

const selectedKeys = ref<string[]>()

const menuItem: ItemType[] = reactive([
    { label: '会议室管理', key: 'meet_room_control', icon: () => h(GroupOutlined) },
    { label: '预定管理', key: 'booking_control', icon: () => h(GoldOutlined) },
    { label: '用户管理', key: 'user_control', icon: () => h(TeamOutlined) },
    { label: '数据统计', key: 'data_statistic', icon: () => h(AppstoreOutlined) },
])
function menuSelected({ key }: { key: any }) {
    $router.push('/control_center/' + key)
}
onMounted(() => {
    selectedKeys.value = ['meet_room_control']
    menuSelected({ key: 'meet_room_control' })
})
</script>

<template>
    <div class="control-center-container">
        <div class="menu">
            <Menu :items="menuItem" mode="inline" v-model:selectedKeys="selectedKeys" @select="menuSelected"
                style="height: 100%;">

            </Menu>
        </div>
        <div class="view">
            <RouterView></RouterView>
        </div>
    </div>
</template>

<style scoped lang="scss">
.control-center-container {
    width: 100%;
    height: 100%;
    display: flex;

    .menu {
        height: 100%;
        width: 220px;
    }

    .view {
        width: calc(100% - 220px);
        height: 100%;
        padding: 8px;
    }
}
</style>