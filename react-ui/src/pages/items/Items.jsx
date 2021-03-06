import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import differenceInDays from 'date-fns/differenceInDays';
import parseISO from 'date-fns/parseISO';
import startOfToday from 'date-fns/startOfToday';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { postData, patchData } from '../../api/api';
import { withData } from '../../common';

import ItemDialog from './ItemDialog';

import './Items.scss';

const sortByName = (a, b) => {
  const nameA = a.name;
  const nameB = b.name;
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
};

const Type = ({
  data,
  match: {
    params: { typeId },
  },
  refreshData,
}) => {
  const [availableItems, setAvailableItems] = useState([]);
  const [checked, setChecked] = useState([]);

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [dialogError, setDialogError] = useState(null);

  useEffect(() => {
    if (data && data.items) {
      const initialChecked = [];
      const newAvailableItems = data.items
        .filter(({ available }) => available)
        .map((item) => {
          const { id, lastUsedDate: lastUsedDateString } = item;
          const lastUsedDate = parseISO(lastUsedDateString);
          const daysSinceLastUse = differenceInDays(startOfToday(), lastUsedDate);

          let daysAgo = 'Last used ';
          switch (daysSinceLastUse) {
            case 0:
              daysAgo += 'today';
              break;
            case 1:
              daysAgo += '1 day ago';
              break;
            default:
              initialChecked.push(id);
              daysAgo += `${daysSinceLastUse} days ago`;
              break;
          }

          return { ...item, daysAgo };
        })
        .sort((a, b) => {
          const dateA = a.lastUsedDate;
          const dateB = b.lastUsedDate;
          if (dateA < dateB) {
            return -1;
          }
          if (dateA > dateB) {
            return 1;
          }

          return sortByName(a, b);
        });
      setAvailableItems(newAvailableItems);
      setChecked(initialChecked);
    }
  }, [data]);

  const handleAddNewItem = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditItem(null);
    setDialogError(null);
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleEditItem = (itemId) => () => {
    const item = data.items.find(({ id }) => id === itemId);
    setEditItem(item);
    setDialogOpen(true);
  };

  const typesUrl = `types/${typeId}`;

  const handleSubmit = async ({ id, ...values }) => {
    setDialogError(null);

    let response;
    if (id) {
      response = await patchData(typesUrl, { id, ...values });
    } else {
      response = await postData(typesUrl, { ...values });
    }

    if (response) {
      refreshData();
      setDialogOpen(false);
    } else {
      setDialogError('Something went wrong');
    }
  };

  return (
    <div className="type">
      {data === null ? (
        <Typography color="error" variant="caption">
          No data found
        </Typography>
      ) : (
        <>
          {data.name && (
            <>
              <Grid container alignItems="baseline" className="header">
                <Grid item xs>
                  <Typography component="h2" variant="h6">
                    {data.name}
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton
                    color="primary"
                    component="span"
                    size="small"
                    onClick={handleAddNewItem}
                  >
                    <AddIcon />
                  </IconButton>
                </Grid>
              </Grid>
              <ItemDialog
                dialogError={dialogError}
                editItem={editItem}
                isDialogOpen={isDialogOpen}
                onDialogClose={handleDialogClose}
                onSubmit={handleSubmit}
                options={data.items.filter(({ available }) => !available).sort(sortByName)}
              />
              {availableItems.length > 0 ? (
                <Paper elevation={0}>
                  <List>
                    {availableItems.map(({ daysAgo, id, name }) => {
                      const labelId = `checkbox-list-label-${id}`;
                      return (
                        <ListItem key={id} dense button onClick={handleToggle(id)}>
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={checked.indexOf(id) !== -1}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          </ListItemIcon>
                          <ListItemText id={labelId} primary={name} secondary={daysAgo} />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="edit" onClick={handleEditItem(id)}>
                              <EditIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                  </List>
                </Paper>
              ) : (
                <Typography variant="caption">No items available</Typography>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

Type.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        lastUsedDate: PropTypes.string,
        name: PropTypes.string,
      }),
    ),
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      typeId: PropTypes.string,
    }),
  }).isRequired,
  refreshData: PropTypes.func.isRequired,
};

Type.defaultProps = {
  data: {
    name: '',
    items: [],
  },
};

export default withData(Type);
