// Cloudflare Pages 函數類型定義
declare type PagesFunction<Env = any, Params extends string = any, Data extends Record<string, unknown> = Record<string, unknown>> = (
  context: EventContext<Env, Params, Data>
) => Response | Promise<Response>;

// 事件上下文類型
declare interface EventContext<Env, Params extends string, Data extends Record<string, unknown>> {
  request: Request;
  env: Env;
  params: Record<Params, string>;
  data: Data;
  waitUntil: (promise: Promise<any>) => void;
  next: (input?: RequestInfo, init?: RequestInit) => Promise<Response>;
} 