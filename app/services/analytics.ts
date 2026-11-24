import { BaseService } from './base'

export class AnalyticsService extends BaseService {
  async mine(days = 30) {
    return await this.get('/my/analytics', { days })
  }
}
