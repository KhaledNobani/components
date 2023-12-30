import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import type { EventEmitter } from '@sl-design-system/shared';
import { EventsController, anchor, event, isPopoverOpen } from '@sl-design-system/shared';
import { localized, msg } from '@lit/localize';
import { LitElement, html } from 'lit';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';
import { SelectOption } from './select-option.js';
import { SelectOptionGroup } from './select-option-group.js';
import styles from './select.scss.js';
import { SelectButton } from './select-button.js';

const OBSERVER_OPTIONS: MutationObserverInit = {
  attributes: true,
  attributeFilter: ['selected', 'size'],
  attributeOldValue: true,
  subtree: true
};

export type SelectSize = 'md' | 'lg';

@localized()
export class Select extends FormControlMixin(ScopedElementsMixin(LitElement)) {
  /** @private */
  static formAssociated = true;

  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-select-button': SelectButton
    };
  }

  /** @private */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Events controller. */
  #events = new EventsController(this, {
    focusin: this.#onFocusin,
    focusout: this.#onFocusout
  });

  /** The initial state when the form was associated with the select. Used to reset the select. */
  #initialState: string | null = null;

  /** If an option is selected programmatically update all the options or the size of the select itself. */
  #observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'selected' && mutation.oldValue === null) {
        const option = <SelectOption>mutation.target;

        this.#observer.disconnect();
        this.#setSelectedOption(option);
        this.#observer.observe(this, OBSERVER_OPTIONS);
      }
    });
  });

  /** Since we can't use `popovertarget`, we need to monitor the closing state manually. */
  #popoverClosing = false;

  /** @private Element internals. */
  readonly internals = this.attachInternals();

  /** The button in the light DOM. */
  button!: SelectButton;

  /** Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<void>;

  /** Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<string | null>;

  /** Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<void>;

  /** @private */
  @queryAssignedElements({ selector: 'sl-select-option-group', flatten: false }) optionGroups?: SelectOptionGroup[];

  /** @private A flattened array of all options (even grouped ones). */
  get options(): SelectOption[] {
    const elements =
      this.renderRoot.querySelector<HTMLSlotElement>('slot:not([name])')?.assignedElements({ flatten: true }) ?? [];

    return elements.flatMap(element => this.#getAllOptions(element));
  }

  /**
   * The current option in the listbox. This is the option that will become the
   * selected option if the user presses Enter/Space.
   * @private
   */
  @state() currentOption?: SelectOption;

  /** Whether the select is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** The listbox element. */
  @query('[popover]') listbox!: HTMLElement;

  /** The placeholder text to show when no option is chosen. */
  @property() placeholder?: string;

  /** Whether the select is a required field. */
  @property({ type: Boolean, reflect: true }) required?: boolean;

  /** @private The selected option in the listbox. */
  @state() selectedOption?: SelectOption | null;

  /** When set will cause the control to show it is valid after reportValidity is called. */
  @property({ type: Boolean, attribute: 'show-valid' }) override showValid?: boolean;

  /** The size of the select. */
  @property({ reflect: true }) size: SelectSize = 'md';

  /** The value for the select, to be used in forms. */
  @property() value: string | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    // This is a workaround because `ariaActiveDescendantElement` is only supported in
    // Safari at the time of writing. By putting the button in the light DOM, we can use
    // the aria-activedescendant attribute on the button itself.
    if (!this.button) {
      this.button = this.shadowRoot?.createElement('sl-select-button') as SelectButton;
      this.button.addEventListener('click', () => this.#onButtonClick());
      this.button.addEventListener('keydown', (event: KeyboardEvent) => this.#onKeydown(event));
      this.button.disabled = !!this.disabled;
      this.button.placeholder = this.placeholder;
      this.button.size = this.size;
      this.append(this.button);

      // This is a workaround because `::slotted` does not allow you to select children
      // of the slotted elements. For example grouped options.
      const style = document.createElement('style');
      style.innerHTML = `
        sl-select:has(sl-select-button:focus-visible) .sl-current {
          background-color: var(--sl-color-select-item-hover-background);
        }
      `;
      this.append(style);
    }

    this.#observer.observe(this, OBSERVER_OPTIONS);

    this.setFormControlElement(this);

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = this.disabled ? -1 : 0;
    }
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  /** @ignore Stores the initial state of the select */
  formAssociatedCallback(): void {
    this.#initialState = this.value;
  }

  /** @ignore Resets the select to the initial state */
  formResetCallback(): void {
    this.value = this.#initialState;
    this.changeEvent.emit(this.value);
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('currentOption')) {
      this.options.forEach(option => option.classList.toggle('sl-current', option === this.currentOption));
      this.currentOption?.scrollIntoView({ block: 'nearest', inline: 'nearest' });

      if (this.currentOption) {
        this.button.setAttribute('aria-activedescendant', this.currentOption.id);
      } else {
        this.button.removeAttribute('aria-activedescendant');
      }
    }

    if (changes.has('disabled')) {
      this.tabIndex = this.disabled ? -1 : 0;
      this.button.disabled = this.disabled;
    }

    if (changes.has('placeholder')) {
      this.button.placeholder = this.placeholder;
    }

    if (changes.has('required')) {
      this.internals.ariaRequired = this.required ? 'true' : 'false';
    }

    if (changes.has('showValidity')) {
      this.button.showValidity = this.showValidity;
    }

    if (changes.has('size')) {
      this.button.size = this.size;
      this.options?.forEach(option => (option.size = this.size));
      this.optionGroups?.forEach(group => (group.size = this.size));
    }

    if (changes.has('value')) {
      if (this.selectedOption?.value !== this.value) {
        this.#setSelectedOption(this.options.find(option => option.value === this.value));
      }

      this.internals.setFormValue(this.value);
    }

    if (changes.has('required') || changes.has('value')) {
      this.internals.setValidity(
        { valueMissing: this.required && this.value === null },
        msg('An option must be selected.')
      );

      this.updateValidity();

      // NOTE: for some reason setting `showValidity` to `undefined` in the
      // `updateValidity()` method doesn't trigger a `willUpdate` call. So we
      // work around that by updating it here.
      this.button.showValidity = this.showValidity;
    }
  }

  override render(): TemplateResult {
    return html`
      <slot name="button"></slot>
      <div
        ${anchor({ element: this.button, position: 'bottom' })}
        @beforetoggle=${this.#onBeforetoggle}
        @click=${this.#onListboxClick}
        @toggle=${this.#onToggle}
        part="listbox"
        popover
        role="listbox"
      >
        <slot @slotchange=${this.#onSlotchange}></slot>
      </div>
    `;
  }

  #onBeforetoggle({ newState }: ToggleEvent): void {
    if (newState === 'open') {
      this.button.setAttribute('aria-expanded', 'true');
      this.listbox.style.width = `${this.button.getBoundingClientRect().width}px`;

      this.currentOption = this.selectedOption ?? this.options[0];
    } else {
      this.#popoverClosing = true;
      this.button.removeAttribute('aria-expanded');
    }
  }

  #onButtonClick(): void {
    if (!isPopoverOpen(this.listbox) && !this.#popoverClosing) {
      this.listbox.showPopover();
    }

    this.#popoverClosing = false;
  }

  #onFocusin(): void {
    this.focusEvent.emit();
  }

  #onFocusout(): void {
    this.blurEvent.emit();
  }

  #onKeydown(event: KeyboardEvent): void {
    const options = this.options.filter(o => !o.disabled),
      size = options.length;

    let delta = 0,
      index = options.indexOf(this.currentOption ?? this.selectedOption ?? this.options[0]);

    switch (event.key) {
      case 'ArrowDown':
        if (isPopoverOpen(this.listbox)) {
          delta = 1;
        } else {
          this.listbox.showPopover();
        }
        break;
      case 'ArrowUp':
        delta = -1;
        break;
      case 'Home':
        index = 0;
        break;
      case 'End':
        index = size - 1;
        break;
      case ' ':
      case 'Enter':
        if (isPopoverOpen(this.listbox)) {
          this.#setSelectedOption(this.currentOption);
          this.listbox.hidePopover();
        } else {
          this.listbox.showPopover();
        }

        return;
      default:
        return;
    }

    index = (index + delta + size) % size;
    this.currentOption = options[index];

    event.preventDefault();
    event.stopPropagation();
  }

  #onListboxClick(event: Event & { target: HTMLElement }): void {
    const option = event.target?.closest('sl-select-option');

    if (option) {
      this.#setSelectedOption(option);
      this.listbox.hidePopover();
    }
  }

  #onSlotchange(): void {
    this.#setSelectedOption(this.options.find(option => option.value === this.value));

    this.optionGroups?.forEach(group => {
      group.size = this.size;
      group.classList.remove('bottom-divider');

      if (group.nextElementSibling?.nodeName === 'SL-SELECT-OPTION') {
        group.classList.add('bottom-divider');
      }
    });

    this.options?.forEach(option => (option.size = this.size));
  }

  #onToggle(event: ToggleEvent): void {
    if (event.newState === 'closed') {
      this.#popoverClosing = false;
    }
  }

  /** Returns a flattened array of all options (also the options in groups). */
  #getAllOptions(root: Element): SelectOption[] {
    if (root instanceof SelectOption) {
      return [root];
    } else if (root instanceof SelectOptionGroup) {
      return Array.from(root.children).flatMap(child => this.#getAllOptions(child));
    } else {
      return [];
    }
  }

  #setSelectedOption(option?: SelectOption): void {
    if (this.selectedOption === option) {
      return;
    }

    if (this.selectedOption) {
      this.selectedOption.selected = false;
    }

    this.selectedOption = option;
    if (this.selectedOption) {
      this.selectedOption.selected = true;
    }

    this.button.selected = this.selectedOption;

    this.value = this.selectedOption?.value ?? null;
    this.changeEvent.emit(this.value);
  }
}
