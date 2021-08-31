import dotenvSafe from 'dotenv-safe';
import { AxiosRequestConfig } from 'axios';
import { SocksProxyAgent, SocksProxyAgentOptions } from 'socks-proxy-agent';

dotenvSafe.config();

const proxyConfig: SocksProxyAgentOptions = {
    host: process.env.PROXY_HOST!,
    port: process.env.PROXY_PORT!,
    username: process.env.PROXY_USERNAME!,
    password: process.env.PROXY_PASSWORD!
};

const proxyAgent = new SocksProxyAgent(proxyConfig);

const axiosConfig: AxiosRequestConfig = {
    httpsAgent: proxyAgent,
    httpAgent: proxyAgent,
    proxy: false
};

export default axiosConfig;
