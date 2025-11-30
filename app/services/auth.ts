// services/api/aras.ts
import { BaseService } from '../base'
import { buildFormData } from '../../utils/formData'

export class ArasService extends BaseService {
    /**
     * Get a list of aras with optional query parameters
     * @param params - Optional query parameters for filtering aras
     * @returns Promise with the list of aras
     */
    async login(params = {}) {
        return this.post('/aras', params)
    }
}

export type ArasServiceType = Omit<ArasService, keyof BaseService>
