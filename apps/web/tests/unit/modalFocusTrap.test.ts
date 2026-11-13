// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getModalBoxFocusables,
  handleModalTabKey,
} from '../../src/lib/utils/modalFocusTrap';

function markup(): string {
  return `
    <dialog class="modal" open>
      <div class="modal-box">
        <input id="name" type="text" />
        <button id="cancel">Cancel</button>
        <button id="save">Save</button>
      </div>
      <div class="modal-backdrop" aria-hidden="true">
        <button id="backdrop-close">close</button>
      </div>
    </dialog>
  `;
}

describe('getModalBoxFocusables', () => {
  let dialog: HTMLDialogElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <dialog class="modal" open>
        <div class="modal-box">
          <input id="one" type="text" />
          <button id="two">Cancel</button>
          <button id="three" disabled>Disabled</button>
          <button id="four">Save</button>
        </div>
        <div class="modal-backdrop" aria-hidden="true"></div>
      </dialog>
    `;
    dialog = document.querySelector('dialog')!;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns only enabled focusables inside modal-box', () => {
    const els = getModalBoxFocusables(dialog);
    expect(els.map((el) => el.id)).toEqual(['one', 'two', 'four']);
  });
});

describe('handleModalTabKey', () => {
  let dialog: HTMLDialogElement;
  let input: HTMLInputElement;
  let save: HTMLButtonElement;
  let backdropClose: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = markup();
    dialog = document.querySelector('dialog')!;
    input = document.getElementById('name') as HTMLInputElement;
    save = document.getElementById('save') as HTMLButtonElement;
    backdropClose = document.getElementById('backdrop-close') as HTMLButtonElement;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('wraps Tab forward from last control to first', () => {
    const e = new KeyboardEvent('keydown', { key: 'Tab' });
    const result = handleModalTabKey(dialog, e, save);
    expect(result).toEqual({ prevented: true, nextFocus: input });
  });

  it('wraps Shift+Tab from first control to last', () => {
    const e = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
    const result = handleModalTabKey(dialog, e, input);
    expect(result).toEqual({ prevented: true, nextFocus: save });
  });

  it('wraps Tab when focus escaped to backdrop close button', () => {
    const e = new KeyboardEvent('keydown', { key: 'Tab' });
    const result = handleModalTabKey(dialog, e, backdropClose);
    expect(result).toEqual({ prevented: true, nextFocus: input });
  });

  it('wraps Shift+Tab when active element is outside modal-box', () => {
    const e = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
    const result = handleModalTabKey(dialog, e, document.body);
    expect(result).toEqual({ prevented: true, nextFocus: save });
  });

  it('does not trap when Tab moves between interior controls', () => {
    const cancel = document.getElementById('cancel')!;
    const e = new KeyboardEvent('keydown', { key: 'Tab' });
    expect(handleModalTabKey(dialog, e, input)).toEqual({ prevented: false, nextFocus: null });
    expect(handleModalTabKey(dialog, e, cancel)).toEqual({ prevented: false, nextFocus: null });
  });
});
