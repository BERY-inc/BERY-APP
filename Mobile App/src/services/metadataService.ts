import { isSupabaseConfigured, supabase } from './supabaseClient';

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
        if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');
        const { data, error } = await supabase
            .from('zones')
            .select('id, name, display_name, status, coordinates, formated_coordinates')
            .order('id', { ascending: true });
        if (error) throw new Error(error.message);
        return (data ?? []) as any;
    }

    async getModules(): Promise<Module[]> {
        if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');
        const { data, error } = await supabase
            .from('modules')
            .select('id, module_name, module_type, thumbnail, status')
            .order('id', { ascending: true });
        if (error) throw new Error(error.message);
        return (data ?? []) as any;
    }

    async getCategories(): Promise<any[]> {
        if (!isSupabaseConfigured || !supabase) return [];
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('id', { ascending: true });
        if (error) return [];
        return data ?? [];
    }
}

export default new MetadataService();
