import React from 'react';
import Select from 'react-select';
import { PublicInteractionTask } from '../src';
import puppeteerType from 'puppeteer-core';

// @ts-ignore
import p from '../puppeteer-core';

const puppeteer: typeof puppeteerType = p;

export default {
  title: 'Examples',
};

const options = Array.from({ length: 1000 }, (_, k) => ({
  value: `Option ${k}`,
  label: `Option ${k}`,
}));

function SelectExample() {
  return (
    <div>
      <Select
        placeholder={`Select with ${options.length} items`}
        classNamePrefix="addon"
        options={options}
        instanceId="stable"
      />
    </div>
  );
}

export const select = () => <SelectExample />;

const interactionTasks: PublicInteractionTask[] = [
  {
    name: 'Display dropdown',
    description: 'Open the dropdown and wait for Option 5 to load',
    run: async (/*  container, controls }: InteractionTaskArgs */): Promise<void> => {
      const response = await fetch('/performance/browser');

      const browserWSEndpoint = await response.text();
      const browser = await puppeteer.connect({ browserWSEndpoint });
      const page = await browser.newPage();

      await page.goto(window.location.href);
      await page.tracing.start({ path: '' });

      const measure = async () => {
        await page.evaluate(() => performance.mark('🚀 [start] Display dropdown'));
        return async () => {
          await page.evaluate(() => performance.mark('🚀 [stop] Display dropdown'));
        };
      };

      /*  userland code start */
      const dropdown = await page.$('.addon__dropdown-indicator');
      const stop = await measure();
      await dropdown!.click();
      // await page.waitFor('#react-select-stable-option-5');
      await stop();
      /* userland code end */

      const buffer = await page.tracing.stop();
      await page.close();

      const trace = JSON.parse(buffer.toString());

      const marks = trace.traceEvents
        .filter((e: any) => e.cat === 'blink.user_timing')
        .filter((e: any) => e.name.startsWith('🚀'));

      const startMark = marks.find((t: any) => t.name.startsWith('🚀 [start]'));
      const stopMark = marks.find((t: any) => t.name.startsWith('🚀 [stop]'));

      console.log(`${((stopMark.ts - startMark.ts) / 1000).toFixed(2)}ms`);
    },
  },
];

select.story = {
  name: 'React select',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

export const noInteractions = () => <p>A story with no interactions 👋</p>;

function burnCpu() {
  const start = performance.now();
  while (performance.now() - start < 200) {}
}

function Slow() {
  burnCpu();

  return (
    <>
      A <strong>slow</strong> component
    </>
  );
}

export const slow = () => <Slow />;
