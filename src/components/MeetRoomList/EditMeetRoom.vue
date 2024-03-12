<script lang='ts' setup>
import { computed, reactive, ref } from 'vue'
import { Modal, Form, FormItem, Input } from 'ant-design-vue'

import type { MeetingRoom } from '@/types/meetingRoom'
import type { Rule } from 'ant-design-vue/es/form'

const $props = defineProps({
    show: Boolean
})
const $emits = defineEmits(['update:show'])

let visible = computed({
    get: () => $props.show,
    set: val => $emits('update:show', val)
})

const originalFormData: MeetingRoom = {
    id: null,
    name: '',
    location: '',
    capacity: 0,
    equipment: ''
}

const form = ref<InstanceType<typeof Form> | null>(null)
const formData = reactive({ ...originalFormData })
const rules: Record<string, Rule[]> = {}

//提交
function handleSubmit() {
}

//关闭
function handleClose() {
    visible.value = false
}

</script>

<template>
    <Modal v-model:open="visible" title="编辑" @cancel="handleClose" @ok="handleSubmit" width="350px">
        <div class="dialog-container">
            <Form ref="form" :model="formData" layout="vertical" :rules="rules" @finish="handleSubmit">
                <FormItem label="会议室名称" name="name">
                    <Input v-model:value="formData.name" />
                </FormItem>
                <FormItem label="会议室容量" name="name">
                    <Input v-model:value="formData.capacity" />
                </FormItem>
                <FormItem label="会议室设备" name="name">
                    <Input v-model:value="formData.equipment" />
                </FormItem>
                <FormItem label="会议室位置" name="name">
                    <Input v-model:value="formData.location" />
                </FormItem>
            </Form>
        </div>
    </Modal>
</template>

<style scoped></style>