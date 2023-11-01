import type { TextInput } from './text-input';
import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';

describe('sl-text-input', () => {
  let el: TextInput, input: HTMLInputElement;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-input></sl-text-input>`);
      input = el.querySelector('input')!;
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should have an input slot', () => {
      const slot = el.renderRoot.querySelector('slot[name="input"]');

      expect(slot).not.to.be.null;
    });

    it('should not be disabled', () => {
      expect(el.disabled).to.be.undefined;
      expect(input.disabled).to.be.false;
    });

    it('should be disabled if set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
      expect(input.disabled).to.be.true;
    });

    it('should not have a value', () => {
      expect(el.value).to.be.null;
      expect(input.value).to.equal('');
    });

    it('should have a value when set', async() => {
      el.value = 'my value';
      await el.updateComplete;

      expect(input.value).to.equal('my value');
    });

    it('should have a medium size', () => {
      expect(el.size).to.equal('md');
      expect(el).to.have.attribute('size', 'md');
    });

    it('should have a large size when set', async () => {
      el.size = 'lg';
      await el.updateComplete;

      expect(el).to.have.attribute('size', 'lg');
    });

    it('should not be readonly', () => {
      expect(el.readonly).to.be.undefined;
      expect(input.readOnly).to.be.false;
    });

    it('should be readonly when set', async () => {
      el.readonly = true;
      await el.updateComplete;

      expect(el).to.have.attribute('readonly');
      expect(input.readOnly).to.be.true;
    });

    it('should have autocomplete turned off', () => {
      expect(el.autocomplete).to.be.undefined;
      expect(input).to.have.attribute('autocomplete', 'off');
    });

    it('should have autocomplete when set', async () => {
      el.autocomplete = 'on';
      await el.updateComplete;

      expect(input).to.have.attribute('autocomplete', 'on');
    });

    it('should not have a placeholder', () => {
      expect(el.placeholder).to.be.undefined;
      expect(input).to.have.attribute('placeholder', '');
    });

    it('should have a placeholder when set', async () => {
      el.placeholder = 'my placeholder';
      await el.updateComplete;

      expect(input).to.have.attribute('placeholder', 'my placeholder');
    });

    it('should have a text type', () => {
      expect(el.type).to.equal('text');
      expect(input.type).to.equal('text');
    });

    it('should have a type when set', async () => {
      el.type = 'email';
      await el.updateComplete;

      expect(input.type).to.equal('email');
    });

    it('should not have a pattern by default', () => {
      expect(el.pattern).to.be.undefined;
      expect(input).not.to.have.attribute('pattern');
    });

    it('should have a pattern when set', async () => {
      el.pattern = '.{3,5}';
      await el.updateComplete;

      expect(input).to.have.attribute('pattern', '.{3,5}');
    });

    it('should not have a max', () => {
      expect(el.max).to.be.undefined;
      expect(input).not.to.have.attribute('max');
    });

    it('should have a max when set', async () => {
      el.max = 3;
      await el.updateComplete;

      expect(input).to.have.attribute('max', '3');
    });

    it('should not have a min', () => {
      expect(el.min).to.be.undefined;
      expect(input).not.to.have.attribute('min');
    });

    it('should have a min when set', async () => {
      el.min = 3;
      await el.updateComplete;

      expect(input).to.have.attribute('min', '3');
    });

    it('should not have a maxlength', () => {
      expect(el.maxLength).to.be.undefined;
      expect(el).not.to.have.attribute('maxlength');
    });

    it('should have a maxlength when set', async () => {
      el.maxLength = 3;
      await el.updateComplete;

      expect(input).to.have.attribute('maxlength', '3');
    });

    it('should not have a minlength', () => {
      expect(el.minLength).to.be.undefined;
      expect(el).not.to.have.attribute('minlength');
    });

    it('should have a minlength when set', async () => {
      el.minLength = 3;
      await el.updateComplete;

      expect(input).to.have.attribute('minlength', '3');
    })

    it('should not have show-valid', () => {
      expect(el.showValid).to.be.undefined;
      expect(el).not.to.have.attribute('show-valid');
    });

    it('should have show-valid when set', async () => {
      el.showValid = true;
      await el.updateComplete;

      expect(el).to.have.attribute('show-valid');
    });

    it('should not have a step', () => {
      expect(el.step).to.be.undefined;
      expect(el).not.to.have.attribute('step');
    });

    it('should have a step when set', async () => {
      el.step = 3;
      await el.updateComplete;

      expect(input).to.have.attribute('step', '3');
    });

    it('should focus the input when clicking the wrapper', async () => {
      el.renderRoot.querySelector<HTMLElement>('.wrapper')?.click();

      expect(document.activeElement).to.equal(input);
    });

    it('should emit an sl-focus event when focusing the input', () => {
      const onFocus = spy();

      el.addEventListener('sl-focus', onFocus);
      input.focus();

      expect(onFocus).to.have.been.calledOnce;
    });

    it('should emit an sl-blur event when blurring the input', async () => {
      const onBlur = spy();

      el.addEventListener('sl-blur', onBlur);
      input.focus();
      await sendKeys({ press: 'Tab' });

      expect(onBlur).to.have.been.calledOnce;
    });

    it('should emit an sl-change event when leaving the input after typing', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      input.focus();
      await sendKeys({ type: 'Lorem' });

      expect(onChange).not.to.have.been.called;

      await sendKeys({ press: 'Tab' });

      expect(onChange).to.have.been.calledOnce;
    });

    it('should emit an sl-input event when typing in the input', async () => {
      const onInput = spy();

      el.addEventListener('sl-input', onInput);
      input.focus();
      await sendKeys({ type: 'Lorem' });

      expect(onInput.callCount).to.equal(5);
    });
  });

  describe('invalid', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-input required></sl-text-input>`);
      input = el.querySelector('input')!;
    });

    it('should have an invalid input', () => {
      expect(input.matches(':invalid')).to.be.true;
      expect(input.validity.valid).to.be.false;
      expect(input.validity.valueMissing).to.be.true;
    });

    it('should not have an error message', () => {
      expect(el.querySelector('[slot="error-text"]')).to.not.exist;
    });

    it('should have a show-validity attribute when reported', async () => {
      el.reportValidity();
      await el.updateComplete;

      expect(el).to.have.attribute('show-validity', 'invalid');
    });

    it('should have an error message when reported', async () => {
      el.reportValidity();
      await el.updateComplete;

      const error = el.querySelector('[slot="error-text"]');
      expect(error).to.exist;
      expect(error).to.have.trimmed.text('Please fill out this field.')
    });

    it('should not show a hint when reported', async () => {
      const hint = el.renderRoot.querySelector('sl-hint');

      el.hintText = 'Lorem ipsum';
      await el.updateComplete;

      expect(hint).not.to.have.style('display', 'none');

      el.reportValidity();
      await el.updateComplete;

      expect(hint).to.have.style('display', 'none');
    });

    it('should show a warning icon when reported', async () => {
      el.reportValidity();
      await el.updateComplete;

      const icon = el.renderRoot.querySelector('sl-icon');
      expect(icon).to.exist;
      expect(icon).to.have.attribute('name', 'triangle-exclamation-solid');
    });
  });

  describe('valid', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-input required value="foo"></sl-text-input>`);
      input = el.querySelector('input')!;
    });

    it('should have an valid input', () => {
      expect(input.matches(':valid')).to.be.true;
      expect(input.validity.valid).to.be.true;
      expect(input.validity.valueMissing).to.be.false;
    });

    it('should not have an error message', () => {
      expect(el.querySelector('[slot="error-text"]')).to.not.exist;
    });

    it('should have a show-validity attribute when reported', async () => {
      el.reportValidity();
      await el.updateComplete;

      expect(el).to.have.attribute('show-validity', 'valid');
    });

    it('should not show a correct icon when reported', async () => {
      el.reportValidity();
      await el.updateComplete;

      expect(el.renderRoot.querySelector('sl-icon')).not.to.exist;
    });

    it('should show a correct icon when show-valid and reported', async () => {
      el.showValid = true;
      el.reportValidity();
      await el.updateComplete;

      const icon = el.renderRoot.querySelector('sl-icon');
      expect(icon).to.exist;
      expect(icon).to.have.attribute('name', 'circle-check-solid');
    });
  });

  describe('slotted input', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-text-input>
          <input id="foo" slot="input" placeholder="I am a custom input" type="color"/>
        </sl-text-input>
      `);

      input = el.querySelector('input')!;
    });

    it('should use the slotted input', () => {
      expect(el.input).to.equal(input);
    });

    it('should overwrite text input properties except for "type"', () => {
      expect(input).to.have.attribute('placeholder', '');
      expect(input.type).to.equal('color');
    });
  });

  describe('slotted prefix / suffix', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-text-input>
          <span slot="prefix">prefix example</span>
          <span slot="suffix">suffix example</span>
        </sl-text-input>
      `);
    });

    it('should use the slotted prefix', () => {
      const prefix = el.querySelector('[slot="prefix"]');

      expect(prefix).to.exist;
      expect(prefix).to.have.trimmed.text('prefix example');
    });

    it('should use the slotted suffix', () => {
      const prefix = el.querySelector('[slot="suffix"]');

      expect(prefix).to.exist;
      expect(prefix).to.have.trimmed.text('suffix example');
    });
  });
});
