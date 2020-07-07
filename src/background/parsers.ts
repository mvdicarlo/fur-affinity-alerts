import { FurAffinityRecordCounts } from './interfaces/fur-affinity-record-counts.interface';
import { RecordCollection } from './interfaces/record-collection.interface';
import { FurAffinityRequest } from './fur-affinity-request';

export namespace Parser {
  export function isLoggedIn(html: string): boolean {
    return html && html.includes('id="my-username"');
  }

  export function getUsername(doc: Document): string {
    return (<HTMLElement>doc.querySelectorAll('#my-username')[1]).innerText
      .replace(')', '')
      .trim();
  }

  export function getRecordCounts(doc: Document): FurAffinityRecordCounts {
    const records: FurAffinityRecordCounts = {
      comments: 0,
      favorites: 0,
      journals: 0,
      notes: 0,
      submissions: 0,
      watches: 0,
    };

    doc
      .querySelectorAll('.notification-container')
      .forEach((notification: HTMLElement) => {
        const charArr = Array.from(notification.innerText);
        const id = charArr.pop();
        const count = Number(charArr.join(''));
        switch (id) {
          case 'C':
            records.comments = count;
            break;
          case 'F':
            records.favorites = count;
            break;
          case 'J':
            records.journals = count;
            break;
          case 'N':
            records.notes = count;
            break;
          case 'S':
            records.submissions = count;
            break;
          case 'W':
            records.watches = count;
            break;
        }
      });

    return records;
  }

  export function getCommentRecords(doc: Document): RecordCollection {
    const records: RecordCollection = [];

    // Submissions
    try {
      doc
        .querySelector('#messages-comments-submission')
        .querySelectorAll('li')
        .forEach((element: HTMLElement) => {
          try {
            const anchors = element.querySelectorAll('a');

            records.push({
              value: element.querySelector('input').value,
              bulkUrl: `${FurAffinityRequest.Pages.BASE}/msg/others/#comments`,
              from: (<HTMLElement>anchors[0]).innerText,
              fromUrl: `${FurAffinityRequest.Pages.BASE}${<any>(
                anchors[0].href.match(/\/user.*/)
              )}`,
              on: (<HTMLElement>anchors[1]).innerText,
              onUrl: `${FurAffinityRequest.Pages.BASE}${<any>(
                anchors[1].href.match(/\/view.*/)
              )}`,
              type: 'comment',
            });
          } catch {
            // Swallow
          }
        });
    } catch (err) {
      console.error(err);
    }

    // Journals
    try {
      doc
        .querySelector('#messages-comments-journal')
        .querySelectorAll('li')
        .forEach((element: HTMLElement) => {
          try {
            const anchors = element.querySelectorAll('a');

            records.push({
              value: element.querySelector('input').value,
              bulkUrl: `${FurAffinityRequest.Pages.BASE}/msg/others/#comments`,
              from: (<HTMLElement>anchors[0]).innerText,
              fromUrl: `${FurAffinityRequest.Pages.BASE}${<any>(
                anchors[0].href.match(/\/user.*/)
              )}`,
              on: (<HTMLElement>anchors[1]).innerText,
              onUrl: `${FurAffinityRequest.Pages.BASE}${<any>(
                anchors[1].href.match(/\/journal.*/)
              )}`,
              type: 'comment',
              subtype: 'journal comment',
            });
          } catch {
            // Swallow
          }
        });
    } catch (err) {
      console.error(err);
    }

    // Shouts
    try {
      doc
        .querySelector('#messages-shouts')
        .querySelectorAll('li')
        .forEach((element: HTMLElement) => {
          try {
            const anchors = element.querySelectorAll('a');

            records.push({
              value: element.querySelector('input').value,
              bulkUrl: `${FurAffinityRequest.Pages.BASE}/msg/others/#shouts`,
              from: (<HTMLElement>anchors[0]).innerText,
              fromUrl: `${FurAffinityRequest.Pages.BASE}${<any>(
                anchors[0].href.match(/\/user.*/)
              )}`,
              type: 'comment',
              subtype: 'shout',
            });
          } catch {
            // Swallow
          }
        });
    } catch (err) {
      console.error(err);
    }

    return records;
  }

