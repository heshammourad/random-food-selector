import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormatControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { DatePicker } from '@material-ui/pickers';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import subMonths from 'date-fns/subMonths';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

const filter = createFilterOptions();

const ItemDialog = ({
  dialogError, editItem, isDialogOpen, onDialogClose, onSubmit, options,
}) => {
  const today = new Date();
  const [value, setValue] = useState(null);
  const [name, setName] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [date, setDate] = useState(today);
  const [nameError, setNameError] = useState(null);

  const resetValues = () => {
    setValue(null);
    setName(null);
    setIsAvailable(true);
    setDate(today);
    setNameError(null);
  };

  useEffect(() => {
    resetValues();
  }, [isDialogOpen]);

  useEffect(() => {
    if (editItem) {
      const { name: editItemName, lastUsedDate } = editItem;
      setName(editItemName);
      setDate(parseISO(lastUsedDate));
    }
  }, [editItem]);

  const handleClose = () => {
    resetValues();
    onDialogClose();
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setIsAvailable(event.target.checked);
  };

  const handleSubmit = (event) => {
    if (!value && !name) {
      setNameError('Please enter a name');
    }

    event.preventDefault();
    const submitBody = editItem ? { ...editItem, name } : { ...value };
    onSubmit({ ...submitBody, lastUsedDate: format(date, 'yyyy-MM-dd'), isAvailable });
  };

  return (
    <Dialog open={isDialogOpen} onClose={handleClose} fullWidth>
      <DialogTitle>New Item</DialogTitle>
      <DialogContent>
        {editItem ? (
          <TextField
            autoFocus
            error={nameError}
            helperText={nameError}
            required
            value={name}
            onChange={handleNameChange}
            margin="dense"
            id="itemName"
            label="Name"
            fullWidth
          />
        ) : (
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
        )}
        {(value || editItem) && (
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
        {editItem && (
          <FormatControlLabel
            control={<Checkbox checked={isAvailable} onChange={handleCheckboxChange} />}
            label="Available?"
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
  editItem: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    lastUsedDate: PropTypes.string,
  }),
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
  editItem: null,
  options: [],
};

export default ItemDialog;
