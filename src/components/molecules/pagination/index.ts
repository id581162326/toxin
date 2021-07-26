import {flow, pipe} from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';

class Pagination {
  constructor(private readonly wrap: HTMLElement) {
    this.initItems();
    this.initEllipsis();
    this.initNavItems();
    this.initLinks();
    this.initNavLinks();
  }

  private readonly current = pipe(
    new URL(window.location.href).searchParams.get('CURRENT_PAGE'), O.fromNullable,
    O.map(flow(Number, H.dec)), O.getOrElse(() => 0)
  );

  private readonly ellipsis = pipe(this.wrap, H.querySelectorAll<HTMLLIElement>('.js-pagination__ellipsis'));
  private readonly items = pipe(this.wrap, H.querySelectorAll<HTMLLIElement>('.js-pagination__item'));
  private readonly links = pipe(this.wrap, H.querySelectorAll<HTMLAnchorElement>('.js-pagination__link'));
  private readonly navItems = pipe(this.wrap, H.querySelectorAll<HTMLLIElement>('.js-pagination__nav-item'));
  private readonly navLinks = pipe(this.wrap, H.querySelectorAll<HTMLAnchorElement>('.js-pagination__nav-link'));

  private readonly initItems = () => pipe(this.items, A.mapWithIndex(this.setItemAppearance));
  private readonly initEllipsis = () => pipe(this.ellipsis, A.mapWithIndex(this.setEllipsisVisibility));
  private readonly initNavItems = () => pipe(this.navItems, A.mapWithIndex(this.setNavItemAppearance));
  private readonly initLinks = () => pipe(this.links, A.mapWithIndex(this.setLinkAttrs));
  private readonly initNavLinks = () => pipe(this.navLinks, A.mapWithIndex(this.setNavLinksAttrs));

  private readonly getLinkHref = (idx: number) => pipe(true, H.switchCases([
    [window.location.href.includes('?'), () => window.location.href + `&CURRENT_PAGE=${idx + 1}`],
    [window.location.href.includes(`CURRENT_PAGE=${this.current + 1}`), () =>
      window.location.href.replace(`CURRENT_PAGE=${this.current + 1}`, `CURRENT_PAGE=${idx + 1}`)],
  ], () => window.location.href + `?CURRENT_PAGE=${idx + 1}`));

  private readonly setLinkAttrs = (idx: number, link: HTMLAnchorElement) => pipe(link, pipe(true, H.switchCases([
    [idx === this.current, () => flow(
      H.setAttribute('aria-current', 'page'),
      H.setAttribute('href', this.getLinkHref(idx)),
    )],
    [idx !== this.current, () => H.setAttribute('href', this.getLinkHref(idx))],
    [idx > this.current + 2 && idx !== this.items.length - 1, () => flow(
      H.setAttribute('href', this.getLinkHref(idx)),
      H.setAttribute('tabindex', '-1')
    )],
    [idx < this.current - 2 && idx !== 0, () => flow(
      H.setAttribute('href', this.getLinkHref(idx)),
      H.setAttribute('tabindex', '-1')
    )]
  ], () => (link: HTMLAnchorElement) => link)));

  private readonly setNavLinksAttrs = (idx: number, link: HTMLAnchorElement) => pipe(link, pipe(true, H.switchCases([
    [idx === 0, () => H.setAttribute('href', this.getLinkHref(this.current - 1))],
    [idx === 1, () => H.setAttribute('href', this.getLinkHref(this.current + 1))]
  ], () => (link: HTMLAnchorElement) => link)));

  private readonly setItemAppearance = (idx: number, item: HTMLLIElement) => pipe(item, pipe(true, H.switchCases([
    [idx === this.current, () => H.addClassList(['pagination__item_is_current'])],
    [idx === 0 && !this.current, () => H.addClassList(['pagination__item_is_current'])],
    [idx > this.current + 2 && idx !== this.items.length - 1, () => H.addClassList(['pagination__item_hidden'])],
    [idx < this.current - 2 && idx !== 0, () => H.addClassList(['pagination__item_hidden'])]
  ], () => (item: HTMLLIElement) => item)));

  private readonly setEllipsisVisibility = (idx: number, ellipsis: HTMLLIElement) => pipe(ellipsis, pipe(true, H.switchCases([
    [idx === 0 && this.current < 4, () => H.addClassList(['pagination__ellipsis_hidden'])],
    [idx === 1 && this.current > this.items.length - 5, () => H.addClassList(['pagination__ellipsis_hidden'])]
  ], () => (item: HTMLLIElement) => item)));

  private readonly hideNavItem = (item: HTMLLIElement) => pipe(
    item,
    H.addClassList(['pagination__item_hidden']),
    H.setAttribute('aria-hidden', 'true')
  );

  private readonly setNavItemAppearance = (idx: number, navItem: HTMLLIElement) => pipe(navItem, pipe(true, H.switchCases([
    [idx === 0 && this.current === 0, () => this.hideNavItem],
    [idx === 1 && this.current === this.items.length - 1, () => this.hideNavItem],
  ], () => (item: HTMLLIElement) => item)));
}

export default Pagination;