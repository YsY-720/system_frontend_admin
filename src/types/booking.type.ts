export interface Booking {
    id: number,
    status: boolean,
    startTime: string,
    endTime: string,
    user: {
        id: boolean,
        nickName: string,
        username: string,
        email: string,
        phoneNumber: string;
    },
    room: {
        id: true,
        name: string,
        capacity: number,
        location: string,
        equipment: string,
        description: string,
        isBooked: boolean,
    };
}