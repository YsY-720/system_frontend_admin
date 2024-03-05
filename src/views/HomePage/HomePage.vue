<script lang='ts' setup>
import { reactive } from 'vue'
import { Dropdown, Menu, MenuItem, MenuDivider } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import type { UserInfo } from '@/types/user-login.type'

const IMAGE_URL = import.meta.env.VITE_OSS_URL

const userInfo = reactive<UserInfo>({
    ...JSON.parse(sessionStorage.getItem('user_info') as string)
})

const $router = useRouter()
async function toAccountInfo() {
    await $router.replace('/update_user/update_user_info')
}

async function backPage() {
    await $router.replace('/control_center/meet_room_control')
}

function loginOut() {
    $router.push('/login')
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    console.log(import.meta.env)

}

</script>

<template>
    <div class="home-container">
        <div class="title">
            <h1 class="text" @click="backPage">会议室预定系统</h1>
            <Dropdown trigger="click" placement="bottom" arrow>
                <img class="avatar" :src="`${IMAGE_URL}${userInfo.headPic}`" alt="">
                <template #overlay>
                    <Menu style="width: 120px;">
                        <div class="name">welcome {{ userInfo.nickName }}!</div>
                        <MenuDivider />
                        <MenuItem :key="1" @click="toAccountInfo">
                        <div class="item">个人信息</div>
                        </MenuItem>
                        <MenuItem :key="2" @click="loginOut">
                        <div class="item">退出登录</div>
                        </MenuItem>
                    </Menu>
                </template>
            </Dropdown>
        </div>
        <div class="content">
            <RouterView></RouterView>
        </div>
    </div>
</template>

<style scoped lang="scss">
.home-container {
    margin: 5% auto;
    width: 60%;
    height: 85%;


    .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #E5E5E5;

        .avatar {
            height: 32px;
            width: 32px;
            border-radius: 50%;
        }

        .text {
            cursor: pointer;
        }

        .item {
            text-align: center;
        }
    }

    .content {
        height: calc(100% - 55px);
        overflow: overlay;
        overflow-x: hidden;
    }
}

.name {
    text-align: center;
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>