<?php
/**
 * Revenue Ripple Admin Panel - DevOps Modules Configuration
 * Add this to your existing admin panel configuration
 */

// Add to your admin panel menu/navigation
function add_devops_modules_menu() {
    add_submenu_page(
        'revenue-ripple-admin',
        'DevOps Modules',
        'DevOps Modules',
        'manage_options',
        'devops-modules',
        'devops_modules_settings_page'
    );
}
add_action('admin_menu', 'add_devops_modules_menu');

// DevOps Modules Settings Page
function devops_modules_settings_page() {
    // Handle form submission
    if (isset($_POST['submit'])) {
        update_option('devops_modules_enabled', $_POST['enabled']);
        update_option('devops_modules_api_key', wp_generate_password(32, false));
        update_option('devops_modules_webhook_secret', wp_generate_password(32, false));
        update_option('devops_modules_url', $_POST['devops_url']);
        update_option('devops_modules_mode', $_POST['integration_mode']);
        
        echo '<div class="notice notice-success"><p>DevOps Modules configuration saved!</p></div>';
    }

    $enabled = get_option('devops_modules_enabled', false);
    $api_key = get_option('devops_modules_api_key', '');
    $webhook_secret = get_option('devops_modules_webhook_secret', '');
    $devops_url = get_option('devops_modules_url', '');
    $integration_mode = get_option('devops_modules_mode', 'embedded');
    ?>
    
    <div class="wrap">
        <h1>DevOps Modules Configuration</h1>
        
        <form method="post" action="">
            <table class="form-table">
                <tr>
                    <th scope="row">Enable DevOps Modules</th>
                    <td>
                        <input type="checkbox" name="enabled" value="1" <?php checked($enabled, 1); ?> />
                        <label>Enable DevOps automation and monitoring</label>
                    </td>
                </tr>
                
                <tr>
                    <th scope="row">DevOps Modules URL</th>
                    <td>
                        <input type="url" name="devops_url" value="<?php echo esc_attr($devops_url); ?>" 
                               placeholder="https://devops.your-domain.com" class="regular-text" />
                        <p class="description">URL where your DevOps modules are hosted</p>
                    </td>
                </tr>
                
                <tr>
                    <th scope="row">Integration Mode</th>
                    <td>
                        <select name="integration_mode">
                            <option value="embedded" <?php selected($integration_mode, 'embedded'); ?>>
                                Embedded (Recommended)
                            </option>
                            <option value="standalone" <?php selected($integration_mode, 'standalone'); ?>>
                                Standalone Dashboard
                            </option>
                            <option value="iframe" <?php selected($integration_mode, 'iframe'); ?>>
                                iFrame Widgets
                            </option>
                        </select>
                    </td>
                </tr>
                
                <tr>
                    <th scope="row">API Key</th>
                    <td>
                        <input type="text" value="<?php echo esc_attr($api_key); ?>" readonly class="regular-text" />
                        <p class="description">
                            Auto-generated API key for DevOps modules communication<br>
                            <strong>Copy this key to your DevOps modules .env.local file</strong>
                        </p>
                    </td>
                </tr>
                
                <tr>
                    <th scope="row">Webhook Secret</th>
                    <td>
                        <input type="text" value="<?php echo esc_attr($webhook_secret); ?>" readonly class="regular-text" />
                        <p class="description">
                            Webhook signing secret for secure communication<br>
                            <strong>Copy this to your DevOps modules .env.local file</strong>
                        </p>
                    </td>
                </tr>
            </table>
            
            <?php submit_button('Save Configuration'); ?>
        </form>
        
        <?php if ($enabled && $api_key): ?>
        <div class="card">
            <h2>Integration Instructions</h2>
            <p>Add this to your DevOps modules <code>.env.local</code> file:</p>
            <textarea readonly style="width: 100%; height: 150px; font-family: monospace;">
REACT_APP_REVENUE_RIPPLE_URL=<?php echo home_url(); ?>

REACT_APP_REVENUE_RIPPLE_API_KEY=<?php echo $api_key; ?>

REACT_APP_WEBHOOK_SECRET=<?php echo $webhook_secret; ?>

REACT_APP_ADMIN_PANEL_URL=/wp-admin
REACT_APP_INTEGRATION_MODE=<?php echo $integration_mode; ?>
            </textarea>
        </div>
        <?php endif; ?>
        
        <?php if ($integration_mode === 'embedded'): ?>
        <div class="card">
            <h2>Embedded Integration Code</h2>
            <p>Add this to your admin dashboard template:</p>
            <textarea readonly style="width: 100%; height: 100px; font-family: monospace;">
<div id="devops-modules-root"></div>
<script src="<?php echo $devops_url; ?>/embed.js"></script>
<script>
DevOpsModules.init({
  container: '#devops-modules-root',
  mode: 'embedded',
  config: {
    apiKey: '<?php echo $api_key; ?>',
    baseUrl: '<?php echo home_url(); ?>'
  }
});
</script>
            </textarea>
        </div>
        <?php endif; ?>
    </div>
    <?php
}

