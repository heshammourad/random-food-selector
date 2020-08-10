import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import format from 'date-fns/format';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { postData } from '../../api/api';
import withData from '../../common/WithData';

import './Items.scss';

const Type = ({
  data,
  match: {
    params: { typeId },
  },
  refreshData,
}) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [checked, setChecked] = useState([]);
  const [nameError, setNameError] = useState(null);
  const [dialogError, setDialogError] = useState(null);

  let availableItems = [];
  if (data && data.items) {
    availableItems = data.items
      .filter(({ available }) => available)
      .sort((a, b) => {
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
              <Typography component="h2" variant="h6">
                {data.name}
              </Typography>
              {availableItems.length > 0 ? (
                <Paper elevation={0}>
                  <List>
                    {availableItems.map(({ id, name }) => {
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
                          <ListItemText id={labelId} primary={name} />
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
          <Button
            color="secondary"
            variant="outlined"
            onClick={handleAddNewItem}
            className="btn-add-new-item"
          >
            Add New Item
          </Button>
          <Dialog open={isDialogOpen} onClose={handleDialogClose}>
            <DialogTitle>New Item</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                error={nameError}
                helperText={nameError}
                required
                onChange={clearErrors}
                margin="dense"
                id="itemName"
                label="Name"
                fullWidth
              />
              {dialogError && <DialogContentText color="error">{dialogError}</DialogContentText>}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleSubmit} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
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
