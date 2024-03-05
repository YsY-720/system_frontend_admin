import request from '@/utils/request'
import type { Register } from '@/types/user-register.type'
import type { UserInfo } from '@/types/user-login.type'
import type { UserList, UserListQuery } from '@/types/user.type'

//管理员登录
export function login<T = any>(data: { username: string, password: string }) {
    return request.post<T>('/user/admin/login', data)
}

//修改管理员密码
export function update_password<T = any>(data: Register) {
    return request.post<T>('/user/update_password', data)
}

//修改管理员信息
export function update_user<T = string>(data: { nickName: string, headPic: string, captcha: string }) {
    return request.post('/user/admin/update', data)
}

//获取当前登录用户信息
export function getUserInfo<T = UserInfo>() {
    return request.get<T>('/user/info')
}

//修改密码-获取验证码
export function update_password_captcha<T = string>(email: string) {
    return request.get<T>('/user/update_password/captcha?email=' + email)
}

//修改信息-获取验证码
export function update_user_captcha<T = string>() {
    return request.get<T>('/user/update_user/captcha')
}

//获取用户列表
export function get_user_list<T = UserList>(data: UserListQuery) {
    return request.get<T>(`/user/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}&username=${data.username}&nickName=${data.nickName}&email=${data.email}`)
}

//冻结用户
export function frozen_user<T = string>({ id, isFrozen }: { id: number, isFrozen: number }) {
    return request.get<T>(`/user/freeze?id=${id}&isFrozen=${isFrozen}`)
}
