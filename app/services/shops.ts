import { BaseService } from './base'
import type { ShopRequest } from '~/types/shop'

export class ShopService extends BaseService {
  async mine(params: { page?: number; per_page?: number } = {}) {
    return await this.get('/my/shops', params)
  }

  async create(data: ShopRequest) {
    return await this.post('/shops', data)
  }

  async update(id: number, data: ShopRequest) {
    return await this.put(`/shops/${id}`, data)
  }

  async remove(id: number) {
    return await this.delete(`/shops/${id}`)
  }

  async list(params: { search?: string; state?: string; page?: number; per_page?: number } = {}) {
    return await this.get('/shops', params)
  }

  async show(id: number | string) {
    return await this.get(`/shops/${id}`)
  }
}
