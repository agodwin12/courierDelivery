/**
 * Cron Job Scheduler
 * Automatically updates delivery positions every 5 minutes
 */

const cron = require('node-cron');
const DeliveryUpdater = require('../services/DeliveryUpdater');

class CronScheduler {
    constructor() {
        this.jobs = {};
        this.isRunning = false;
    }

    /**
     * Start all cron jobs
     */
    startAll() {
        console.log('🕐 Starting cron job scheduler...');

        // Delivery Position Updater - Runs every 5 minutes
        this.jobs.deliveryUpdater = cron.schedule('*/5 * * * *', async () => {
            try {
                console.log('\n⏰ [CRON] Delivery Position Update Started -', new Date().toLocaleString());

                const results = await DeliveryUpdater.updateAllActiveDeliveries();

                console.log('✅ [CRON] Delivery Position Update Completed');
                console.log('   - Success:', results.success);
                console.log('   - Failed:', results.failed);
                console.log('   - Delivered:', results.delivered);
                console.log('');

            } catch (error) {
                console.error('❌ [CRON] Error in delivery updater:', error);
            }
        });

        // Optional: Status Monitor - Runs every 30 minutes
        // Uncomment if you want periodic monitoring reports
        /*
        this.jobs.statusMonitor = cron.schedule('*\/30 * * * *', async () => {
            try {
                console.log('\n📊 [CRON] Status Monitor Started -', new Date().toLocaleString());

                const activeDeliveries = await DeliveryUpdater.getActiveDeliveriesStatus();

                console.log(`📦 Currently ${activeDeliveries.length} active deliveries`);
                activeDeliveries.forEach(delivery => {
                    console.log(`   ${delivery.tracking_number}: ${delivery.status} (${delivery.progress}%)`);
                });
                console.log('');

            } catch (error) {
                console.error('❌ [CRON] Error in status monitor:', error);
            }
        });
        */

        this.isRunning = true;
        console.log('✅ Cron jobs started successfully!');
        console.log('📅 Delivery updates will run every 5 minutes');
        console.log('');
    }

    /**
     * Stop all cron jobs
     */
    stopAll() {
        console.log('🛑 Stopping all cron jobs...');

        Object.keys(this.jobs).forEach(jobName => {
            if (this.jobs[jobName]) {
                this.jobs[jobName].stop();
                console.log(`   ✓ Stopped: ${jobName}`);
            }
        });

        this.jobs = {};
        this.isRunning = false;
        console.log('✅ All cron jobs stopped');
    }

    /**
     * Get status of cron scheduler
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            activeJobs: Object.keys(this.jobs).length,
            jobs: Object.keys(this.jobs)
        };
    }

    /**
     * Manually trigger delivery update (for testing)
     */
    async triggerDeliveryUpdate() {
        try {
            console.log('🔄 Manually triggering delivery update...');
            const results = await DeliveryUpdater.updateAllActiveDeliveries();
            console.log('✅ Manual update completed:', results);
            return results;
        } catch (error) {
            console.error('❌ Manual update failed:', error);
            throw error;
        }
    }
}

// Create singleton instance
const cronScheduler = new CronScheduler();

module.exports = cronScheduler;