import withData from '../common/WithData';

import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Types = ({ data }) => (
  <>
    <h2>Food Types</h2>
    {data && (
      <ul>
        {data.map(({ id, name }) => (
          <li key={id}>
            <Link to={`/types/${id}`}>{name}</Link>
          </li>
        ))}
      </ul>
    )}
  </>
);

Types.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  ),
};

Types.defaultProps = {
  data: null,
};

export default withData(Types);
