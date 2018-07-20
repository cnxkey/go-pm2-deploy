/*
注意！pm2配置文件如果是js，文件名一定要.config.js结尾

要确保服务器安装了pm2，并且你的电脑能够通过公钥ssh登录到服务器
首次部署前要执行(prod是你要部署的环境)
  pm2 deploy prod setup  // 如果配置文件不是ecosystem.config.js 则要指定配置文件的文件名 pm2 deploy xx.config.js prod setup
之后每次部署执行
  pm2 deploy prod [update]
撤回上一版本(可以通过pm2 deploy prod list获取所有版本)
  pm2 deploy revert 1
*/
module.exports = {
    /**
     * Deployment section
     * http://pm2.keymetrics.io/docs/usage/deployment/
     */
    deploy: {
        prod: {
            user: 'zengming',
            host: ['192.168.58.142'],
            ref: 'origin/master',
            repo: 'https://github.com/zengming00/go-pm2-deploy.git',
            path: '/home/zengming/www/prod', // 整个部署环境的位置
            'pre-deploy': 'dep version && pwd && git reset --hard HEAD',   // 远程服务器部署前执行的命令，在更新代码之前
            'post-deploy': 'cd src/main && dep ensure && go build -o main && pm2 reload pm2/prod.config.js',
            env: { // post-deploy时的环境变量（app重启后还在）
                GOPATH: '/home/zengming/www/prod/current',  // 代码位置current是pm2自动加上的
            }
        },
        dev: {
            user: 'zengming',
            host: ['192.168.58.142'],
            ref: 'origin/master',
            repo: 'https://github.com/zengming00/go-pm2-deploy.git',
            path: '/home/zengming/www/dev',
            'pre-deploy': 'dep version && pwd',
            'post-deploy': 'cd src/main && dep ensure && go build -o main && pm2 reload pm2/dev.config.js',
            env: {
                GOPATH: '/home/zengming/www/dev/current',
            }
        },
    }
};
