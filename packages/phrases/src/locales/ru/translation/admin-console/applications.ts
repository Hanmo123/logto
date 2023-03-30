const applications = {
  page_title: 'Заявки',
  title: 'Заявки',
  subtitle:
    'Настроить аутентификацию Logto для вашего нативного, одностраничного, машина-машина или традиционного приложения.',
  create: 'Создать заявку',
  application_name: 'Название приложения',
  application_name_placeholder: 'Мое приложение',
  application_description: 'Описание приложения',
  application_description_placeholder: 'Введите описание вашего приложения',
  select_application_type: 'Выбрать тип приложения',
  no_application_type_selected: 'Вы еще не выбрали тип приложения',
  application_created:
    'Приложение {{name}} успешно создано! \nТеперь завершите настройку приложения.',
  app_id: 'ID приложения',
  type: {
    native: {
      title: 'Нативное приложение',
      subtitle: 'Приложение, работающее в нативной среде',
      description: 'Например, приложение для iOS, приложение для Android',
    },
    spa: {
      title: 'Одностраничное приложение',
      subtitle: 'Приложение, работающее в веб-браузере и динамически обновляющее данные на месте',
      description: 'Например, приложение React DOM, приложение Vue',
    },
    traditional: {
      title: 'Традиционный веб',
      subtitle: 'Приложение, которое отображает и обновляет страницы только веб-сервером',
      description: 'Например, Next.js, PHP',
    },
    machine_to_machine: {
      title: 'Машина-машина',
      subtitle: 'Приложение (обычно сервис), которое напрямую общается с ресурсами',
      description: 'Например, backend-сервис',
    },
  },
  guide: {
    get_sample_file: 'Получить образец',
    header_description:
      'Следуйте пошаговому руководству, чтобы интегрировать ваше приложение, или нажимите правильную кнопку, чтобы получить наш образец проекта',
    title: 'Приложение успешно создано',
    subtitle:
      'Теперь следуйте инструкциям ниже, чтобы завершить настройку приложения. Выберите тип SDK, чтобы продолжить.',
    description_by_sdk:
      'Это быстрое руководство демонстрирует, как интегрировать Logto в {{sdk}} приложение',
  },
  placeholder_title: 'Выберите тип приложения, чтобы продолжить',
  placeholder_description:
    'Logto использует сущность приложения для OIDC для выполнения задач, таких как идентификация ваших приложений, управление входом в систему и создание журналов аудита.',
};

export default applications;
