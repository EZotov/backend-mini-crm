# 🚀 B2B Mini-CRM (MVP) с контролем SLA, Real-time сокетами и геймификацией

**B2B Mini-CRM** — это CRM-система для управления B2B-продажами. Проект спроектирован с упором на **жесткий контроль качества обработки лидов (SLA)**, **мгновенную синхронизацию данных в реальном времени** и **прозрачную геймифицированную аналитику** для мотивации команды менеджеров.

---

## 🎯 1. Бизнес-цели и ключевой функционал

* **Контроль SLA (15 минут):** Автоматическая фиксация просрочки первого ответа менеджера по новому лиду для минимизации оттока клиентов.
* **Real-time Канбан-доска:** Управление сделками через смену статусов (Drag-and-Drop) с мгновенным обновлением интерфейса у всей команды.
* **Управление задачами и касаниями:** Исключение «забытых» сделок с помощью обязательного планирования звонков, встреч или писем.
* **Геймифицированная аналитика:** Модуль отчетов, формирующий прозрачный рейтинг эффективности менеджеров («Доска почета», KPI по выручке и «Зона риска» по нарушениям SLA).
* **B2B-архитектура:** Разделение сущностей на контрагентов (Companies) и контактных лиц (Customers).

---

## 🗄️ 2. Архитектура базы данных (Сущности TypeORM)

В качестве ORM используется **TypeORM**. Структура поддерживает строгие связи (One-to-Many / Many-to-One) и каскадные удаления для поддержания целостности данных. Каждый пользователь системы имеет строго одну роль.

### 2.1. Управление пользователями, ролями и контрагентами

```typescript
// Role.entity.ts (Роли пользователей)
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './User';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // Например: 'ADMIN', 'MANAGER'

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
```

```typescript
// User.entity.ts (Пользователи / Менеджеры)
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Role } from './Role';
import { Deal } from './Deal';
import { Activity } from './Activity';
import { SlaLog } from './SlaLog';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;


  @ManyToOne(() => Role, (role) => role.users, { eager: true, onDelete: 'RESTRICT' })
  role: Role; // У пользователя может быть строго одна роль

  @OneToMany(() => Deal, (deal) => deal.user)
  deals: Deal[];

  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];

  @OneToMany(() => SlaLog, (slaLog) => slaLog.user)
  slaLogs: SlaLog[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({nullable: true})
  deleteAt: Date; // Для мягкого удаления сотрудников
}
```

