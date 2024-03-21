import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'homePage',
            component: () => import('@/views/HomePage/HomePage.vue'),
            redirect: 'control_center',
            children: [
                {
                    path: 'control_center',
                    name: 'controlCenter',
                    component: () => import('@/views/ControlCenter/ControlCenter.vue'),
                    meta: { requireLogin: true },
                    children: [
                        {
                            path: 'meet_room_control',
                            name: 'meetRoomControl',
                            component: () => import('@/views/ControlCenter/MeetRoomControl/MeetRoomControl.vue'),
                            meta: { requireLogin: true }
                        },
                        {
                            path: 'booking_control',
                            name: 'bookingControl',
                            component: () => import('@/views/ControlCenter/BookingControl/BookingControl.vue'),
                            meta: { requireLogin: true }
                        },
                        {
                            path: 'user_control',
                            name: 'userControl',
                            component: () => import('@/views/ControlCenter/UserControl/UserControl.vue'),
                            meta: { requireLogin: true }
                        },
                        {
                            path: 'data_statistic',
                            name: 'dataStatistic',
                            component: () => import('@/views/ControlCenter/DataStatistic/DataStatistic.vue'),
                            meta: { requireLogin: true }
                        },
                    ]
                },
                {
                    path: 'update_user',
                    name: 'updateUser',
                    component: () => import('@/views/User/UpdateUser/UpdateUser.vue'),
                    children: [
                        {
                            path: 'update_user_info',
                            name: 'updateUserInfo',
                            component: () => import('@/views/User/UpdateUser/UpdateUserInfo/UpdateUserInfo.vue'),
                            meta: { requireLogin: true },
                        },
                        {
                            path: 'update_user_password',
                            name: 'updateUserPassword',
                            component: () => import('@/views/User/UpdateUser/UpdatePassword/UpdatePassword.vue'),
                            meta: { requireLogin: true },
                        }
                    ]
                }

            ]
        },
        {
            path: '/error',
            name: 'errorPage',
            component: () => import('@/views/ErrorPage/ErrorPage.vue'),

        },
        {
            name: 'login',
            path: '/login',
            component: () => import('@/views/User/Login/Login.vue'),

        },
    ]
});

router.beforeEach((to, from) => {
    let { requireLogin } = to.meta;
    let token = sessionStorage.getItem('token');
    if (requireLogin && !token) {
        return { name: 'login' };
    }
});

export default router;
