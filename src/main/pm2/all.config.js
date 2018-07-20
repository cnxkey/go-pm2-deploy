/*
同时包含了dev和prod的配置，通过pm2命令指定--env prod进行区分环境变量
但因为无法控制更多的内容，通常会将dev和prod配置拆分为不同的文件
*/
module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [
        {
            name: 'goapp',
            script: './config/prod.json', // 将配置文件当成script
            instances: 1,
            exec_mode: 'fork',
            interpreter: "./main",  // 将go程序当成解释器
            // max_memory_restart: '200M',
            restart_delay: 1000 * 5,
            env: { // pm2启动app时指定的环境变量（app重启后还在）
                COMMON_VARIABLE: 'true',
                EEE: 'defeee',
            },
            env_prod: { // pm2启动app时通过 --env prod 指定的附加环境变量，会添加到上面的env里面（重启后还在）
                PPP: "asdfasdf",
                EEE: 'prodeee',
            },
            env_dev: {
                PPP: "devvv",
            }
        },
    ],
};
