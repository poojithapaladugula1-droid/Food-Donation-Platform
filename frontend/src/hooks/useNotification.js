import { notifications } from '@mantine/notifications'

export const useNotification = () => {
  const showSuccess = (title, message) => {
    notifications.show({
      title,
      message,
      color: 'green',
      autoClose: 3000,
      withBorder: true,
      style: { backgroundColor: '#f0fdf4' }
    })
  }

  const showError = (title, message) => {
    notifications.show({
      title,
      message,
      color: 'red',
      autoClose: 4000,
      withBorder: true,
      style: { backgroundColor: '#fef2f2' }
    })
  }

  const showInfo = (title, message) => {
    notifications.show({
      title,
      message,
      color: 'blue',
      autoClose: 3000,
      withBorder: true,
      style: { backgroundColor: '#eff6ff' }
    })
  }

  const showWarning = (title, message) => {
    notifications.show({
      title,
      message,
      color: 'yellow',
      autoClose: 3000,
      withBorder: true,
      style: { backgroundColor: '#fefce8' }
    })
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning
  }
}