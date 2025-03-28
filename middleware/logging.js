import { Server } from 'bun';
import { log, log2consol } from '../utils/log'

export function logging(req, server){
  const url = new URL(req.url); 
  const ip = server.requestIP(req); 
  log2consol(`${Bun.color("white", "ansi")} ${new Date()} ${Bun.color("green", "ansi")} ${ip?.address} (${ip?.port}) ${req.method} ${url.pathname} SUCCESS \n`)
  log(`${new Date()} ${ip?.address} (${ip?.port}) ${req.method} ${url.pathname} SUCCESS \n`)
}

