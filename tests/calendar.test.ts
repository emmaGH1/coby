import assert from 'node:assert/strict';
import test from 'node:test';
import { calendarWeek } from '../src/domain/calendar';
import { DemoClock } from '../src/domain/clock';

test('Calendar has seven local days, starts Monday, and includes recent days', () => {
  const clock=new DemoClock(new Date(2026,8,30,17));
  const week=calendarWeek(clock);
  assert.equal(week.length,7);
  assert.equal(week[0].getDay(),1);
  assert.equal(week[6].getDay(),0);
  assert.equal(week[0].getDate(),28);
  assert.equal(week[2].toDateString(),clock.now().toDateString());
  assert.equal(new Set(week.map(day=>day.toDateString())).size,7);
});

test('previous and next weeks cross month boundaries without changing the clock', () => {
  const clock=new DemoClock(new Date(2026,8,30,17));
  assert.equal(calendarWeek(clock,-1)[0].getDate(),21);
  assert.equal(calendarWeek(clock,1)[0].getMonth(),9);
  assert.equal(calendarWeek(clock,1)[0].getDate(),5);
  assert.equal(clock.now().getDate(),30);
});
