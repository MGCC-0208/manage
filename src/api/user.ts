import request from "../../utils/request"

const BASE_URI = "localhost:8080"

export function getUserList(data: { page: number; size: number; username?: string }) {
    return request.get(`/users`, data);
};

export function createUser(data: { username: string; phone: string; gender: string; age: number; cities: string;
    detailedAddress: string; address: string }) {
    return request.post(`/users`, data);
}

export function updateUser(userId: number, data: { username: string; phone: string; gender: string; age: number; cities: string;
    detailedAddress: string; address: string }) {
    return request.post(`${BASE_URI}/users`, data);
}

export function deleteUser(userId: number) {
    return request.post(`${BASE_URI}/users`, userId);
}

export function disableUser(userId: number) {
    return request.post(`${BASE_URI}/users`, userId);
}

export function enableUser(userId: number) {
    return request.post(`${BASE_URI}/users`, userId);
}
