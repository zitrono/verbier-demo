// Temporary database stub
export const getUser = async (...args: any[]) => [];
export const getChatsByUserId = async (...args: any[]) => [];
export const getChatById = async (...args: any[]) => ({ userId: '', messages: [] });
export const saveChat = async (...args: any[]) => {};
export const deleteChatById = async (...args: any[]) => {};
export const deleteMessagesByChatIdAfterTimestamp = async (...args: any[]) => {};
export const updateChatVisiblityById = async (...args: any[]) => {};
export const createReservation = async (...args: any[]) => {};
export const getReservationById = async (...args: any[]) => ({ hasCompletedPayment: false });
export const updateReservation = async (...args: any[]) => {};