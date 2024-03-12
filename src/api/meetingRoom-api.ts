import type { MeetingRoom } from "@/types/meetingRoom"
import request from "@/utils/request"

//获取会议室列表
export function get_meet_room_list(data: Record<string, any>) {
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