import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';

type Story = StoryObj;

export default {
  title: 'Avatar'
};

export const Basic: Story = {
  render: () =>
    html`
      <style>
        section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
      </style>
      <section>
        <sl-avatar uniqueProfileId="1"></sl-avatar>
        <sl-avatar uniqueProfileId="2"></sl-avatar>
        <sl-avatar uniqueProfileId="3"></sl-avatar>
        <sl-avatar uniqueProfileId="4"></sl-avatar>
        <sl-avatar uniqueProfileId="5"></sl-avatar>
      </section>
    `
};