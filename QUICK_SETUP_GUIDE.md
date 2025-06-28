# 🚀 Quick Setup Guide - DevOps Modules Configuration

## Step 1: Add to Your Revenue Ripple Admin Panel

### Option A: If you're using WordPress-based Revenue Ripple
1. Add the code from `revenue-ripple-admin-config.php` to your theme's `functions.php` file or create a plugin
2. This adds a "DevOps Modules" menu item to your admin panel

### Option B: If you're using a custom admin panel
Add this configuration section to your existing admin settings:

```php
// In your admin panel settings
$devops_config = [
    'enabled' => true,
    'api_key' => 'your-generated-api-key-here', // Generate a secure 32-character key
    'webhook_secret' => 'your-webhook-secret',   // Generate another secure key
    'devops_url' => 'https://devops.your-domain.com',
    'integration_mode' => 'embedded' // or 'standalone' or 'iframe'
];
```

## Step 2: Configure Your DevOps Modules

### 1. Environment Configuration

1. **Copy the production environment file**:
   ```bash
   cp env.production .env
   ```

2. **Edit `.env` with your settings**:
   ```env
   REACT_APP_REVENUE_RIPPLE_URL=https://revenueripple.org
   REACT_APP_REVENUE_RIPPLE_API_KEY=rr_u_5n6KxpNEx2hsa32s3_gfGgVIo5hjfC2esJr7CBPtk
   CLIENT_URL=https://devops.revenueripple.org
   PORT=3001
   ```

## Step 3: Start the DevOps Modules

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

The application will be available at https://devops.revenueripple.org

## Step 4: Test the Integration

1. **Open the DevOps modules dashboard** at https://devops.revenueripple.org
2. **Complete the setup wizard** that appears on first run
3. **Verify connection** - you should see "Connected" status in the top-right
4. **Check the dashboard metrics** - should show sample data

## Step 5: Production Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options

#### Option A: Embedded in Revenue Ripple
1. Upload the `dist/` folder to your web server
2. Add this code to your Revenue Ripple admin dashboard template:

```html
<!-- Add where you want the DevOps dashboard to appear -->
<div id="devops-modules-root"></div>
<script src="https://devops.your-domain.com/embed.js"></script>
<script>
DevOpsModules.init({
  container: '#devops-modules-root',
  mode: 'embedded',
  config: {
    apiKey: 'your-api-key',
    baseUrl: 'https://your-revenue-ripple.com'
  }
});
</script>
```

#### Option B: Standalone Dashboard
1. Deploy to a subdomain like `devops.your-domain.com`
2. Configure OAuth integration in your Revenue Ripple admin panel
3. Add a link to the DevOps dashboard in your admin navigation

#### Option C: iFrame Widgets
Add specific widgets to your admin pages:

```html
<!-- Revenue metrics widget -->
<iframe 
  src="https://devops.your-domain.com/widgets/revenue"
  width="100%" 
  height="300"
  frameborder="0">
</iframe>
```

## Troubleshooting

### Issue: "Configuration not found"
- **Solution**: Make sure you've added the DevOps modules configuration to your Revenue Ripple admin panel
- **Check**: API key is generated and saved in your admin settings

### Issue: "Connection failed"
- **Solution**: Verify the Revenue Ripple URL in your `.env` file
- **Check**: Make sure your Revenue Ripple site is accessible from where DevOps modules are running

### Issue: "API key invalid"
- **Solution**: Copy the exact API key from your Revenue Ripple admin panel
- **Check**: No extra spaces or characters in the API key

### Issue: "Webhooks not working"
- **Solution**: Verify the webhook secret matches in both systems
- **Check**: Your Revenue Ripple site can reach the DevOps modules URL

## What You'll See After Setup

### Dashboard Metrics
- **Total Agents**: 12 (9 active)
- **Success Rate**: 96.8%
- **Revenue Generated**: $125K this month
- **Cost Saved**: $35K through automation

### Available Agents
- **AB Optimizer**: A/B testing automation
- **Revenue Tracker**: Revenue metrics sync
- **Deploy Bot**: Automated deployments
- **KPI Monitor**: Performance tracking
- **And 16 more specialized agents...**

### Integration Status
- **Connected** indicator in top-right corner
- **Real-time sync** with your Revenue Ripple data
- **Webhook processing** for live updates

## Next Steps After Setup

1. **Configure Individual Agents**: Click on each agent to set up specific automation rules
2. **Set Up Webhooks**: Configure webhook endpoints for real-time updates
3. **Customize Dashboard**: Arrange widgets and metrics to your preference
4. **Add Team Members**: Configure access permissions for your team
5. **Schedule Reports**: Set up automated daily/weekly performance reports

## Support

- **Setup Issues**: Check the troubleshooting section above
- **Integration Problems**: Verify API keys and URLs are correct
- **Feature Requests**: Add new agent types or dashboard features
- **Documentation**: See `DEVOPS_MODULES_INTEGRATION_GUIDE.md` for detailed docs

---

## 🎉 You're Ready!

Once configured, your DevOps modules will automatically:
- ✅ Track revenue impact from automation
- ✅ Monitor system performance and uptime  
- ✅ Run A/B tests and optimize conversions
- ✅ Deploy code and manage infrastructure
- ✅ Send performance reports and alerts

Your Revenue Ripple admin panel now has comprehensive DevOps automation with full revenue attribution!