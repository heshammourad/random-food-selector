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
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import startOfToday from 'date-fns/startOfToday';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { postData } from '../../api/api';
import { withData } from '../../common';

import ItemDialog from './ItemDialog';

import './Items.scss';

const Type = ({
  data,
  match: {
    params: { typeId },
  },
  refreshData,
}) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isInitialLoad, setInitialLoad] = useState(false);
  const [checked, setChecked] = useState([]);
  const [nameError, setNameError] = useState(null);
  const [dialogError, setDialogError] = useState(null);

  let availableItems = [];
  if (data && data.items) {
    const initialChecked = [];
    availableItems = data.items
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

        const nameA = a.name;
        const nameB = b.name;
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    if (availableItems.length && !isInitialLoad) {
      setInitialLoad(true);
      setChecked(initialChecked);
    }
  }

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

  const handleAddNewItem = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const clearErrors = () => {
    setNameError(null);
    setDialogError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearErrors();

    const name = document.getElementById('itemName').value;
    if (name) {
      const lastUsedDate = format(new Date(), 'yyyy-MM-dd');
      const response = await postData(`types/${typeId}`, { name, lastUsedDate });
      if (response) {
        refreshData();
        setDialogOpen(false);
      } else {
        setDialogError('Something went wrong');
      }
    } else {
      setNameError('Please enter a name');
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
                clearErrors={clearErrors}
                dialogError={dialogError}
                isDialogOpen={isDialogOpen}
                nameError={nameError}
                onDialogClose={handleDialogClose}
                onSubmit={handleSubmit}
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
                            <IconButton edge="end" aria-label="edit">
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
