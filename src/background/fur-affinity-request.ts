export namespace FurAffinityRequest {
  export namespace Pages {
    export const BASE = 'https://www.furaffinity.net';
    export const PMS = `${BASE}/msg/pms`;
    export const OTHER = `${BASE}/msg/others`;
  }

  function get(url: string): string {
    const req = new XMLHttpRequest();
    req.open('GET', url, false);
    req.setRequestHeader('Access-Control-Allow-Origin', '*');
    req.send();
    return req.response;
  }

  export function getNotesPage(): string {
    return get(Pages.PMS);
  }

  export function getMainPage(): string {
    return get(Pages.OTHER);
  }
}
