export const createNotificationModel = ({
  recipientUid,  
  senderName,    
  message,       
  type,          
}) => ({
  recipientUid,
  senderName,
  message,
  type: type ? type.toLowerCase() : "system", 
  read: false,                                
  createdAt: new Date(),                      
  updatedAt: new Date(),
});

export const updateNotificationModel = (updates) => ({
  ...updates,
  type: updates.type ? updates.type.toLowerCase() : undefined,
  updatedAt: new Date(),
});