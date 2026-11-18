import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Navigation from '@/app/_components/Navigation';
import { tokens } from './class-names';

describe('primary navigation', () => {
  it('shows the inline links from tablet width and hides them on phones', async () => {
    render(await Navigation());
    const list = screen.getByRole('list');
    const nav = list.closest('nav');

    expect(tokens(nav)).toContain('text-sm');
    expect(tokens(nav)).toContain('lg:text-base');

    expect(tokens(list)).toContain('hidden');
    expect(tokens(list)).toContain('sm:flex');
    expect(tokens(list)).toContain('gap-1');
    expect(tokens(list)).toContain('lg:gap-3');
  });

  it('collapses into a menu button on phones that opens and closes the links', async () => {
    render(await Navigation());
    const toggle = screen.getByRole('button', { name: /open menu/i });

    expect(tokens(toggle.parentElement)).toContain('sm:hidden');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getAllByRole('list')).toHaveLength(1);

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const menu = document.getElementById('mobile-menu');
    expect(menu).toBeTruthy();
    expect(menu.querySelectorAll('a')).toHaveLength(3);
    expect(tokens(menu.querySelector('a'))).toContain('py-3');

    fireEvent.click(screen.getByRole('button', { name: /close menu/i }));
    expect(document.getElementById('mobile-menu')).toBeNull();
  });
});
