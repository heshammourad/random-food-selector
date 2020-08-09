import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { postData } from '../../api/api';
import withData from '../../common/WithData';
import ListItemLink from '../../components/ListItemLink';

import './Types.scss';

const Types = ({ data, refreshData }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [nameError, setNameError] = useState(null);
  const [dialogError, setDialogError] = useState(null);

  const handleAddNewType = () => {
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

    const name = document.getElementById('typeName').value;
    if (name) {
      const response = await postData('/types', { name });
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
    <div className="types">
      <Typography component="h2" variant="h6">
        Food Types
      </Typography>
      {data && (
        <Paper elevation={0}>
          <List>
            {data.map(({ id, name }) => (
              <ListItemLink to={`/types/${id}`} primary={name} />
            ))}
          </List>
        </Paper>
      )}
      <Button
        color="primary"
        variant="outlined"
        onClick={handleAddNewType}
        className="btn-add-new-type"
      >
        Add New Type
      </Button>
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>New Food Type</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            error={nameError}
            helperText={nameError}
            required
            onChange={clearErrors}
            margin="dense"
            id="typeName"
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
    </div>
  );
};

Types.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  ),
  refreshData: PropTypes.func.isRequired,
};

Types.defaultProps = {
  data: null,
};

export default withData(Types);
