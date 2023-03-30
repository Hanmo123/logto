const connector_details = {
  page_title: 'Детали подключения',
  back_to_connectors: 'Вернуться к подключениям',
  check_readme: 'Проверить README',
  settings: 'Общие настройки',
  settings_description:
    'Коннекторы играют критическую роль в Logto. С их помощью, Logto позволяет конечным пользователям использовать беспарольную регистрацию или вход и возможности входа с социальными аккаунтами.',
  parameter_configuration: 'Конфигурация параметра',
  test_connection: 'Тестовое соединение',
  save_error_empty_config: 'Пожалуйста, введите конфигурацию',
  send: 'Отправить',
  send_error_invalid_format: 'Неверный ввод',
  edit_config_label: 'Введите ваш JSON здесь',
  test_email_sender: 'Протестируйте ваш электронный коннектор',
  test_sms_sender: 'Протестируйте ваш SMS коннектор',
  test_email_placeholder: 'john.doe@example.com',
  test_sms_placeholder: '+1 555-123-4567',
  test_message_sent: 'Тестовое сообщение отправлено',
  test_sender_description:
    'Logto использует шаблон "Общий" для тестирования. Вы получите сообщение, если ваш коннектор правильно настроен.',
  options_change_email: 'Изменить электронный коннектор',
  options_change_sms: 'Изменить SMS коннектор',
  connector_deleted: 'Коннектор успешно удален',
  type_email: 'Электронный коннектор',
  type_sms: 'SMS коннектор',
  type_social: 'Социальный коннектор',
  in_used_social_deletion_description:
    'Этот коннектор используется в вашем опыте входа в систему. При удалении опыт входа в систему <name/> будет удален в настройках опыта входа в систему. Вы должны повторно настроить его, если решите добавить его обратно.',
  in_used_passwordless_deletion_description:
    'Этот {{name}} используется в вашем опыте входа в систему. При удалении опыт входа в систему не будет работать правильно, пока не будет решен конфликт. Вы должны повторно настроить его, если решите добавить его обратно.',
  deletion_description:
    'Вы удаляете этот коннектор. Он не может быть отменен, и вы должны повторно настроить его, если решите добавить его обратно.',
};

export default connector_details;