  export function getFavoriteRecords(doc: Document): RecordCollection {
    const records: RecordCollection = [];

    try {
      doc
        .querySelector('#messages-favorites')
        .querySelectorAll('li')
        .forEach((element: HTMLElement) => {
          try {
            const anchors = element.querySelectorAll('a');

            records.push({
              value: element.querySelector('input').value,
              bulkUrl: `${FurAffinityRequest.Pages.BASE}/msg/others/#watches`,
              from: (<HTMLElement>anchors[0]).innerText,
              fromUrl: `${FurAffinityRequest.Pages.BASE}${<any>(
                anchors[0].href.match(/\/user.*/)
              )}`,
              on: (<HTMLElement>anchors[1]).innerText,
              onUrl: `${FurAffinityRequest.Pages.BASE}${<any>(
                anchors[1].href.match(/\/view.*/)
              )}`,
              type: 'favorite',
            });
          } catch {
            // Swallow
          }
        });
    } catch (err) {
      console.error(err);
    }

    return records;
  }

  export function getJournalRecords(doc: Document): RecordCollection {
    const records: RecordCollection = [];

    try {
      doc
        .querySelector('#messages-journals')
        .querySelectorAll('li')
        .forEach((element: HTMLElement) => {
          try {
            const anchors = element.querySelectorAll('a');

            records.push({
              value: element.querySelector('input').value,
              bulkUrl: `${FurAffinityRequest.Pages.BASE}/msg/others/#journals`,
              from: (<HTMLElement>anchors[1]).innerText,
              fromUrl: `${FurAffinityRequest.Pages.BASE}${<any>(
                anchors[1].href.match(/\/user.*/)
              )}`,
              on: (<HTMLElement>anchors[0]).innerText,
              onUrl: `${FurAffinityRequest.Pages.BASE}${<any>(
                anchors[0].href.match(/\/journal.*/)
              )}`,
              type: 'journal',
            });
          } catch {
            // Swallow
          }
        });
    } catch (err) {
      console.error(err);
    }

    return records;
  }

  export function getNoteRecords(doc: Document): RecordCollection {
    const records: RecordCollection = [];

    try {
      doc
        .querySelector('#notes-list')
        .querySelectorAll('.note-list-container')
        .forEach((element: HTMLElement) => {
          try {
            if (!element.querySelector('.unread')) return;

            records.push({
              value: element.querySelector('input').value,
              bulkUrl: `${FurAffinityRequest.Pages.BASE}/msg/pms/`,
              from: (<HTMLElement>(
                element.querySelector('.note-list-sender')
              )).innerText
                .trim()
                .replace('~', ''),
              fromUrl: `${FurAffinityRequest.Pages.BASE}${element
                .querySelector('.note-list-sender')
                .querySelector('a')
                .href.match(/\/user.*/)}`,
              on: (<HTMLElement>(
                element.querySelector('.note-list-subject')
              )).innerText.trim(),
              onUrl: `${FurAffinityRequest.Pages.BASE}${(<any>(
                element.querySelector('.unread')
              )).href.match(/\/msg.*/)}`,
              type: 'note',
            });
          } catch {
            // Swallow
          }
        });
    } catch (err) {
      console.error(err);
    }

    return records;
  }

  export function getWatchRecords(doc: Document): RecordCollection {
    const records: RecordCollection = [];

    try {
      doc
        .querySelector('#messages-watches')
        .querySelectorAll('li')
        .forEach((element: HTMLElement) => {
          try {
            records.push({
              value: element.querySelector('input').value,
              bulkUrl: `${FurAffinityRequest.Pages.BASE}/msg/others/#watches`,
              from: (<HTMLElement>element.querySelector('.info span'))
                .innerText,
              fromUrl: `${FurAffinityRequest.Pages.BASE}${(<any>(
                element.querySelector('.avatar a')
              )).href.match(/\/user.*/)}`,
              type: 'watch',
            });
          } catch {
            // Swallow
          }
        });
    } catch (err) {
      console.error(err);
    }

    return records;
  }
}
