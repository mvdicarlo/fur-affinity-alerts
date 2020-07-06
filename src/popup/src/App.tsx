import React from 'react';
import './App.css';
import {
  BottomNavigation,
  BottomNavigationAction,
  Icon,
  Badge,
  Toolbar,
  Typography,
  AppBar,
} from '@material-ui/core';
import { StorageFields } from '../../background/interfaces/storage-fields.interface';
import { Extensions } from './extensions';
import Settings from './pages/Settings';
import RecordList from './pages/RecordsList';
import { PageType } from './page.type';
import { RecordCollection } from '../../background/interfaces/record-collection.interface';

interface State extends StorageFields {
  route?: PageType;
}

export default class App extends React.Component<any, State> {
  state: State = {
    route: 'comments',
    commentRecords: [],
    enableCommentNotifications: true,
    enableFavoriteNotifications: true,
    enableJournalNotifications: true,
    enableNoteNotifications: true,
    enableWatchNotifications: true,
    favoriteRecords: [],
    isLoggedIn: false,
    journalRecords: [],
    noteRecords: [],
    recordCounts: {
      comments: 0,
      favorites: 0,
      journals: 0,
      notes: 0,
      submissions: 0,
      watches: 0,
    },
    silentNotifications: false,
    watchRecords: [],
  };

  constructor(props: any) {
    super(props);
    this.update();
    setTimeout(this.update.bind(this), 5000);
  }

  private update() {
    Extensions.getStorageValue().then((data) => this.setState(data));
  }

  private getRecords(type: PageType): RecordCollection {
    switch (type) {
      case 'comments':
        return this.state.commentRecords;
      case 'favorites':
        return this.state.favoriteRecords;
      case 'journals':
        return this.state.journalRecords;
      case 'notes':
        return this.state.noteRecords;
      case 'watches':
        return this.state.watchRecords;
    }
    return [];
  }

  private getRecordSettingsPropName(
    type: PageType
  ): keyof StorageFields | null {
    switch (type) {
      case 'comments':
        return 'enableCommentNotifications';
      case 'favorites':
        return 'enableFavoriteNotifications';
      case 'journals':
        return 'enableJournalNotifications';
      case 'notes':
        return 'enableNoteNotifications';
      case 'watches':
        return 'enableWatchNotifications';
    }
    return null;
  }

  private getDisplay() {
    switch (this.state.route) {
      case 'settings':
        return (
          <Settings settingsUpdateFn={this.update.bind(this)} {...this.state} />
        );
      default:
        const notificationProp = this.getRecordSettingsPropName(
          this.state.route!
        );
        return this.state.isLoggedIn ? (
          <RecordList
            type={this.state.route!}
            records={this.getRecords(this.state.route!)}
            notificationPropName={notificationProp!}
            notificationEnabledValue={this.state[notificationProp!] as boolean}
            settingsUpdateFn={this.update.bind(this)}
          />
        ) : (
          <div style={{ color: 'red', textAlign: 'center' }}>
            <h1>You are not logged in.</h1>
          </div>
        );
    }
  }

  render() {
    return (
      <div>
        <AppBar>
          <Toolbar>
            <Typography variant="h6">Fur Affinity Alerts</Typography>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <div>{this.getDisplay()}</div>

        <BottomNavigation
          style={{ paddingTop: '0.5em' }}
          className="MuiPaper-elevation2"
          showLabels
          value={this.state.route}
          onChange={(event, value: PageType) => {
            if (value === 'submissions') {
              window.open('https://furaffinity.net/msg/submissions/', '_blank');
            } else {
              Extensions.setStorageValues({ route: value });
              this.setState({ route: value });
            }
          }}
        >
          <BottomNavigationAction
            label="Submissions"
            value="submissions"
            icon={
              <Badge
                badgeContent={this.state.recordCounts.submissions}
                max={100000}
                color="error"
              >
                <Icon>wallpaper</Icon>
              </Badge>
            }
          />
          <BottomNavigationAction
            label="Comments"
            value="comments"
            icon={
              <Badge
                max={100000}
                badgeContent={this.state.recordCounts.comments}
                color="error"
              >
                <Icon>comment</Icon>
              </Badge>
            }
          />
          <BottomNavigationAction
            label="Favorites"
            value="favorites"
            icon={
              <Badge
                max={100000}
                badgeContent={this.state.recordCounts.favorites}
                color="error"
              >
                <Icon>favorite</Icon>
              </Badge>
            }
          />
          <BottomNavigationAction
            label="Journals"
            value="journals"
            icon={
              <Badge
                badgeContent={this.state.recordCounts.journals}
                max={100000}
                color="error"
              >
                <Icon>rss_feed</Icon>
              </Badge>
            }
          />
          <BottomNavigationAction
            label="Notes"
            value="notes"
            icon={
              <Badge
                badgeContent={this.state.recordCounts.notes}
                color="error"
                max={100000}
              >
                <Icon>email</Icon>
              </Badge>
            }
          />
          <BottomNavigationAction
            label="Watches"
            value="watches"
            icon={
              <Badge
                badgeContent={this.state.recordCounts.watches}
                max={100000}
                color="error"
              >
                <Icon>visibility</Icon>
              </Badge>
            }
          />
          <BottomNavigationAction
            label="Settings"
            value="settings"
            icon={<Icon>settings</Icon>}
          />
        </BottomNavigation>
      </div>
    );
  }
}
