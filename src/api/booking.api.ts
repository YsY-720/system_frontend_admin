import request from "@/utils/request";

//预定列表
export function getBookingList<T = any>(data: Record<string, any>) {
    return request.post<T>('/booking/list', data);
}