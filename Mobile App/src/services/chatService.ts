import { isSupabaseConfigured, supabase } from './supabaseClient';

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

const toNumericId = (raw: string): number => {
  const s = String(raw || '').replace(/[^a-fA-F0-9]/g, '').slice(0, 12);
  if (!s) return 0;
  const n = Number.parseInt(s, 16);
  return Number.isFinite(n) ? n : 0;
};

const emptyConversations = (limit: number, offset: number, type?: string | null): GetConversationsResponse => ({
  type: type ?? null,
  total_size: 0,
  limit,
  offset,
  conversations: [],
});

const emptyMessages = (limit: number, offset: number): GetMessagesResponse => ({
  total_size: 0,
  limit,
  offset,
  status: true,
  message: '',
  messages: [],
  conversation: {
    id: 0,
    sender_id: 0,
    sender_type: 'customer',
    receiver_id: 0,
    receiver_type: 'admin',
    unread_message_count: 0,
    last_message_id: 0,
    last_message_time: '',
    created_at: '',
    updated_at: '',
  },
});

export const chatService = {
  getConversations: async (limit: number = 10, offset: number = 1, type?: 'admin' | 'vendor' | 'delivery_man') => {
    const numericLimit = Math.max(1, Math.min(100, Number(limit) || 10));
    const numericOffset = Math.max(1, Number(offset) || 1);
    if (!isSupabaseConfigured || !supabase) return emptyConversations(numericLimit, numericOffset, type ?? null);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(userError.message);
    const user = userData.user;
    if (!user) return emptyConversations(numericLimit, numericOffset, type ?? null);

    const from = (numericOffset - 1) * numericLimit;
    const to = from + numericLimit - 1;

    let q = supabase
      .from('conversations')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);
    if (type) q = q.eq('receiver_type', type);

    const res = await q.order('last_message_time', { ascending: false, nullsFirst: false }).range(from, to);
    if (res.error) throw new Error(res.error.message);

    const rows = Array.isArray(res.data) ? res.data : [];
    const conversations: Conversation[] = rows.map((r: any) => ({
      id: Number(r?.id) || 0,
      sender_id: toNumericId(user.id),
      sender_type: 'customer',
      receiver_id: Number(r?.receiver_id) || 0,
      receiver_type: String(r?.receiver_type || type || 'admin'),
      unread_message_count: Number(r?.unread_message_count) || 0,
      last_message_id: Number(r?.last_message_id) || 0,
      last_message_time: String(r?.last_message_time || ''),
      created_at: String(r?.created_at || ''),
      updated_at: String(r?.updated_at || ''),
      sender: r?.sender ?? undefined,
      receiver: r?.receiver ?? undefined,
      last_message: r?.last_message ?? undefined,
    }));

    return {
      type: type ?? null,
      total_size: Number(res.count) || conversations.length,
      limit: numericLimit,
      offset: numericOffset,
      conversations,
    };
  },

  searchConversations: async (name: string, limit: number = 10, offset: number = 1) => {
    const numericLimit = Math.max(1, Math.min(100, Number(limit) || 10));
    const numericOffset = Math.max(1, Number(offset) || 1);
    if (!isSupabaseConfigured || !supabase) return emptyConversations(numericLimit, numericOffset, null);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(userError.message);
    const user = userData.user;
    if (!user) return emptyConversations(numericLimit, numericOffset, null);

    const query = String(name || '').trim();
    if (!query) return emptyConversations(numericLimit, numericOffset, null);

    const from = (numericOffset - 1) * numericLimit;
    const to = from + numericLimit - 1;

    const res = await supabase
      .from('conversations')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .ilike('receiver_name', `%${query}%`)
      .order('last_message_time', { ascending: false, nullsFirst: false })
      .range(from, to);
    if (res.error) throw new Error(res.error.message);

    const rows = Array.isArray(res.data) ? res.data : [];
    const conversations: Conversation[] = rows.map((r: any) => ({
      id: Number(r?.id) || 0,
      sender_id: toNumericId(user.id),
      sender_type: 'customer',
      receiver_id: Number(r?.receiver_id) || 0,
      receiver_type: String(r?.receiver_type || 'admin'),
      unread_message_count: Number(r?.unread_message_count) || 0,
      last_message_id: Number(r?.last_message_id) || 0,
      last_message_time: String(r?.last_message_time || ''),
      created_at: String(r?.created_at || ''),
      updated_at: String(r?.updated_at || ''),
      sender: r?.sender ?? undefined,
      receiver: r?.receiver ?? undefined,
      last_message: r?.last_message ?? undefined,
    }));

    return {
      type: null,
      total_size: Number(res.count) || conversations.length,
      limit: numericLimit,
      offset: numericOffset,
      conversations,
    };
  },

  getMessages: async (
    conversationId?: number,
    vendorId?: number,
    deliveryManId?: number,
    adminId?: number,
    limit: number = 10,
    offset: number = 1
  ) => {
    const numericLimit = Math.max(1, Math.min(100, Number(limit) || 10));
    const numericOffset = Math.max(1, Number(offset) || 1);
    if (!isSupabaseConfigured || !supabase) return emptyMessages(numericLimit, numericOffset);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(userError.message);
    const user = userData.user;
    if (!user) return emptyMessages(numericLimit, numericOffset);

    let resolvedConversationId = conversationId ? Number(conversationId) : 0;
    let receiverType: 'admin' | 'vendor' | 'delivery_man' = 'admin';
    let receiverId = 0;

    if (!resolvedConversationId) {
      if (vendorId) {
        receiverType = 'vendor';
        receiverId = Number(vendorId) || 0;
      } else if (deliveryManId) {
        receiverType = 'delivery_man';
        receiverId = Number(deliveryManId) || 0;
      } else if (adminId !== undefined) {
        receiverType = 'admin';
        receiverId = 0;
      }

      const existing = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('receiver_type', receiverType)
        .eq('receiver_id', receiverId)
        .limit(1)
        .maybeSingle();
      if (!existing.error && existing.data?.id) resolvedConversationId = Number(existing.data.id) || 0;
    }

    if (!resolvedConversationId) {
      const empty = emptyMessages(numericLimit, numericOffset);
      empty.conversation.receiver_type = receiverType;
      empty.conversation.receiver_id = receiverId;
      empty.conversation.sender_id = toNumericId(user.id);
      return empty;
    }

    const from = (numericOffset - 1) * numericLimit;
    const to = from + numericLimit - 1;

    const res = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact' })
      .eq('conversation_id', resolvedConversationId)
      .order('created_at', { ascending: true })
      .range(from, to);
    if (res.error) throw new Error(res.error.message);

    const messages: ChatMessage[] = (res.data ?? []).map((m: any) => ({
      id: Number(m?.id) || 0,
      conversation_id: Number(m?.conversation_id) || resolvedConversationId,
      sender_id: Number(m?.sender_id) || toNumericId(String(m?.sender_user_id || user.id)),
      message: String(m?.message || ''),
      file: m?.file ?? undefined,
      file_full_url: m?.file_full_url ?? undefined,
      is_seen: Number(m?.is_seen) || 0,
      created_at: String(m?.created_at || ''),
      updated_at: String(m?.updated_at || m?.created_at || ''),
      order_id: m?.order_id ?? undefined,
      order: m?.order ?? undefined,
    }));

    const convRes = await supabase.from('conversations').select('*').eq('id', resolvedConversationId).maybeSingle();
    const convRow: any = convRes.error ? null : convRes.data;

    const conversation: Conversation = {
      id: resolvedConversationId,
      sender_id: toNumericId(user.id),
      sender_type: 'customer',
      receiver_id: Number(convRow?.receiver_id) || receiverId,
      receiver_type: String(convRow?.receiver_type || receiverType),
      unread_message_count: Number(convRow?.unread_message_count) || 0,
      last_message_id: Number(convRow?.last_message_id) || 0,
      last_message_time: String(convRow?.last_message_time || ''),
      created_at: String(convRow?.created_at || ''),
      updated_at: String(convRow?.updated_at || ''),
      sender: convRow?.sender ?? undefined,
      receiver: convRow?.receiver ?? undefined,
      last_message: convRow?.last_message ?? undefined,
    };

    return {
      total_size: Number(res.count) || messages.length,
      limit: numericLimit,
      offset: numericOffset,
      status: true,
      message: '',
      messages,
      conversation,
    };
  },

  sendMessage: async (
    message: string,
    conversationId?: number,
    receiverType?: 'admin' | 'vendor' | 'delivery_man',
    receiverId?: number,
    image?: File
  ) => {
    if (!isSupabaseConfigured || !supabase) return emptyMessages(10, 1);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(userError.message);
    const user = userData.user;
    if (!user) throw new Error('Not authenticated');

    const trimmed = String(message || '').trim();
    if (!trimmed) return emptyMessages(10, 1);

    const normalizedReceiverType: 'admin' | 'vendor' | 'delivery_man' = receiverType ?? 'admin';
    const normalizedReceiverId = normalizedReceiverType === 'admin' ? 0 : Number(receiverId) || 0;

    let resolvedConversationId = conversationId ? Number(conversationId) : 0;
    if (!resolvedConversationId) {
      const existing = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('receiver_type', normalizedReceiverType)
        .eq('receiver_id', normalizedReceiverId)
        .limit(1)
        .maybeSingle();
      if (!existing.error && existing.data?.id) resolvedConversationId = Number(existing.data.id) || 0;
    }

    if (!resolvedConversationId) {
      const createdAt = new Date().toISOString();
      const convIns = await supabase
        .from('conversations')
        .insert([
          {
            user_id: user.id,
            receiver_type: normalizedReceiverType,
            receiver_id: normalizedReceiverId,
            unread_message_count: 0,
            created_at: createdAt,
            updated_at: createdAt,
          },
        ])
        .select('*')
        .maybeSingle();
      if (convIns.error) throw new Error(convIns.error.message);
      resolvedConversationId = Number((convIns.data as any)?.id) || 0;
    }

    const now = new Date().toISOString();
    const msgIns = await supabase
      .from('chat_messages')
      .insert([
        {
          conversation_id: resolvedConversationId,
          sender_user_id: user.id,
          sender_id: toNumericId(user.id),
          message: trimmed,
          file: image ? '[]' : null,
          is_seen: 0,
          created_at: now,
          updated_at: now,
        },
      ])
      .select('*')
      .maybeSingle();
    if (msgIns.error) throw new Error(msgIns.error.message);

    const msgId = Number((msgIns.data as any)?.id) || 0;
    const upd = await supabase
      .from('conversations')
      .update({ last_message_id: msgId, last_message_time: now, updated_at: now })
      .eq('id', resolvedConversationId);
    if (upd.error) throw new Error(upd.error.message);

    return chatService.getMessages(resolvedConversationId, undefined, undefined, undefined, 10, 1);
  }
};

export default chatService;
