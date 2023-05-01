import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { GridColumn } from './column.js';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import type { DataSourceSortDirection, EventEmitter } from '@sl-design-system/shared';
import { faArrowDownWideShort, faArrowUpArrowDown, faArrowUpShortWide } from '@fortawesome/pro-regular-svg-icons';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { Icon } from '@sl-design-system/icon';
import { EventsController, event } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import styles from './sorter.scss.js';

export type GridSorterChange = 'added' | 'removed';

// FIXME: these should be registered in the theme
Icon.registerIcon(faArrowUpArrowDown, faArrowDownWideShort, faArrowUpShortWide);

export class GridSorter extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  #events = new EventsController(this);

  /** The grid column.  */
  @property({ attribute: false }) column!: GridColumn;

  /** The direction in which to sort the items. */
  @property({ reflect: true }) direction?: DataSourceSortDirection;

  @event() directionChange!: EventEmitter<DataSourceSortDirection | undefined>;

  @event() sorterChange!: EventEmitter<GridSorterChange>;

  override connectedCallback(): void {
    super.connectedCallback();

    this.tabIndex = 0;

    this.#events.listen(this, 'click', this.#onClick);
    this.#events.listen(this, 'keydown', this.#onKeydown);

    this.sorterChange.emit('added');
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('direction')) {
      const header = this.closest('th');

      if (!this.direction) {
        header?.removeAttribute('aria-sort');
      } else {
        header?.setAttribute('aria-sort', this.direction === 'asc' ? 'ascending' : 'descending');
      }
    }
  }

  override disconnectedCallback(): void {
    this.sorterChange.emit('removed');

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <slot></slot>
      <span aria-hidden="true" class="direction">
        ${choose(
          this.direction,
          [
            ['asc', () => html`<sl-icon name="far-arrow-up-short-wide"></sl-icon>`],
            ['desc', () => html`<sl-icon name="far-arrow-down-wide-short"></sl-icon>`]
          ],
          () => html`<sl-icon name="far-arrow-up-arrow-down"></sl-icon>`
        )}
      </span>
    `;
  }

  reset(): void {
    this.direction = undefined;
  }

  #onClick(): void {
    this.#toggleDirection();
    this.directionChange.emit(this.direction);
  }

  #onKeydown(event: KeyboardEvent): void {
    if ([' ', 'Enter'].includes(event.key)) {
      event.preventDefault();

      this.#toggleDirection();
      this.directionChange.emit(this.direction);
    }
  }

  #toggleDirection(): void {
    if (this.direction === 'asc') {
      this.direction = 'desc';
    } else if (this.direction === 'desc') {
      this.direction = undefined;
    } else {
      this.direction = 'asc';
    }
  }
}