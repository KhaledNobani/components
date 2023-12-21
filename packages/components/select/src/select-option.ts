import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { SelectSize } from './select.js';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './select-option.scss.js';

let nextUniqueId = 0;

export class SelectOption extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Whether the option item is disabled. */
  @property({ reflect: true, type: Boolean }) disabled?: boolean;

  /** Whether the option item is selected. */
  @property({ reflect: true, type: Boolean }) selected?: boolean;

  /** @ignore The size of the select, is set by the select component. */
  @property({ reflect: true }) size: SelectSize = 'md';

  /** The value for the option item, to be used in forms.*/
  @property() value: string | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    this.id ||= `sl-select-option-${nextUniqueId++}`;
    this.setAttribute('role', 'option');
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('disabled')) {
      this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
    }

    if (changes.has('selected')) {
      this.setAttribute('aria-selected', this.selected ? 'true' : 'false');
    }
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