```typescript
// Company.entity.ts (Организации / Юрлица)
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Customer } from './Customer';
import { Deal } from './Deal';

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
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Company } from './Company';
import { Deal } from './Deal';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Имя контактного лица

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
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { Company } from './Company';
import { Customer } from './Customer';
import { Activity } from './Activity';
import { DealHistory } from './DealHistory';
import { SlaLog } from './SlaLog';

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
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Deal } from './Deal';
import { User } from './User';

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
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Deal } from './Deal';
import { User } from './User';

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
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Deal } from './Deal';
import { User } from './User';

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

### 3.2. Модуль Управления Пользователями (`/users`) — *Только для ADMIN*
* **`GET /users`** — Получение списка сотрудников с их ролью. Query: `?page=1&limit=20&isActive=true`.
* **`GET /users/:id`** — Карточка сотрудника (статистика сделок, привязанная роль).
* **`POST /users`** — Регистрация нового сотрудника. Body: `{ "email": "...", "password": "...", "name": "...", "roleId": "uuid" }`.
* **`PATCH /users/:id`** — Редактирование профиля или смена роли/блокировка (`isActive: false`).
* **`DELETE /users/:id`** — Удаление аккаунта пользователя из системы.

### 3.3. Модуль Компаний и Клиентов (`/companies`, `/customers`)
* **`GET /companies`** — Список компаний с пагинацией и поиском по имени/ИНН.
* **`POST /companies`** — Создание компании. Body: `{ "name": "...", "inn": "..." }`.
* **`GET /customers`** — Список контактных лиц с фильтром по `companyId`.
* **`POST /customers`** — Создание контакта с привязкой к компании. Body: `{ "name": "...", "phone": "...", "companyId": "uuid" }`.

### 3.4. Модуль Сделок и Канбана (`/deals`)
* **`GET /deals`** — Получение списка сделок с группировкой по статусам для Канбан-доски.
* **`POST /deals`** — Создание сделки. Бэкенд выставляет `slaDeadline` на `createdAt + 15 минут`. Status по умолчанию: `NEW`. Body: `{ "title": "...", "budget": 10000, "companyId": "uuid", "customerId": "uuid" }`.
* **`PATCH /deals/:id`** — Перенос сделки (Drag-and-Drop) или назначение менеджера.
  * **Важная логика:** При переходе из `NEW` в `IN_PROGRESS` проверяется `slaDeadline`. Если время вышло, бэкенд выставляет `isSlaViolated = true`, создает запись в `SlaLog`, фиксирует смену статуса в `DealHistory` и через сокеты рассылает триггер.
* **`GET /deals/:id/history`** — Получение лога перемещения конкретной сделки по стадиям воронки.

### 3.5. Модуль Задач (`/deals/:dealId/activities`)
* **`GET /deals/:dealId/activities`** — Чек-лист текущих и закрытых задач по сделке.
* **`POST /deals/:dealId/activities`** — Планирование новой задачи. Body: `{ "type": "CALL", "description": "...", "dueDate": "2026-10-01T12:00:00Z" }`.
* **`PATCH /deals/:dealId/activities/:activityId`** — Закрытие задачи (перевод `isCompleted` в `true`).

### 3.6. Модуль Аналитики (`/analytics`)
* **`GET /analytics/summary`** — Сводный геймифицированный дашборд руководителя.
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
```

---

## 📡 4. Модуль уведомлений `NotificationModule` (Socket.io)

Обеспечивает синхронизацию состояния интерфейсов в реальном времени без необходимости ручной перезагрузки страниц менеджерами.

### 4.1. Авторизация сессии
При коннекте клиент обязан передать JWT-токен в хедерах авторизации:
```javascript
const socket = io("http://localhost:3000", {
  auth: { token: "Bearer eyJhbG..." }
});
```

### 4.2. События Сервер -> Клиент (Server-to-Client)

* **`deal:created`** (Broadcast всем) — Отправляется при создании новой сделки.
  * *Payload:* `{ "id": "uuid", "title": "Новый лид", "budget": 150000, "status": "NEW" }`
* **`deal:updated`** (Broadcast всем) — Отправляется при любом смещении карточки на Канбане.
  * *Payload:* `{ "id": "uuid", "status": "INVOICE", "userId": "uuid-менеджера" }`
* **`sla:violated`** (Broadcast всем) — Генерируется фоновым скриптом раз в минуту или при ручном перетаскивании с опозданием.
  * *Payload:* `{ "dealId": "uuid", "title": "ООО Вектор - Закупка", "minutesOverdue": 15 }`
  * *Фронтенд-эффект:* Карточка сделки мгновенно перекрашивается в красный цвет, запускается анимация пульсации и проигрывается звуковой алерт.

---

## ⚙️ 5. Фоновый контроль SLA (Cron-процесс)

1. **Интервал:** Каждую минуту на бэкенде отрабатывает таск-планировщик.
2. **TypeORM Запрос:**
   ```typescript
   const expiredDeals = await dealRepository.find({
     where: {
       status: 'NEW',
       isSlaViolated: false,
       slaDeadline: LessThan(new Date())
     },
     relations: ['user']
   });
   ```
3. **Фиксация:** Для каждой просроченной сделки бэкенд устанавливает `isSlaViolated = true`, создает лог в таблице `SlaLog` с расчетом времени опоздания и вызывает метод `NotificationGateway.server.emit('sla:violated', ...)`.

---

## 🛠️ 6. Технологический стек
* **Backend:** Node.js (NestJS) + TypeScript
* **ORM:** TypeORM + PostgreSQL
* **Real-time:** Socket.io
* **Scheduling:** Node-cron
