# 🚀 B2B Mini-CRM (MVP) с контролем SLA, Real-time сокетами и геймификацией

**B2B Mini-CRM** — это высокоэффективная CRM-система для управления B2B-продажами. Проект спроектирован с упором на **жесткий контроль качества обработки лидов (SLA)**, **мгновенную синхронизацию данных в реальном времени** и **прозрачную геймифицированную аналитику** для мотивации команды менеджеров.

---

## 🎯 1. Бизнес-цели и ключевой функционал

* **Контроль SLA (15 минут):** Автоматическая фиксация просрочки первого ответа менеджера по новому лиду с логированием нарушений.
* **Real-time Канбан-доска:** Управление сделками через смену статусов (Drag-and-Drop) с мгновенным обновлением интерфейса у всей команды.
* **Управление задачами и касаниями:** Исключение «забытых» сделок с помощью обязательного планирования звонков, встреч или писем.
* **Геймифицированная аналитика:** Модуль отчетов, формирующий прозрачный рейтинг эффективности менеджеров («Доска почета», KPI по выручке и «Зона риска» по нарушениям SLA).
* **B2B-архитектура:** Разделение сущностей на контрагентов (Компании) и контактных лиц (Клиенты).

---

## 🗄️ 2. Архитектура базы данных (Сущности TypeORM)

В качестве ORM используется **TypeORM**. Структура поддерживает строгие связи (One-to-Many / Many-to-One) и каскадные удаления для поддержания целостности данных.

### 2.1. Управление пользователями и контрагентами

```typescript
// User.entity.ts (Пользователи / Менеджеры)
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', default: 'MANAGER' })
  role: 'MANAGER' | 'ADMIN';

  @OneToMany(() => Deal, (deal) => deal.user)
  deals: Deal[];

  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];

  @OneToMany(() => SlaLog, (slaLog) => slaLog.user)
  slaLogs: SlaLog[];

  @CreateDateColumn()
  createdAt: Date;
}
```

```typescript
// Company.entity.ts (Организации / Юрлица)
@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Например, "ООО Вектор"

  @Column({ nullable: true })
  inn: string; // ИНН для B2B-проверок

  @OneToMany(() => Customer, (customer) => customer.company)
  contacts: Customer[];

  @OneToMany(() => Deal, (deal) => deal.company)
  deals: Deal[];

  @CreateDateColumn()
  createdAt: Date;
}
```

```typescript
// Customer.entity.ts (Контактные лица / Клиенты)
@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Имя контактного лица (например, "Иванов Иван")

  @Column({ unique: true })
  phone: string;

  @ManyToOne(() => Company, (company) => company.contacts, { nullable: true, onDelete: 'SET NULL' })
  company: Company | null;

  @OneToMany(() => Deal, (deal) => deal.customer)
  deals: Deal[];

  @CreateDateColumn()
  createdAt: Date;
}
```

### 2.2. Сделки, задачи и аудит