// API endpoints for DevOps modules communication
add_action('rest_api_init', function () {
    // Configuration endpoint
    register_rest_route('revenue-ripple/v1', '/devops/config', array(
        'methods' => 'GET',
        'callback' => 'devops_get_config',
        'permission_callback' => 'devops_check_api_key'
    ));
    
    // Metrics endpoint
    register_rest_route('revenue-ripple/v1', '/devops/metrics', array(
        'methods' => 'POST',
        'callback' => 'devops_receive_metrics',
        'permission_callback' => 'devops_check_api_key'
    ));
    
    // Webhook endpoint
    register_rest_route('revenue-ripple/v1', '/devops/webhooks', array(
        'methods' => 'POST',
        'callback' => 'devops_process_webhook',
        'permission_callback' => 'devops_verify_webhook'
    ));
});

// Check API key for authentication
function devops_check_api_key($request) {
    $api_key = get_option('devops_modules_api_key');
    $provided_key = $request->get_header('Authorization');
    
    if (!$provided_key || !$api_key) {
        return false;
    }
    
    return str_replace('Bearer ', '', $provided_key) === $api_key;
}

// Verify webhook signature
function devops_verify_webhook($request) {
    $webhook_secret = get_option('devops_modules_webhook_secret');
    $signature = $request->get_header('X-Webhook-Signature');
    $body = $request->get_body();
    
    $expected_signature = 'sha256=' . hash_hmac('sha256', $body, $webhook_secret);
    
    return hash_equals($expected_signature, $signature);
}

// Get configuration for DevOps modules
function devops_get_config($request) {
    return new WP_REST_Response(array(
        'status' => 'success',
        'data' => array(
            'enabled' => get_option('devops_modules_enabled'),
            'agents' => array(
                'revenue_tracking' => true,
                'ab_testing' => true,
                'kpi_monitoring' => true,
                'deployment' => true,
                'analytics' => true
            ),
            'api_keys' => array(
                'stripe' => get_option('stripe_api_key', ''),
                'google_analytics' => get_option('ga_tracking_id', ''),
                'mailchimp' => get_option('mailchimp_api_key', ''),
                // Add other service API keys here
            ),
            'site_url' => home_url(),
            'admin_url' => admin_url()
        )
    ), 200);
}

// Receive metrics from DevOps modules
function devops_receive_metrics($request) {
    $metrics = $request->get_json_params();
    
    // Store metrics in database
    global $wpdb;
    $table_name = $wpdb->prefix . 'devops_metrics';
    
    $wpdb->insert(
        $table_name,
        array(
            'agent_type' => $metrics['agent'],
            'revenue_amount' => $metrics['revenue_generated'],
            'metric_data' => json_encode($metrics),
            'created_at' => current_time('mysql')
        )
    );
    
    return new WP_REST_Response(array('status' => 'success'), 200);
}

// Process webhooks from DevOps modules
function devops_process_webhook($request) {
    $data = $request->get_json_params();
    
    // Process different webhook events
    switch ($data['event']) {
        case 'revenue_generated':
            // Update revenue tracking
            update_option('devops_total_revenue', 
                get_option('devops_total_revenue', 0) + $data['data']['amount']
            );
            break;
            
        case 'agent_status_changed':
            // Log agent status changes
            error_log('DevOps Agent Status: ' . $data['data']['agent'] . ' is now ' . $data['data']['status']);
            break;
            
        case 'deployment_completed':
            // Handle deployment notifications
            break;
    }
    
    return new WP_REST_Response(array('status' => 'processed'), 200);
}

// Create database table for metrics (run once)
function devops_create_metrics_table() {
    global $wpdb;
    
    $table_name = $wpdb->prefix . 'devops_metrics';
    
    $charset_collate = $wpdb->get_charset_collate();
    
    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        agent_type varchar(50) NOT NULL,
        revenue_amount decimal(10,2) DEFAULT 0,
        metric_data text,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}
register_activation_hook(__FILE__, 'devops_create_metrics_table');
?>