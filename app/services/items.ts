import { BaseService } from './base'
import type { BrowseParams, MyItemsParams } from '~/types/item'

export class ItemService extends BaseService {
  async mine(params: MyItemsParams = {}) {
    return await this.get('/my/items', params)
  }

  async showMine(id: number | string) {
    return await this.get(`/my/items/${id}`)
  }

  async create(formData: FormData) {
    return await this.postFormData('/items', formData)
  }

  async update(id: number | string, formData: FormData) {
    return await this.putFormData(`/items/${id}`, formData)
  }

  async remove(id: number) {
    return await this.delete(`/items/${id}`)
  }

  async browse(params: BrowseParams = {}) {
    return await this.get('/items', params)
  }

  async show(id: number | string) {
    return await this.get(`/items/${id}`)
  }

  async recordView(id: number | string) {
    return await this.post(`/items/${id}/view`)
  }
}
