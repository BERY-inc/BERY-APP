import apiClient from './apiClient';

export interface Zone {
    id: number;
    name: string;
    display_name: string;
    status: number;
    coordinates: {
        type: string;
        coordinates: number[][][];
    };
    formated_coordinates: { lat: number; lng: number }[];
}

export interface Module {
    id: number;
    module_name: string;
    module_type: string;
    thumbnail: string;
    status: number;
}

class MetadataService {
    async getZones(): Promise<Zone[]> {
        try {
            const response = await apiClient.get<Zone[]>('/api/v1/zone/list');
            console.log('Zones API Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching zones:', error);
            throw error;
        }
    }

    async getModules(): Promise<Module[]> {
        try {
            const response = await apiClient.get<Module[]>('/api/v1/module');
            console.log('Modules API Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching modules:', error);
            throw error;
        }
    }

    async getCategories(): Promise<any[]> {
        try {
            const response = await apiClient.get<any[]>('/api/v1/categories');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }
}

export default new MetadataService();
