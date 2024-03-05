<script lang='ts' setup>
import { reactive, ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, } from 'ant-design-vue'
import { SolutionOutlined, SafetyOutlined } from '@ant-design/icons-vue'
import type { ItemType } from 'ant-design-vue'

const $router = useRouter()

//导航菜单列表
const menuItem: ItemType[] = reactive([
    { label: '修改信息', key: 'update_user_info', icon: () => h(SolutionOutlined) },
    { label: '修改密码', key: 'update_user_password', icon: () => h(SafetyOutlined) },
])

//导航默认选中项
const selectedKeys = ref<string[]>(['update_user_info'])

//导航切换
async function menuSelected({ key }: { key: any }) {
    await $router.push('/update_user/' + key)
}
</script>

<template>
    <div class="update-user-container">
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
.update-user-container {
    width: 100%;
    height: 80%;
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