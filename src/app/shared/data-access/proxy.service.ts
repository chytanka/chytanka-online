import { Injectable } from '@angular/core';
import { Base64 } from '../utils/base64';

export const PROXY = `https://proxy-seven-xi.vercel.app`

@Injectable({
  providedIn: 'root'
})
export class ProxyService {
  proxyUrl(url: string): string {
    return `${PROXY}/api?url=${Base64.toBase64(url)}`
  }
}
