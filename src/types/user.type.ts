export type User = {
    id: number
    username: string
    nickName: string
    email: string
    phoneNumber: string
    isFrozen: true
    headPic: string
    createTime: Date
}

//查询user列表参数
export type UserListQuery = {
    pageNum: number
    pageSize: number
    username?: string
    nickName?: string
    email?: string
}

//userList响应参数
export type UserList = {
    users: User[]
    totalCount: number
}

