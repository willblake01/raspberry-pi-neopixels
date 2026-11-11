// Pure: turns a Train Time status into LED frames.
//
//   Countdown  the bar drains toward "time to leave" (departure minus your
//              travel time): green, then amber in the last 10 minutes
//   Leave now  pulsing red until the train departs
//   On board   a teal bar fills as the ride progresses
//   Tight      red and amber blocks swap places: the connection is at risk
//   Missed     slow red pulse: the connection can't be made
//   No trip    a dim, steady glow
import { breatheScale } from '../effects/Breathe.js';
import { fillSolid, mixColors, packRGB, scaleColor } from '../effects/utils/color.js';
import type { RGB } from '../weather/colors.js';
import type { TripStatus } from './api.js';

export const TRAIN_COLORS = {
    idle: [40, 60, 120],
    countdown: [0, 200, 60],
    soon: [255, 140, 0],
    leave: [255, 0, 0],
    onBoard: [0, 150, 180],
    risk: [255, 0, 0],
    riskAlt: [255, 140, 0],
} as const satisfies Record<string, RGB>;

/** The bar covers the last hour before it's time to leave */
export const COUNTDOWN_WINDOW_MIN = 60;
/** Amber for the last few minutes before it's time to leave */
export const SOON_MIN = 10;
/** Before the countdown window, the full bar glows at this level */
export const FAR_LEVEL = 0.35;
/** Brightness of the empty part of a bar, so its full length stays visible */
export const TRACK_LEVEL = 0.08;

export const LEAVE_PULSE_MS = 1000;
export const MISSED_PULSE_MS = 3000;
/** Tight-connection blocks swap twice a second (well under the 3 flashes/second guideline) */
export const RISK_SWAP_MS = 500;
export const RISK_BLOCK = 5;

const MINUTE = 60_000;
const color = (rgb: RGB) => packRGB(...rgb);

/** A bar that is `fraction` full from the start of the strip, with a soft edge pixel */
export function buildBar(leds: number, fraction: number, rgb: RGB): Uint32Array {
    const lit = color(rgb);
    const track = scaleColor(lit, TRACK_LEVEL);
    const exact = Math.min(1, Math.max(0, fraction)) * leds;
    const full = Math.floor(exact);
    const edge = exact - full;

    const pixels = new Uint32Array(leds).fill(track);
    pixels.fill(lit, 0, full);
    if (edge > 0 && full < leds) pixels[full] = mixColors(track, lit, edge);
    return pixels;
}

const pulse = (leds: number, rgb: RGB, now: number, periodMs: number, floor: number) =>
    fillSolid(leds, scaleColor(color(rgb), breatheScale(now, periodMs, floor)));

function riskBlocks(leds: number, now: number): Uint32Array {
    const swapped = Math.floor(now / RISK_SWAP_MS) % 2 === 1;
    const a = color(TRAIN_COLORS.risk);
    const b = color(TRAIN_COLORS.riskAlt);
    return Uint32Array.from({ length: leds }, (_, i) => ((Math.floor(i / RISK_BLOCK) % 2 === 0) !== swapped ? a : b));
}

/** Minutes until the rider needs to leave for the station */
export const minutesToLeave = (status: TripStatus, now: number, travelMinutes: number) =>
    status.leg ? (Date.parse(status.leg.estimatedDeparture) - now) / MINUTE - travelMinutes : Infinity;

export function buildTripFrame(leds: number, status: TripStatus, now: number, travelMinutes: number): Uint32Array {
    const { leg, connection } = status;
    if (status.phase === 'none' || !leg) return fillSolid(leds, color(TRAIN_COLORS.idle));

    const departure = Date.parse(leg.estimatedDeparture);
    const leaveIn = minutesToLeave(status, now, travelMinutes);

    // Time to go beats everything else: nothing matters more than catching this train
    if (status.phase === 'upcoming' && leaveIn <= 0 && now < departure) {
        return pulse(leds, TRAIN_COLORS.leave, now, LEAVE_PULSE_MS, 0.25);
    }

    // Connection warnings while riding, or once the countdown has started
    const relevant = status.phase === 'onBoard' || leaveIn <= COUNTDOWN_WINDOW_MIN;
    if (relevant && connection?.risk === 'missed') return pulse(leds, TRAIN_COLORS.risk, now, MISSED_PULSE_MS, 0.2);
    if (relevant && connection?.risk === 'tight') return riskBlocks(leds, now);

    if (status.phase === 'onBoard') {
        const arrival = Date.parse(leg.estimatedArrival);
        const progress = arrival > departure ? (now - departure) / (arrival - departure) : 1;
        return buildBar(leds, progress, TRAIN_COLORS.onBoard);
    }

    if (leaveIn > COUNTDOWN_WINDOW_MIN) {
        return fillSolid(leds, scaleColor(color(TRAIN_COLORS.countdown), FAR_LEVEL));
    }
    return buildBar(leds, leaveIn / COUNTDOWN_WINDOW_MIN, leaveIn <= SOON_MIN ? TRAIN_COLORS.soon : TRAIN_COLORS.countdown);
}

const formatTime = (iso: string, timeZone: string) => {
    try {
        return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone });
    } catch {
        return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
};

/** One status line; it only changes when the train, its delay, or the connection changes */
export function describeTrip(status: TripStatus): string {
    const { leg, connection } = status;
    if (status.phase === 'none' || !leg) return '🚆 Train Time: no upcoming trains';

    const train = `#${leg.trainNum} ${leg.from.name} → ${leg.to.name}`;
    const delay = leg.delayMinutes > 0 ? ` (${leg.delayMinutes} min late)` : leg.live ? ' (on time)' : '';
    const when = status.phase === 'onBoard'
        ? `on board, arriving ${formatTime(leg.estimatedArrival, leg.to.tz)}`
        : `departs ${formatTime(leg.estimatedDeparture, leg.from.tz)}`;

    let line = `🚆 ${train}: ${when}${delay}`;
    if (connection?.risk === 'tight') line += `\n⚠️ Tight connection to #${connection.nextTrainNum} in ${connection.station}: ${connection.minutes} min`;
    if (connection?.risk === 'missed') line += `\n🚨 Connection to #${connection.nextTrainNum} in ${connection.station} will be missed`;
    return line;
}
