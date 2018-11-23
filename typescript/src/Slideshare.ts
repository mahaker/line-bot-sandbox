import { Hash } from 'crypto';
import * as crypto from 'crypto';
import { RequestOptions } from 'https';
// import parser from 'xml2json';
const parser = require('xml2json');
import * as https from "https";

export default class Slideshare {
    private readonly API_KEY: string = '';
    private readonly SHARED_SECRET: string = '';

    public async search(str: string): Promise<any> {
        const hash: Hash = crypto.createHash('sha1');
        const date: any = new Date();
        const ts: string = Math.floor(date / 1000).toString();
        const _hash = hash.update(this.SHARED_SECRET + ts);
        const hex = _hash.digest('hex');
        const options: RequestOptions = {
            hostname: 'www.slideshare.net',
            path: `/api/2/search_slideshows?api_key=${this.API_KEY}&ts=${ts}&hash=${hex}&q=${str}`,
            method: 'GET',
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (response) => {
                response.setEncoding('utf8');
                let body: string = '';
                response.on('data', (chunk)=>{
                    body += chunk;
                });
                response.on('end', ()=>{
                    // const xml = parser.toJson(body)
                    // const parsed = JSON.parse(xml);
                    // console.log(parsed);
                    resolve(body);
                });
            }).on('error', (err)=>{
                console.log('error:', err.stack);
                reject(err);
            });
            req.end();
        });
    }
}
