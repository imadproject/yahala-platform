# منصة يا هلا الحكومية

مشروع Monorepo لنظام حكومي حقيقي مبني على:
- **Frontend:** Next.js 14 + TypeScript
- **Backend:** NestJS + Prisma + PostgreSQL
- **Auth:** JWT + MFA-ready
- **Architecture:** Modular GovTech domain services + engines

## التشغيل المحلي

1. انسخ ملف البيئة:
   - `cp .env.example .env`
2. شغّل قاعدة البيانات:
   - `docker compose up -d`
3. ثبّت الاعتماديات من الجذر:
   - `npm install`
4. شغّل توليد Prisma:
   - `npm run prisma:generate -w @yahala/api`
   - `npm run prisma:migrate -w @yahala/api -- --name init`
5. شغّل المشروع:
   - `npm run dev`

## المنافذ
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000/api/v1`

## ماذا يتضمن المشروع
- نماذج قاعدة بيانات تغطي المستخدمين، الجهات، الخدمات، الطلبات، الأصول، الملكية، القضايا، الجلسات، السجلات، المواعيد، الإشعارات، التدقيق، والتكامل.
- محركات تشغيلية: State / Workflow / Permissions / Dependencies / Asset / Ownership / Legal Case / Citizen Status / Citizen 360 / Notifications / Integration.
- واجهات API منظمة حسب المجال.
- واجهات React/Next.js تحافظ على نفس UX العام للـ HTML المرفق.

## ملاحظات هندسية
- المشروع **ليس صفحة ثابتة**؛ كل Route في الواجهة مصمم ليعمل فوق API حقيقي.
- لا يوجد Seed افتراضي أو Fake data. النظام يبدأ بقاعدة بيانات فارغة ويعتمد على عمليات الإدخال الحقيقية.
- جميع الانتقالات الحساسة يجب أن تمر عبر الخدمات المجالـية الموجودة في `apps/api/src/common/engines`.
