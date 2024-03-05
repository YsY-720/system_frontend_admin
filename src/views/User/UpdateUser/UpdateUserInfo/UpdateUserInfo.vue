<script lang='ts' setup>
import { onMounted, reactive, ref } from 'vue'
import { message, Form, FormItem, Input, Button, UploadDragger, type UploadChangeParam } from 'ant-design-vue'
import { InboxOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { useRouter } from 'vue-router'

import { getUserInfo, update_user_captcha, update_user } from '@/api/user-api'

const $router = useRouter()

const IMAGE_URL = import.meta.env.VITE_OSS_URL


const formData = reactive({
    nickName: '',
    headPic: '',
    captcha: '',
    phoneNumber: ''
})


const rules: Record<string, Rule[]> = {
    nickName: [{ required: true, message: ' ', trigger: 'change' }],
    email: [{ required: true, message: ' ', trigger: 'change' }],
    phoneNumber: [{ required: true, message: ' ', trigger: 'change' }],
    captcha: [{ required: true, message: ' ', trigger: 'change' }],

}

//文件上传
const fileList = ref([])

function uploadChange(info: UploadChangeParam) {
    const { status } = info.file
    if (status === 'done') {
        formData.headPic = info.file.response.data
        message.success(`${info.file.name} 文件上传成功`)
    } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败`)
    }
}

//初始化用户信息
onMounted(async () => {
    const res = await getUserInfo()
    const { code, message: msg, data } = res.data
    if (code === 200 || code === 201) {
        formData.nickName = data.nickName
        formData.headPic = data.headPic
        formData.phoneNumber = data.phoneNumber
    } else {
        message.error(msg)
    }
})

//获取验证码
async function getCaptCode() {
    countdown()
    const res = await update_user_captcha()
    const { code, message: msg, data } = res.data
    if (code === 200 || code === 201) {
        message.success(data)
    } else {
        message.error(msg)
    }
}

async function submit(params: typeof formData) {
    const res = await update_user(params)
    const { code, message: msg, data } = res.data
    if (code === 200 || code === 201) {
        message.success(data)
        await $router.replace('/control_center/meet_room_control')
    } else {
        message.error(msg)
    }
}

//按钮文字控制
let codeBtn = ref<string>('获取验证码')

function countdown() {
    let time = 60
    let timer = setInterval(() => {
        time -= 1
        codeBtn.value = `${time}秒后重试`
        if (time < 1) {
            clearInterval(timer)
            codeBtn.value = '获取验证码'
        }
    }, 1000)
}


</script>

<template>
    <div class="update-user-container">
        <div class="form-container">
            <Form :model="formData" layout="vertical" :rules="rules" @finish="submit">
                <FormItem label="头像" name="headPic">
                    <img v-show="formData.headPic && formData.headPic !== ''" class="avatar"
                        :src="`${IMAGE_URL}${formData.headPic}`" alt="">
                    <UploadDragger v-model:file-list="fileList" name="file" :multiple="false" action="/api/file/upload"
                        @change="uploadChange">
                        <p class="ant-upload-drag-icon">
                            <InboxOutlined></InboxOutlined>
                        </p>
                        <p class="ant-upload-text">单击或拖动文件到此区域进行上传</p>
                    </UploadDragger>
                </FormItem>
                <FormItem label="昵称" name="nickName">
                    <Input v-model:value="formData.nickName" />
                </FormItem>
                <FormItem label="电话号码" name="phoneNumber">
                    <Input v-model:value="formData.phoneNumber" />
                </FormItem>
                <FormItem label="验证码" name="captcha">
                    <div class="captcha-code">
                        <Input v-model:value="formData.captcha" />
                        <Button type="primary" :disabled="codeBtn !== '获取验证码'" @click="getCaptCode">
                            {{ codeBtn }}
                        </Button>
                    </div>
                </FormItem>
                <FormItem>
                    <Button type="primary" html-type="submit" style="width: 100%;">提交</Button>
                </FormItem>
            </Form>
        </div>

    </div>
</template>

<style scoped lang='scss'>
.update-user-container {
    width: 100%;
}

.form-container {
    width: 350px;
    margin: 20px auto;

    .avatar {
        width: 350px;
        height: 100%;
        margin-bottom: 4px;
    }
}

.captcha-code {
    width: 100%;
    display: flex;
    justify-content: space-between;

}

.captcha-code .ant-input {
    width: 65%;
}

.captcha-code .ant-btn {
    width: 30%;
}
</style>
