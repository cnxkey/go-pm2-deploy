module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [
        {
            name: 'goapp_dev',
            script: './config/dev.json', // 将配置文件当成script
            instances: 1,
            exec_mode: 'fork',
            interpreter: "./main",  // 将go程序当成解释器
            // max_memory_restart: '200M',
            restart_delay: 1000 * 5,
            env: { // pm2启动app时指定的环境变量（app重启后还在）
                COMMON_VARIABLE: 'true',
                EEE: 'deveee',
            },
        },
    ],
};
