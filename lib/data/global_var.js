const { getRemoteConfig, createDir, createFile } = require("../utils");
const config = require("../data/config");

const key_map = new Map([['DedeUserID', 'myUID'], ['bili_jct', 'csrf']]);

let global_var = {
    inner: {},
    get(key) {
        return this.inner[key]
    },
    set(key, value) {
        this.inner[key] = value
    },
    /**
     * 全局变量初始化
     * 更新config
     * @param {string} cookie
     * @param {number} n
     */
    async init(cookie, n) {
        if (cookie) {
            config.updata(process.env.NUMBER);

            this.set('cookie', cookie);

            cookie.split(/\s*;\s*/).forEach(item => {
                const _item = item.split('=');
                if (key_map.has(_item[0]))
                    this.set(key_map.get(_item[0]), _item[1]);
            });

            const { UIDs = [], TAGs = [], Articles = [] } = config;
            this.set('Lottery', [
                ...UIDs.map(it => ['UIDs', it]),
                ...TAGs.map(it => ['TAGs', it]),
                ...Articles.map(it => ['Articles', it])
            ]);
            this.set('remoteconfig', await getRemoteConfig());
        }
        await createDir('dyids');
        await createFile(n < 2 ? 'dyid.txt' : `dyid${n}.txt`, '', 'a')
    }
};


module.exports = global_var;