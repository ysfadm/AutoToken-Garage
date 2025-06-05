# 🎨 Frontend Özelleştirme PDR Template

> **Workshop Katılımcısı İçin Talimatlar:**
> Bu template'i kendi projeniz için özelleştirmek üzere aşağıdaki bölümleri doldurun.
> `[BURAYA_GİRİN: açıklama]` formatındaki alanları kendi proje bilgilerinizle değiştirin.

## 📋 **Proje Bilgileri**

### **Seçilen Sektör**: Otomotiv ve Mobilite

### **Platform Adı**: AutoToken Garage

### **Ana Varlık Türü**: Klasik arabalar, elektrikli araç projeleri, filo yatırımları

### **Hedef Kitle**: Klasik otomobil koleksiyonerleri, filo yatırımcıları, elektrikli araç girişimcileri

---

## 🎯 **Platform Vizyonu**

### **Ana Konsept**

Otomotiv sektöründe varlıkların tokenizasyonu ile klasik araç sahiplerinin ve yeni nesil mobilite projelerinin finansman sağlamalarını, yatırımcıların ise değerli araçlara ve projelere fraksiyonel sahiplik kazanmalarını sağlayan inovatif bir platform.

### **Değer Önerisi**

- **Klasik Otomobil Sahipleri için**: Araçlarını satmadan finansman sağlama, global yatırımcı ağına erişim, değer tespiti
- **Filo Yatırımcıları için**: Düşük giriş bariyeri, portföy çeşitlendirme, operasyonel kolaylık
- **EV Proje Sahipleri için**: Erken aşama finansman, topluluk desteği, pazar validasyonu

---

## 🎨 **Görsel Kimlik Güncellemeleri**

### **Renk Paleti**

```css
/* Automotive Theme */
--primary: #C00000      /* Racing Red - Power and performance */
--secondary: #232323    /* Carbon Black - Luxury and prestige */
--accent: #B0B0B0       /* Chrome Silver - Innovation and precision */
--background: #F5F5F5   /* Light Gray - Clean interface */
--foreground: #181818   /* Deep Black - Clear readability */
```

### **İkonlar ve Emojiler**

- **Ana Tema**: 🚗 🏎️ 🚙 ⚡ 🛠️ 🏁
- **Alt Kategoriler**: 🚗 🚓 🚐 🚚 🏍️ 🛻
- **İşlemler**: 📝 💰 🔧 🔍 ✅ 🚀

### **Tipografi**

- **Başlıklar**: Poppins
- **İçerik**: Inter
- **Ton**: Modern, dinamik ve profesyonel

---

## 📁 **Güncellenmesi Gereken Dosyalar**

### **🏠 Ana Sayfa (`app/page.tsx`)**

#### **Başlık ve Açıklama**

```typescript
// Update content:
title: "AutoToken Garage";
description: "Tokenized Classic Cars and Mobility Investment Platform";
```

#### **Dashboard Kartları**

````typescript
// Automotive Platform Metrics:
"Vehicle Portfolio" - Total value of tokenized vehicles
"Active Investments" - Number of active investments
"Listed Assets" - Number of vehicles and projects
"Compliance Status" - Vehicle and project verification status

#### **Hızlı Eylemler**
```typescript
"Discover Vehicles" - Browse available classic cars and EV projects
"Transfer Tokens" - Transfer vehicle ownership tokens
"Tokenize Asset" - List your vehicle or mobility project

### **🏪 Marketplace (`app/marketplace/page.tsx`)**

#### **Arama ve Filtreler**
```typescript
// Automotive sector filters:
asset_type: ["classic_car", "ev_project", "fleet", "mobility_startup"]
vehicle_category: ["vintage", "luxury", "electric", "commercial"]
location: ["europe", "americas", "asia", "global"]
certification: ["authenticated", "verified", "appraised"]

#### **Varlık Kartları**
```typescript
// Example automotive asset card:
{
  name: "1967 Mustang GT",
  symbol: "MUST67",
  creator: "Classic Auto Collection - California",
  date: "Production: 1967, Tokenized: 2025",
  specs: "V8 Engine, Original Parts, Full Documentation",
  price_per_token: "500 USD",
  total_supply: 1000,
  sold_percentage: 65
}

### **🌱 Tokenization Flow**

#### **5 Adımlı Süreç**
```typescript
1. "Vehicle Information" - Basic details and history
   - Vehicle type, make, model, year

2. "Technical Details" - Specifications and condition
   - Engine, mileage, restoration status

3. "Documentation" - Legal and authentication
   - Title, certificates, appraisals

4. "Token Structure" - Investment terms
   - Valuation, token distribution, returns

5. "Launch" - Final verification and listing
   - Review, approve, publish

### **💸 Transfer Flow**

```typescript
"Vehicle Token Transfer"
"Recipient Wallet"
"Token Amount"
"Ownership Verification"

### **🎨 Layout**

#### **Metadata**
```typescript
export const metadata = {
  title: 'AutoToken Garage - Classic Car Investment Platform',
  description: 'Invest in tokenized classic cars and innovative mobility projects. Join the future of automotive investment.',
  icons: {
    icon: '/auto-token.ico',
  }
}

### **📱 Navigation Menu**
```typescript
"Garage" - Main dashboard
"Vehicle Market" - Browse assets
"List Vehicle" - Tokenization
"Transfer Tokens" - Ownership transfer

### **Type Definitions (`lib/types.ts`)**

```typescript
// Automotive sector type definitions:
export interface VehicleAsset {
  id: string;
  name: string;
  symbol: string;
  asset_type: 'classic_car' | 'ev_project' | 'fleet' | 'mobility_startup';
  creator_info: {
    name: string;
    location: string;
    experience_years: number;
    certifications: string[];
  };
  vehicle_details: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    condition: string;
    authentication_status: boolean;
  };
  timeline_info: {
    production_date: string;
    tokenization_date: string;
    last_service_date: string;
    quality_grade: 'A' | 'B' | 'C';
  };
  financial: {
    valuation: number;
    token_price: number;
    total_supply: number;
    current_funding: number;
  };
}

### **Mock Data (`lib/contract.ts`)**

```typescript
const SAMPLE_VEHICLES = [
  {
    id: 'classic-001',
    name: '1967 Ford Mustang GT',
    symbol: 'MUST67',
    asset_type: 'classic_car',
    creator_info: {
      name: 'Classic Auto Collection',
      location: 'California, USA',
      experience_years: 25,
      certifications: ['Certified Appraiser', 'Classic Car Expert']
    },
    vehicle_details: {
      make: 'Ford',
      model: 'Mustang GT',
      year: 1967,
      mileage: 76000,
      condition: 'Restored',
      authentication_status: true
    }
  }
];
````
