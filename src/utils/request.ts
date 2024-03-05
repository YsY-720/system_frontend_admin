import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

type Result<T = any> = {
    code: number,
    message: string,
    data: T
}

export class Request {
    instance: AxiosInstance
    baseConfig: AxiosRequestConfig = { baseURL: '/api', timeout: 60000 }
    constructor(config: AxiosRequestConfig) {
        this.instance = axios.create(Object.assign(this.baseConfig, config))

        this.instance.interceptors.request.use(
            (config) => {
                const token = sessionStorage.getItem('token') as string
                if (token) {
                    config.headers!.Authorization = 'Bearer ' + token
                }
                return config
            },
            (err: any) => {
                return err
            }
        )

        this.instance.interceptors.response.use(
            (res: AxiosResponse) => {
                // 直接返回res，当然你也可以只返回res.data
                // 系统如果有自定义code也可以在这里处理
                return res
            },
            (err: any) => {
                if (err.response) {
                    return err.response
                } else {
                    return err.message
                }

            }
        )
    }

    public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
        return this.instance.request(config)
    }

    public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<Result<T>>> {
        return this.instance.get(url, config)
    }

    public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<Result<T>>> {
        return this.instance.post(url, data, config)
    }
}

export default new Request({})