import React from 'react';
import { StorageFields } from '../../../background/interfaces/storage-fields.interface';
import {
  Toolbar,
  Typography,
  Container,
  FormControl,
  FormLabel,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import { Extensions } from '../extensions';

interface Props extends StorageFields {
  settingsUpdateFn: () => void;
}

export default class Settings extends React.Component<Props> {
  private async handleChange(
    fieldName: keyof StorageFields,
    event: any,
    value: boolean
  ) {
    await Extensions.setStorageValues({ [fieldName]: value });
    this.props.settingsUpdateFn();
  }

  render() {
    return (
      <div>
        <Toolbar>
          <Typography variant="h6">Settings</Typography>
        </Toolbar>
        <Container className="container-height">
          <FormControl style={{ width: '50%' }}>
            <FormLabel component="legend">Notifications</FormLabel>
            <FormControlLabel
              control={
                <Switch
                  checked={this.props.enableCommentNotifications}
                  onChange={this.handleChange.bind(
                    this,
                    'enableCommentNotifications'
                  )}
                />
              }
              label="Comments"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={this.props.enableFavoriteNotifications}
                  onChange={this.handleChange.bind(
                    this,
                    'enableFavoriteNotifications'
                  )}
                />
              }
              label="Favorites"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={this.props.enableJournalNotifications}
                  onChange={this.handleChange.bind(
                    this,
                    'enableJournalNotifications'
                  )}
                />
              }
              label="Journals"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={this.props.enableNoteNotifications}
                  onChange={this.handleChange.bind(
                    this,
                    'enableNoteNotifications'
                  )}
                />
              }
              label="Notes"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={this.props.enableWatchNotifications}
                  onChange={this.handleChange.bind(
                    this,
                    'enableWatchNotifications'
                  )}
                />
              }
              label="Watches"
            />
          </FormControl>

          <FormControl style={{ width: '50%' }}>
            <FormLabel component="legend">
              System Notification Settings
            </FormLabel>
            <FormControlLabel
              control={
                <Switch
                  checked={this.props.silentNotifications}
                  onChange={this.handleChange.bind(this, 'silentNotifications')}
                />
              }
              label="Silent notifications"
            />
          </FormControl>
        </Container>
      </div>
    );
  }
}
