import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { DatePicker } from '@material-ui/pickers/';
import subMonths from 'date-fns/subMonths';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const ItemDialog = ({
  clearErrors,
  dialogError,
  isDialogOpen,
  nameError,
  onDialogClose,
  onSubmit,
}) => {
  const today = new Date();
  const [date, handleDateChange] = useState(today);
  return (
    <Dialog open={isDialogOpen} onClose={onDialogClose}>
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
        <DatePicker
          value={date}
          onChange={handleDateChange}
          disableFuture
          minDate={subMonths(today, 1)}
          margin="dense"
          label="Date"
          fullWidth
        />
        {dialogError && <DialogContentText color="error">{dialogError}</DialogContentText>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onDialogClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ItemDialog.propTypes = {
  clearErrors: PropTypes.func.isRequired,
  dialogError: PropTypes.string,
  isDialogOpen: PropTypes.bool.isRequired,
  nameError: PropTypes.string,
  onDialogClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

ItemDialog.defaultProps = {
  dialogError: null,
  nameError: null,
};

export default ItemDialog;
