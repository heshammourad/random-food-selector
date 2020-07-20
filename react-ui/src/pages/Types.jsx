import withData from '../common/WithData';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Types = ({ data }) => {
  const [shouldShowAddPanel, setShouldShowAddPanel] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = document.getElementById('typeName').value;
    if (name) {
      // Submit name
    }
  };

  return (
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
      <Button
        type="button"
        onClick={() => setShouldShowAddPanel(true)}
        disabled={shouldShowAddPanel}
      >
        Add New Type
      </Button>
      {shouldShowAddPanel && (
        <Form id="newTypeForm" onSubmit={handleSubmit}>
          <Form.Group controlId="typeName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" />
          </Form.Group>
          <Button variant="secondary" type="submit">
            Submit
          </Button>
        </Form>
      )}
    </>
  );
};

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