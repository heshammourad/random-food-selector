import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

import withData from '../../common/WithData';

const Type = ({ data }) => {
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

        // names must be equal
        return 0;
      });
  }
  return (
    <>
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
                <div>Items Go Here</div>
              ) : (
                <Typography variant="caption">No items available</Typography>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

Type.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape()),
  }),
};

Type.defaultProps = {
  data: {
    name: '',
    items: [],
  },
};

export default withData(Type);
