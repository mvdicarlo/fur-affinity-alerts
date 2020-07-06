import React from 'react';
import { RecordCollection } from '../../../background/interfaces/record-collection.interface';
import {
  Toolbar,
  Typography,
  Container,
  IconButton,
  Icon,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@material-ui/core';
import { PageType } from '../page.type';
import { Extensions } from '../extensions';

interface Props {
  type: PageType;
  records: RecordCollection;
  notificationPropName: string;
  notificationEnabledValue: boolean;
  settingsUpdateFn: () => void;
}

export default class RecordList extends React.Component<Props> {
  render() {
    return (
      <div>
        <Toolbar className="header-toolbar">
          <Typography variant="h6">
            <div style={{ textTransform: 'capitalize' }}>
              <span style={{ marginRight: '0.25em' }}>{this.props.type}</span>
              <IconButton
                size="small"
                color="primary"
                onClick={async () => {
                  await Extensions.setStorageValues({
                    [this.props.notificationPropName]: !this.props
                      .notificationEnabledValue,
                  });
                  this.props.settingsUpdateFn();
                }}
              >
                {this.props.notificationEnabledValue ? (
                  <Icon>notifications</Icon>
                ) : (
                  <Icon>notifications_off</Icon>
                )}
              </IconButton>
            </div>
          </Typography>
        </Toolbar>
        <Container className="container-height">
          <List>
            {this.props.records.map((record) => (
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    {(record.subtype || record.type)[0].toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <div>
                      <a
                        href={record.url || record.onUrl || record.fromUrl}
                        target="_blank"
                      >
                        {record.on || record.from}
                      </a>
                    </div>
                  }
                  secondary={
                    record.on ? (
                      <div>
                        <a href={record.fromUrl} target="_blank">
                          {record.from}
                        </a>
                      </div>
                    ) : null
                  }
                />
              </ListItem>
            ))}
          </List>
        </Container>
      </div>
    );
  }
}
