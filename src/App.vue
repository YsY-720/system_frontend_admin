<script setup lang="ts">
import zh_CN from 'ant-design-vue/lib/locale/zh_CN'
import { ConfigProvider } from 'ant-design-vue'
</script>

<template>
    <ConfigProvider :locale="zh_CN">
        <div class="main">
            <RouterView />
        </div>
    </ConfigProvider>

</template>

<style scoped lang="scss">
.main {
    height: 100vh;
    overflow: hidden;
}
</style>
