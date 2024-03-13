<script lang='ts' setup>
import { computed, reactive, ref } from 'vue'
import { Modal, Form, FormItem, Input, message, Textarea } from 'ant-design-vue'

import type { MeetingRoom } from '@/types/meetingRoom'
import type { Rule } from 'ant-design-vue/es/form'

import { getMeetRoomById, updateMeetRoom, addMeetRoom } from '@/api/meetingRoom-api'

const $props = defineProps({
    show: Boolean
})
const $emits = defineEmits(['update:show', 'refreh'])

let visible = computed({
    get: () => $props.show,
    set: val => $emits('update:show', val)
})
const mode = ref('编辑')

const originalFormData: MeetingRoom = {
    id: null,
    name: '',
    location: '',
    capacity: 0,
    equipment: '',
    description: ''
}

const form = ref()
const formData = ref<MeetingRoom>({ ...originalFormData })
const rules: Record<string, Rule[]> = {
    name: [{ required: true, message: ' ', trigger: 'change' }],
    location: [{ required: true, message: ' ', trigger: 'change' }],
    capacity: [{ required: true, message: ' ', trigger: 'change' }],
    equipment: [{ required: true, message: ' ', trigger: 'change' }],
}

//初始化
async function init(id?: number) {
    if (id) {
        mode.value = '编辑'
        const res = await getMeetRoomById(id)
        const { code, message: msg, data } = res.data
        if (code === 200 || code == 201) {
            formData.value = data
        } else {
            formData.value = { ...originalFormData }
        }
    } else {
        mode.value = '新增'
    }

}

//提交
async function handleSubmit() {
    form.value.validate().then(async () => {
        if (mode.value === '新增') handleAdd()
        if (mode.value === '编辑') handleEdit()
    }).catch((error: any) => {
        console.log(error)
    })
}
//新增
async function handleAdd() {
    const res = await addMeetRoom(formData.value)
    const { code, message: msg, data } = res.data
    if (code === 200 || code === 201) {
        console.log(data)
        message.success('新增成功')
        setTimeout(() => {
            handleClose()
            $emits('refreh')
        }, 500)
    } else {
        message.error(msg)
    }
}

//编辑
async function handleEdit() {
    const res = await updateMeetRoom(formData.value)
    const { code, message: msg, data } = res.data
    if (code === 200 || code === 201) {
        console.log(data)
        message.success('更新成功')
        setTimeout(() => {
            handleClose()
            $emits('refreh')
        }, 500)
    } else {
        message.error(msg)
    }
}


//关闭
function handleClose() {
    visible.value = false
    formData.value = { ...originalFormData }
}

defineExpose({ init })

</script>

<template>
    <Modal v-model:open="visible" :title="mode" @cancel="handleClose" @ok="handleSubmit" width="450px">
        <div class="dialog-container">
            <Form ref="form" :model="formData" layout="vertical" :rules="rules">
                <FormItem label="会议室名称" name="name">
                    <Input v-model:value="formData.name" />
                </FormItem>
                <FormItem label="会议室容量" name="capacity">
                    <Input v-model:value="formData.capacity" />
                </FormItem>
                <FormItem label="会议室设备" name="equipment">
                    <Input v-model:value="formData.equipment" />
                </FormItem>
                <FormItem label="会议室位置" name="location">
                    <Input v-model:value="formData.location" />
                </FormItem>
                <FormItem label="描述" name="description">
                    <Textarea v-model:value="formData.description" :auto-size="{ minRows: 2, maxRows: 5 }" />
                </FormItem>
            </Form>
        </div>
    </Modal>
</template>

<style scoped></style>