import axios from 'axios';

const API_URL = '/api/v1/notifications';

// Get all notifications for the current user
export const fetchNotifications = async () => {
  try {
    const { data } = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
      },
    });
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching notifications');
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const { data } = await axios.patch(
      `${API_URL}/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
        },
      }
    );
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error marking notification as read');
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const { data } = await axios.patch(
      `${API_URL}/read-all`,
      {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
        },
      }
    );
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error marking all notifications as read');
  }
}; 