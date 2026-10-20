export const initialState = {
  notifications: [],
  unreadCount: 0,
};

export function notificationReducer(state, action) {
  switch (action.type) {

    case "ADD_NOTIFICATION":
      // prepend action.payload to notifications, slice to max 50, increment unreadCount
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 50),
        unreadCount: state.unreadCount + 1,
      };

    case "MARK_READ": {
      // find notification by action.payload (id)
      // guard — return state unchanged if target is missing OR already read
      const target = state.notifications.find((n) => n.id === action.payload);
      if (!target || target.isRead) {
        return state;
      }
      // map over array to set isRead: true on the matching item
      // use Math.max(0, state.unreadCount - 1) for the new count
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    }

    case "MARK_ALL_READ":
      // set every notification's isRead to true, reset unreadCount to 0
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      };

    case "LOAD_NOTIFICATIONS":
      // replace notifications array with action.payload
      // compute unreadCount as action.payload.filter(n => !n.isRead).length
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter((n) => !n.isRead).length,
      };

    default:
      return state;
  }
}
