export namespace FurAffinityRequest {
  export namespace Pages {
    export const BASE = 'https://www.furaffinity.net';
    export const PMS = `${BASE}/msg/pms`;
    export const OTHER = `${BASE}/msg/others`;
  }

  function get(url: string): Promise<string> {
    return new Promise((resolve) => {
      const req = new XMLHttpRequest();
      req.open('GET', url);
      req.setRequestHeader('Access-Control-Allow-Origin', '*');
      req.addEventListener('load', function () {
        resolve(this.responseText);
      });
      req.send();
    });
  }

  export function getNotesPage(): Promise<string> {
    return get(Pages.PMS);
  }

  export function getMainPage(): Promise<string> {
    return get(Pages.OTHER);
  }
}
