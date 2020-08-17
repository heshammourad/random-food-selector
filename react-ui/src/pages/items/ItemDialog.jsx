import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { DatePicker } from '@material-ui/pickers';
import subMonths from 'date-fns/subMonths';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const filter = createFilterOptions();

const ItemDialog = ({
  dialogError, isDialogOpen, onDialogClose, onSubmit, options,
}) => {
  const today = new Date();
  const [value, setValue] = useState(null);
  const [date, setDate] = useState(today);
  const [nameError, setNameError] = useState(null);

  const resetValues = () => {
    setValue(null);
    setDate(today);
    setNameError(null);
  };

  const handleClose = () => {
    resetValues();
    onDialogClose();
  };

  const handleSubmit = (event) => {
    if (!value) {
      setNameError('Please enter a name');
    }

    event.preventDefault();
    resetValues();
    onSubmit({ ...value, date });
  };

  return (
    <Dialog open={isDialogOpen} onClose={handleClose} fullWidth>
      <DialogTitle>New Item</DialogTitle>
      <DialogContent>
        <Autocomplete
          value={value}
          onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
              setValue({ name: newValue });
            } else if (newValue && newValue.inputValue) {
              setValue({ name: newValue.inputValue });
            } else {
              setValue(newValue);
            }
            setDate(today);
            setNameError(null);
          }}
          filterOptions={(opts, params) => {
            const filtered = filter(opts, params);

            if (params.inputValue !== '') {
              filtered.push({
                inputValue: params.inputValue,
                name: `Add "${params.inputValue}"`,
              });
            }

            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="value-select"
          options={options}
          getOptionLabel={(option) => {
            if (typeof option === 'string') {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option.name;
          }}
          renderOption={(option) => option.name}
          autoFocus
          required
          fullWidth
          freeSolo
          error={nameError}
          helperText={nameError}
          renderInput={(params) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <TextField {...params} label="Name" margin="dense" />
          )}
        />
        {value && (
          <DatePicker
            value={date}
            onChange={setDate}
            disableFuture
            minDate={subMonths(today, 1)}
            margin="dense"
            label="Date"
            id="date"
            fullWidth
          />
        )}
        {dialogError && <DialogContentText color="error">{dialogError}</DialogContentText>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onDialogClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ItemDialog.propTypes = {
  dialogError: PropTypes.string,
  isDialogOpen: PropTypes.bool.isRequired,
  onDialogClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  ),
};

ItemDialog.defaultProps = {
  dialogError: null,
  options: [],
};

export default ItemDialog;
