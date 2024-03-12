<script lang='ts' setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Form, FormItem, Input, InputPassword, Button, message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'

import {
    update_password_captcha,
    update_admin_password,
    get_user_info
} from '@/api/user-api'

const $router = useRouter()


//初始化用户信息
onMounted(async () => {
    const res = await get_user_info()
    const { code, message: msg, data } = res.data
    if (code === 200 || code === 201) {
        formData.username = data.username
        formData.email = data.email
    } else {
        message.error(msg)
    }
})



const originalFormData = {
    username: '',
    password: '',
    checkPassword: '',
    email: '',
    captcha: ''
}

const rules: Record<string, Rule[]> = {
    username: [{ required: true, message: ' ', trigger: 'change' }],
    nickName: [{ required: true, message: ' ', trigger: 'change' }],
    password: [{ required: true, message: ' ', trigger: 'change' }],
    email: [{ required: true, message: ' ', trigger: 'change' }],
    checkPassword: [
        { required: true, message: ' ', trigger: 'change' },
        { validator: checkPassword, trigger: 'blur' }
    ],
    captcha: [{ required: true, message: ' ', trigger: 'change' }],
}

//密码校验
async function checkPassword(_rule: Rule, value: string) {
    if (value === formData.password) {
        return Promise.resolve()
    } else {
        return Promise.reject('密码不一致')
    }
}

const formData = reactive({ ...originalFormData })
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

async function getCaptCode() {
    if (!formData.email || formData.email === '') {
        message.warn('请先填写邮箱地址')
        return
    }
    countdown()
    const res = await update_password_captcha(formData.email)
    let { code, message: msg, data } = res.data
    if (code === 200 || code === 201) {
        message.success(data)
    } else {
        message.error(msg)
    }
}

//提交
async function submit(values: typeof originalFormData) {
    const res = await update_admin_password(formData)
    const { code, message: msg, data } = res.data
    if (code === 200 || code === 201) {
        message.success(data)
        setTimeout(() => {
            sessionStorage.removeItem('token')
            $router.replace('/login')
        }, 1000)
    } else {
        message.error(msg)
    }
}

</script>

<template>
    <div class="update-password-container">
        <div class="form-container">
            <Form :model="formData" layout="vertical" :rules="rules" @finish="submit">
                <FormItem label="新的密码" name="password">
                    <InputPassword v-model:value="formData.password"></InputPassword>
                </FormItem>
                <FormItem label="确认密码" name="checkPassword">
                    <InputPassword v-model:value="formData.checkPassword"></InputPassword>
                </FormItem>
                <FormItem label="邮箱" name="email">
                    <Input v-model:value="formData.email" disabled></Input>
                </FormItem>
                <FormItem label="验证码" name="captcha">
                    <div class="captcha-code">
                        <Input v-model:value="formData.captcha"></Input>
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

<style scoped lang="scss">
.update-password-container {
    width: 100%;

    .form-container {
        width: 350px;
        margin: 20px auto;

        .captcha-code {
            width: 100%;
            display: flex;
            justify-content: space-between;

            .ant-input {
                width: 65%;
            }

            .ant-btn {
                width: 30%;
            }
        }
    }
}
</style>