# Revenue Ripple Integration Guide

## 🔗 **How Agents Access Your Business Data**

### **Current Setup**
Your agents pull business data through API integrations, not direct database access:

1. **Revenue Ripple API** → Backend Agents → Frontend Dashboard
2. **API Keys** stored in Render environment variables
3. **Agents** make authenticated requests to external services
4. **Data** is processed and displayed in your dashboard

### **Environment Variables in Render**
```bash
REACT_APP_REVENUE_RIPPLE_URL=https://revenueripple.org
REACT_APP_REVENUE_RIPPLE_API_KEY=rr_u_5n6KxpNEx2hsa32s3_gfGgVIo5hjfC2esJr7CBPtk
```

### **How Agents Work**

#### **KPI Tracker Agent**
- **Fetches**: Revenue, conversion rates, user acquisition
- **Source**: Revenue Ripple API
- **Frequency**: Every 2 minutes
- **Data**: Real-time business metrics

#### **Revenue Ripple Tracker Agent**
- **Fetches**: Transaction data, revenue trends
- **Source**: Revenue Ripple API
- **Frequency**: Every minute
- **Data**: Detailed revenue analytics

#### **Funnel Tester Agent**
- **Fetches**: Conversion funnel data
- **Source**: Revenue Ripple + Analytics APIs
- **Frequency**: Every 2 minutes
- **Data**: Funnel performance metrics

### **Data Sources for Different Agents**

| Agent | Data Source | API Key | Purpose |
|-------|-------------|---------|---------|
| KPI Tracker | Revenue Ripple | `REACT_APP_REVENUE_RIPPLE_API_KEY` | Revenue metrics |
| Revenue Ripple Tracker | Revenue Ripple | `REACT_APP_REVENUE_RIPPLE_API_KEY` | Transaction data |
| Funnel Tester | Revenue Ripple + Analytics | Multiple keys | Conversion optimization |
| Health Monitor | System metrics | None | Infrastructure health |
| Webhook Validator | Webhook endpoints | Various | Payment verification |

### **Adding More Business Data Sources**

To integrate additional business systems:

1. **Add API Keys to Render Environment Variables:**
   ```bash
   STRIPE_API_KEY=sk_live_...
   SHOPIFY_API_KEY=shpca_...
   GOOGLE_ANALYTICS_KEY=...
   ```

2. **Update Agent Configuration:**
   ```javascript
   // In server/agents/KPITrackerAgent.ts
   const stripeData = await fetchStripeData(process.env.STRIPE_API_KEY);
   const shopifyData = await fetchShopifyData(process.env.SHOPIFY_API_KEY);
   ```

3. **Create New Agents:**
   ```javascript
   // Example: Stripe Payment Tracker
   class StripePaymentAgent extends BaseAgent {
     async execute() {
       const payments = await this.fetchStripePayments();
       const analytics = this.analyzePaymentTrends(payments);
       return analytics;
     }
   }
   ```

### **Database Integration (Optional)**

For direct database access, you can add database agents:

```javascript
// Example: Database Agent
class DatabaseAgent extends BaseAgent {
  constructor() {
    super('database-agent', 'Database Agent', io, {
      interval: 300000, // 5 minutes
      settings: {
        databaseUrl: process.env.DATABASE_URL,
        queries: [
          'SELECT revenue FROM transactions WHERE date >= NOW() - INTERVAL 30 DAY',
          'SELECT conversion_rate FROM funnels WHERE active = true'
        ]
      }
    });
  }

  async execute() {
    const results = await this.runDatabaseQueries();
    return this.processDatabaseResults(results);
  }
}
```

### **Revenue Ripple Specific Integration**

The Revenue Ripple integration provides:

1. **Real-time Revenue Tracking**
   - Transaction monitoring
   - Revenue trend analysis
   - Payment processing status

2. **KPI Monitoring**
   - Conversion rates
   - Customer acquisition costs
   - Lifetime value calculations

3. **Automated Insights**
   - Revenue decline alerts
   - Growth opportunity detection
   - Performance optimization recommendations

### **Testing the Integration**

1. **Check Environment Variables:**
   ```bash
   # In Render dashboard
   REACT_APP_REVENUE_RIPPLE_URL=https://revenueripple.org
   REACT_APP_REVENUE_RIPPLE_API_KEY=rr_u_5n6KxpNEx2hsa32s3_gfGgVIo5hjfC2esJr7CBPtk
   ```

2. **Test API Connection:**
   ```bash
   curl -H "Authorization: Bearer rr_u_5n6KxpNEx2hsa32s3_gfGgVIo5hjfC2esJr7CBPtk" \
        https://revenueripple.org/api/v1/metrics
   ```

3. **Monitor Agent Logs:**
   ```bash
   # Check if agents are fetching data
   curl https://devopsmodules.onrender.com/api/agents
   ```

### **Scaling for Other Businesses**

To sell this to other solopreneurs:

1. **Multi-tenant Architecture:**
   ```javascript
   // Support multiple businesses
   class MultiTenantAgent extends BaseAgent {
     async execute() {
       const businessId = this.config.businessId;
       const apiKey = await this.getBusinessApiKey(businessId);
       return await this.fetchBusinessData(apiKey);
     }
   }
   ```

2. **Business-specific Configuration:**
   ```javascript
   // Each business gets their own config
   const businessConfigs = {
     'business-1': {
       revenueRippleKey: 'rr_u_...',
       stripeKey: 'sk_live_...',
       customMetrics: ['revenue', 'conversion']
     }
   };
   ```

3. **White-label Dashboard:**
   - Custom branding per business
   - Business-specific metrics
   - Isolated data storage

### **Immediate Next Steps**

1. **Verify CORS Fix** - Test if frontend can now connect to backend
2. **Check Revenue Ripple Connection** - Ensure API keys are working
3. **Monitor Agent Execution** - Verify agents are fetching real data
4. **Add More Data Sources** - Integrate additional business systems
5. **Create Business Dashboard** - Customize for your specific needs

### **Revenue Model for Other Solopreneurs**

- **Basic Plan**: $29/month - Core agents + Revenue Ripple integration
- **Pro Plan**: $79/month - All agents + multiple integrations
- **Enterprise**: $199/month - Custom agents + white-label solution

The system is designed to be immediately usable for your business while being easily adaptable for other solopreneurs. 