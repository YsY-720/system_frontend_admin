export interface MeetingRoom {
    id?: number | null,
    name: string
    capacity: number
    location: string
    equipment: string
    description?: string
    isBooked?: boolean
    createTime?: Date
    updateTime?: Date
}