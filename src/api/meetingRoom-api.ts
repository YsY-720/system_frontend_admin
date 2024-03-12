import type { MeetingRoom } from "@/types/meetingRoom"
import request from "@/utils/request"

//获取会议室列表
export function getMeetRoomList(data: Record<string, any>) {
    return request.get<{ meetingRooms: MeetingRoom[], totalCount: number }>(
        '/meeting-room/list?' +
        `pageSize=${data.pageSize}` +
        `&pageNum=${data.pageNum}` +
        `&name=${data.name}` +
        `&location=${data.location}` +
        `&capacity=${data.capacity}` +
        `&equipment=${data.equipment}`
    )
}
//新增会议室
export function addMeetRoom(data: MeetingRoom) {
    return request.post('/meeting-room/create', data)
}

//根据id查询会议室
export function getMeetRoomById(id: number) {
    return request.get<MeetingRoom>('/meeting-room/' + id)
}

//修改会议室信息
export function updateMeetRoom(data: MeetingRoom) {
    return request.post<MeetingRoom>('/meeting-room/update', data)
}

//删除会议室
export function deleteMeetRoom(id: number) {
    return request.delete('/meeting-room/' + id)
}