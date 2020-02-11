interface HttpRequest {
  get: (url: string, params?: any) => Promise<any>
  post: (url: string, body?: any) => Promise<any>
  put: (url: string, body?: any) => Promise<any>
  patch: (url: string, body?: any) => Promise<any>
  delete: (url: string, body?: any) => Promise<any>
}