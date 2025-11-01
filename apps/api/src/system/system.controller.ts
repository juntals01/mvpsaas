// apps/api/src/system/system.controller.ts
import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { SystemStateService } from './system-state.service';

function ceilToInterval(date: Date, minutes: number) {
  const d = new Date(date);
  d.setSeconds(0, 0);
  const m = d.getMinutes();
  const offset = minutes - (m % minutes || 0);
  d.setMinutes(m + (offset === minutes ? 0 : offset));
  if (d <= date) d.setMinutes(d.getMinutes() + minutes);
  return d;
}

@Controller('system')
export class SystemController {
  constructor(private readonly state: SystemStateService) {}

  @Post('reset/mark')
  async mark(
    @Headers('x-internal-token') token: string,
    @Body('intervalMinutes') intervalMinutes = 15,
  ) {
    if (token !== process.env.INTERNAL_TOKEN) return { ok: false };
    const last = new Date();
    const next = new Date(last.getTime() + intervalMinutes * 60_000);
    await this.state.set('lastResetAt', last.toISOString());
    await this.state.set('nextResetAt', next.toISOString());
    return {
      ok: true,
      lastResetAt: last.toISOString(),
      nextResetAt: next.toISOString(),
    };
  }

  @Get('reset/status')
  async status() {
    const intervalMinutes =
      Number(process.env.RESET_INTERVAL_MINUTES) > 0
        ? Number(process.env.RESET_INTERVAL_MINUTES)
        : 15;

    let next = await this.state.get('nextResetAt');
    let last = await this.state.get('lastResetAt');

    const now = new Date();

    if (!next) {
      if (last) {
        const computed = new Date(
          new Date(last).getTime() + intervalMinutes * 60_000,
        );
        next = computed.toISOString();
        // persist so subsequent calls are stable
        await this.state.set('nextResetAt', next);
      } else {
        const computed = ceilToInterval(now, intervalMinutes);
        next = computed.toISOString();
        // also set last ~ interval ago so UI can show both
        const pseudoLast = new Date(
          computed.getTime() - intervalMinutes * 60_000,
        ).toISOString();
        last = last ?? pseudoLast;
        await this.state.set('nextResetAt', next);
        await this.state.set('lastResetAt', last);
      }
    }

    return { ok: true, lastResetAt: last, nextResetAt: next, intervalMinutes };
  }
}
