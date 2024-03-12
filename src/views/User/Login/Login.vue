<script lang='ts' setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Form, FormItem, Input, InputPassword, Button, message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { LoginUserVo } from '@/types/user-login.type'
import { login } from '@/api/user-api'

const $router = useRouter()

const originalFormData = {
    username: '',
    password: ''
}
const formData = reactive({ ...originalFormData })
const rules: Record<string, Rule[]> = {
    username: [{ required: true, message: '账号不能为空', trigger: 'change' }],
    password: [{ required: true, message: '密码不能为空', trigger: 'change' }]
}

//登录
async function submit(value: typeof originalFormData) {
    try {
        const res = await login<LoginUserVo>(value)
        let { code, message: msg, data } = res.data
        if (code === 200 || code === 201) {
            message.success('登录成功')
            sessionStorage.setItem('token', data.accessToken)
            sessionStorage.setItem('refresh_token', data.refreshToken)
            sessionStorage.setItem('user_info', JSON.stringify(data.userInfo))
            setTimeout(() => $router.replace({ name: 'homePage' }), 1000)
        } else {
            message.error(msg)
        }
    } catch (e: any) {
        console.log(e)
    }
}
</script>

<template>
    <div class="login-container">
        <h1 class="title">会议室预定系统</h1>
        <div class="form-container">
            <Form :model="formData" layout="vertical" :rules="rules" @finish="submit">
                <FormItem label="账号" name="username">
                    <Input v-model:value="formData.username" />
                </FormItem>
                <FormItem label="密码" name="password">
                    <InputPassword v-model:value="formData.password" />
                </FormItem>
                <FormItem>
                    <Button type="primary" style="width: 100%;" html-type="submit">登录</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<style scoped lang="scss">
.login-container {
    width: 350px;
    margin: 5% auto;

    .title {
        text-align: center;
    }

    .form-container {
        padding-top: 16px;
    }
}
</style>
