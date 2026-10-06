import type { APIRoute } from 'astro';
import { CAL_EVENTS, calById, toIcs } from '../../data/calendar';

export function getStaticPaths() {
  return CAL_EVENTS.map((e) => ({ params: { id: e.id } }));
}

export const GET: APIRoute = ({ params }) =>
  new Response(toIcs(calById(params.id!)), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