```typescript
// Deal.entity.ts (Сделки)
@Entity('deals')
export class Deal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'int' })
  budget: number;

  @Column({ type: 'varchar', default: 'NEW' })
  status: 'NEW' | 'IN_PROGRESS' | 'INVOICE' | 'WON' | 'LOST';

  @Column({ type: 'timestamp', nullable: true })
  slaDeadline: Date | null; // Время создания + 15 минут

  @Column({ type: 'boolean', default: false })
  isSlaViolated: boolean;

  @ManyToOne(() => User, (user) => user.deals, { nullable: true, onDelete: 'SET NULL' })
  user: User | null;

  @ManyToOne(() => Company, (company) => company.deals, { onDelete: 'CASCADE' })
  company: Company;

  @ManyToOne(() => Customer, (customer) => customer.deals, { onDelete: 'CASCADE' })
  customer: Customer;

  @OneToMany(() => Activity, (activity) => activity.deal)
  activities: Activity[];

  @OneToMany(() => DealHistory, (history) => history.deal)
  history: DealHistory[];

  @OneToMany(() => SlaLog, (slaLog) => slaLog.deal)
  slaLogs: SlaLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

```typescript
// Activity.entity.ts (Задачи и Касания)
@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'TELEGRAM';

  @Column()
  description: string;

  @Column({ type: 'timestamp' })
  dueDate: Date; // Дедлайн выполнения задачи

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;

  @ManyToOne(() => Deal, (deal) => deal.activities, { onDelete: 'CASCADE' })
  deal: Deal;

  @ManyToOne(() => User, (user) => user.activities, { onDelete: 'CASCADE' })
  user: User; // Ответственный за задачу менеджер

  @CreateDateColumn()
  createdAt: Date;
}
```

```typescript
// DealHistory.entity.ts (История статусов для Воронки)
@Entity('deal_history')
export class DealHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Deal, (deal) => deal.history, { onDelete: 'CASCADE' })
  deal: Deal;

  @Column()
  fromStatus: string;

  @Column()
  toStatus: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  changedBy: User | null; // Кто передвинул карточку

  @CreateDateColumn()
  createdAt: Date;
}
```

```typescript
// SlaLog.entity.ts (Журнал нарушений SLA)
@Entity('sla_logs')
export class SlaLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Deal, (deal) => deal.slaLogs, { onDelete: 'CASCADE' })
  deal: Deal;

  @ManyToOne(() => User, (user) => user.slaLogs, { nullable: true, onDelete: 'SET NULL' })
  user: User | null; // Кто просрочил лид

  @Column({ type: 'int' })
  minutesOverdue: number; // На сколько минут затянули ответ

  @CreateDateColumn()
  createdAt: Date;
}
```

---

## 🔌 3. Спецификация REST API Эндпоинтов

Префикс всех эндпоинтов: `/api/v1`

### 3.1. Модуль Аутентификации (`/auth`, `/me`)
* **`POST /auth/login`** — Авторизация, выдача JWT. Body: `{ "email": "...", "password": "..." }`.
* **`GET /me`** — Получение профиля текущего пользователя по Bearer токену.

### 3.2. Модуль Компаний и Клиентов (`/companies`, `/customers`)
* **`GET /companies`** — Список компаний с пагинацией и поиском по имени/ИНН.
* **`POST /companies`** — Создание компании. Body: `{ "name": "...", "inn": "..." }`.
* **`GET /customers`** — Список контактных лиц с фильтром по `companyId`.
* **`POST /customers`** — Создание контакта с привязкой к компании. Body: `{ "name": "...", "phone": "...", "companyId": "uuid" }`.

### 3.3. Модуль Сделок и Канбана (`/deals`)
* **`GET /deals`** — Получение списка сделок с группировкой по статусам для Канбан-доски.
* **`POST /deals`** — Создание сделки. Бэкенд выставляет `slaDeadline` на `createdAt + 15 минут`. Status по умолчанию: `NEW`. Body: `{ "title": "...", "budget": 10000, "companyId": "uuid", "customerId": "uuid" }`.
* **`PATCH /deals/:id`** — Перенос сделки (Drag-and-Drop) или назначение менеджера.
  * **Важная логика:** При переходе из `NEW` в `IN_PROGRESS` проверяется `slaDeadline`. Если время вышло, бэкенд выставляет `isSlaViolated = true`, создает запись в `SlaLog`, фиксирует смену статуса в `DealHistory` и через сокеты рассылает триггер.
* **`GET /deals/:id/history`** — Получение лога перемещения конкретной сделки по стадиям воронки.

### 3.4. Модуль Задач (`/deals/:dealId/activities`)
* **`GET /deals/:dealId/activities`** — Чек-лист текущих и закрытых задач по сделке.
* **`POST /deals/:dealId/activities`** — Планирование новой задачи. Body: `{ "type": "CALL", "description": "...", "dueDate": "2026-10-01T12:00:00Z" }`.
* **`PATCH /deals/:dealId/activities/:activityId`** — Закрытие задача (перевод `isCompleted` в `true`).

### 3.5. Модуль Аналитики (`/analytics`)
* **`GET /analytics/summary`** — Сводный геймифицированный дашборд.
  * *Response (200):*
```json
{
  "financials": {
    "totalVolume": 4800000,
    "averageBudget": 160000,
    "forgottenDealsCount": 3
  },
  "funnel": {
    "conversionRate": 28.4,
    "weakestStage": "INVOICE",
    "averageStageDurations": {
      "NEW": "12 минут",
      "IN_PROGRESS": "4 дня",
      "INVOICE": "9 дней"
    }
  },
  "gamification": {
    "boardOfHonor": [
      { "rank": 1, "name": "Алексей Иванов", "wonBudget": 2100000 }
    ],
    "dangerZone": [
      {
        "name": "Игорь Сидоров",
        "slaViolationRatePercentage": 24.0,
        "totalViolationsCount": 12,
        "averageOverdueMinutes": 45
      }
    ]
  }
} 
