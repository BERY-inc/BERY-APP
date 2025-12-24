import apiClient from './apiClient';

export interface UserInfo {
  id: number;
  f_name: string;
  l_name: string;
  phone: string;
  email: string;
  image: string;
  user_id?: number;
  vendor_id?: number;
  deliveryman_id?: number;
  admin_id?: number;
}

export interface ChatMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  message: string;
  file?: string; // JSON string of images
  file_full_url?: string[]; // Appended by backend
  is_seen: number;
  created_at: string;
  updated_at: string;
  order_id?: number;
  order?: any; // Define Order type if needed
}

export interface Conversation {
  id: number;
  sender_id: number;
  sender_type: string;
  receiver_id: number;
  receiver_type: string;
  unread_message_count: number;
  last_message_id: number;
  last_message_time: string;
  created_at: string;
  updated_at: string;
  sender?: UserInfo;
  receiver?: UserInfo;
  last_message?: ChatMessage;
}

export interface GetConversationsResponse {
  type: string | null;
  total_size: number;
  limit: number;
  offset: number;
  conversations: Conversation[];
}

export interface GetMessagesResponse {
  total_size: number;
  limit: number;
  offset: number;
  status: boolean;
  message: string;
  messages: ChatMessage[];
  conversation: Conversation;
}

export const chatService = {
  getConversations: async (limit: number = 10, offset: number = 1, type?: 'admin' | 'vendor' | 'delivery_man') => {
    try {
      const params: any = { limit, offset };
      if (type) {
        params.type = type;
      }
      const response = await apiClient.get<GetConversationsResponse>('/message/list', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  searchConversations: async (name: string, limit: number = 10, offset: number = 1) => {
    try {
      const response = await apiClient.get<GetConversationsResponse>('/message/search-list', {
        params: { name, limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching conversations:', error);
      throw error;
    }
  },

  getMessages: async (
    conversationId?: number,
    vendorId?: number,
    deliveryManId?: number,
    adminId?: number,
    limit: number = 10,
    offset: number = 1
  ) => {
    try {
      const params: any = { limit, offset };
      if (conversationId) params.conversation_id = conversationId;
      else if (vendorId) params.vendor_id = vendorId;
      else if (deliveryManId) params.delivery_man_id = deliveryManId;
      else if (adminId !== undefined) params.admin_id = 1; // Assuming presence triggers logic

      const response = await apiClient.get<GetMessagesResponse>('/message/details', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  sendMessage: async (
    message: string,
    conversationId?: number,
    receiverType?: 'admin' | 'vendor' | 'delivery_man',
    receiverId?: number,
    image?: File
  ) => {
    try {
      const formData = new FormData();
      formData.append('message', message);
      
      if (conversationId) {
        formData.append('conversation_id', conversationId.toString());
      } else if (receiverType && receiverId !== undefined) {
        formData.append('receiver_type', receiverType);
        formData.append('receiver_id', receiverId.toString());
      } else if (receiverType === 'admin') {
          formData.append('receiver_type', 'admin');
          formData.append('receiver_id', '0');
      }

      if (image) {
        formData.append('image[]', image); // Backend expects array 'image[]' or just 'image'? Controller says: $request->file('image') as array if multiple.
        // Controller: if ($request->has('image')) ... foreach($request->file('image') as $key=>$img)
        // It seems it handles multiple, so 'image[]' is safer if using array logic, but let's check input name.
        // Controller code: foreach($request->file('image') as $key=>$img) implies it expects an array.
        // In FormData, appending multiple values to 'image' or 'image[]' works.
        // Let's use 'image[]' to be safe with array expectation.
      }

      const response = await apiClient.post<GetMessagesResponse>('/message/send', formData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
};

export default chatService;
