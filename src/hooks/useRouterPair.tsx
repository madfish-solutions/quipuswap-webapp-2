import { useRouter } from 'next/router';

export const useRouterPair = () => {
  const router = useRouter();
  let urlSearchParams;
  if (!router.query['from-to'] || typeof router.query['from-to'] !== 'string') {
    const pos = window.location.pathname.indexOf('/swap/');
    urlSearchParams = window.location.pathname.slice(pos + 6).split('-');
  } else {
    urlSearchParams = router.query['from-to'].split('-');
  }
  const params = Object.fromEntries(new Map(urlSearchParams.map((x, i) => [i === 0 ? 'from' : 'to', x])));
  const { from, to } = params;
  return { from, to };
};
